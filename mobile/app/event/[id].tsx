import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";

import { Event } from "@/interfaces";
import { ThemedText } from "@/components/themed-text";
import { useEventDetail } from "@/hooks/useEventDetail";
import { useAuth } from "@/context/AuthContext";
import {
  signUpForEventShift,
  getUserShiftForEvent,
  cancelVolunteerShift,
} from "@/firebase/services/shifts";

const EVENT_STATUS_CONFIG: Record<
  Event["status"],
  { label: string; bg: string; text: string }
> = {
  draft:     { label: "Draft",     bg: "#F3F4F6", text: "#374151" },
  published: { label: "Open",      bg: "#E8F0FE", text: "#1D4ED8" },
  active:    { label: "Active",    bg: "#DCFCE7", text: "#166534" },
  completed: { label: "Completed", bg: "#E5E7EB", text: "#6B7280" },
  cancelled: { label: "Cancelled", bg: "#FEF2F2", text: "#991B1B" },
};

function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const full = date.toLocaleDateString(undefined, {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const short = date.toLocaleDateString(undefined, {
    month: "long", day: "numeric", year: "numeric",
  });

  if (date.toDateString() === today.toDateString()) return `Today, ${short}`;
  if (date.toDateString() === tomorrow.toDateString()) return `Tomorrow, ${short}`;
  return full;
}

function formatEventTimeRange(startTime: string, endTime: string): string {
  const fmt = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };
  return `${fmt(startTime)} – ${fmt(endTime)}`;
}

export default function EventDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { event } = useEventDetail(id ?? "");
  const { user } = useAuth();
  const [isSignedUp, setIsSignedUp] = useState(false);

  useEffect(() => {
    if (!event || !user?.uid) return;
    getUserShiftForEvent(event.id, user.uid).then((shift) =>
      setIsSignedUp(shift !== null),
    );
  }, [event?.id, user?.uid]);

  if (!event) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.notFoundText}>Event not found.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusCfg = EVENT_STATUS_CONFIG[event.status];
  const dateLabel = formatEventDate(event.date);
  const timeRange = formatEventTimeRange(event.startTime, event.endTime);

  function handleGetDirections() {
    const query = encodeURIComponent(`${event!.location}, ${event!.address ?? ""}`);
    Linking.openURL(`https://maps.apple.com/?q=${query}`);
  }

  function handleCall() {
    if (event?.organizer?.phone) {
      Linking.openURL(`tel:${event.organizer.phone.replace(/\s/g, "")}`);
    }
  }

  function handleEmail() {
    if (event?.organizer?.email) {
      Linking.openURL(`mailto:${event.organizer.email}`);
    }
  }

  function handleCancel() {
    Alert.alert(
      "Cancel Volunteering",
      `Are you sure you want to cancel your volunteer spot for "${event!.title}"?`,
      [
        { text: "Keep Spot", style: "cancel" },
        {
          text: "Cancel Sign-Up",
          style: "destructive",
          onPress: async () => {
            if (!user?.uid) return;
            try {
              await cancelVolunteerShift(event!.id, user.uid);
              router.replace("/(tabs)/schedule");
            } catch (err: any) {
              Alert.alert("Error", err.message ?? "Something went wrong");
            }
          },
        },
      ],
    );
  }

  function handleSignUp() {
    Alert.alert(
      "Sign Up to Volunteer",
      `Would you like to volunteer for "${event!.title}"?`,
      [
        {
          text: "Cancel",
          style: "destructive",
        },
        {
          text: "Confirm",
          style: "default",
          onPress: async () => {
            if (!user?.uid) return;
            try {
              await signUpForEventShift(event!.id, user.uid);
              router.push("/(tabs)/schedule");
            } catch (err: any) {
              Alert.alert("Sign Up Failed", err.message ?? "Something went wrong");
            }
          },
        },
      ],
    );
  }

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 5 }]}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <ThemedText type="subtitle">Event Details</ThemedText>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="ellipsis-horizontal" size={22} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Event info card */}
        <View style={styles.card}>
          <View style={styles.eventCardHeader}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={[styles.badge, { backgroundColor: statusCfg.bg }]}>
                <Text style={[styles.badgeText, { color: statusCfg.text }]}>
                  {statusCfg.label}
                </Text>
              </View>
            </View>
            <View style={styles.eventIcon}>
              <MaterialCommunityIcons name="calendar-star" size={22} color="#64748B" />
            </View>
          </View>

          {event.description ? (
            <Text style={styles.description}>{event.description}</Text>
          ) : null}

          <View style={styles.infoRow}>
            <View style={styles.squareIcon}>
              <Ionicons name="calendar-outline" size={24} color="#64748B" />
            </View>
            <View>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>{dateLabel}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.squareIcon}>
              <Feather name="clock" size={24} color="#64748B" />
            </View>
            <View>
              <Text style={styles.infoLabel}>Time</Text>
              <Text style={styles.infoValue}>{timeRange}</Text>
            </View>
          </View>
        </View>

        {/* Location */}
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.card}>
          <View style={styles.locationHeader}>
            <Ionicons name="location" size={30} color="#059669" />
            <View style={styles.locationText}>
              <Text style={styles.locationName}>{event.location}</Text>
              {event.address && (
                <Text style={styles.locationAddress}>{event.address}</Text>
              )}
            </View>
          </View>

          <View style={styles.mapPlaceholder}>
            <Ionicons name="image-outline" size={36} color="#CBD5E1" />
          </View>

          <TouchableOpacity style={styles.directionsBtn} onPress={handleGetDirections}>
            <Feather name="navigation" size={16} color="#374151" />
            <Text style={styles.directionsBtnText}>Get Directions</Text>
          </TouchableOpacity>
        </View>

        {/* Organizer */}
        {event.organizer && (
          <>
            <Text style={styles.sectionTitle}>Organizer</Text>
            <View style={styles.card}>
              <View style={styles.organizerRow}>
                <View style={styles.organizerAvatar}>
                  <Text style={styles.organizerInitial}>
                    {event.organizer.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.organizerInfo}>
                  <Text style={styles.organizerName}>{event.organizer.name}</Text>
                  <Text style={styles.organizerTitle}>{event.organizer.title}</Text>
                </View>
              </View>
              <View style={styles.contactRow}>
                <TouchableOpacity style={styles.contactBtn} onPress={handleCall}>
                  <Ionicons name="call" size={16} color="#374151" />
                  <Text style={styles.contactBtnText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.contactBtn} onPress={handleEmail}>
                  <Ionicons name="mail" size={16} color="#374151" />
                  <Text style={styles.contactBtnText}>Email</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {/* Sign Up / Cancel */}
        {isSignedUp ? (
          <View style={styles.signedUpContainer}>
            <View style={styles.signedUpBanner}>
              <Ionicons name="checkmark-circle" size={20} color="#059669" />
              <Text style={styles.signedUpText}>
                You are already volunteering at this event
              </Text>
            </View>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Ionicons name="close-circle-outline" size={20} color="#FFFFFF" />
              <Text style={styles.cancelBtnText}>Cancel Volunteering</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.signUpBtn} onPress={handleSignUp}>
            <Ionicons name="hand-right-outline" size={20} color="#FFFFFF" />
            <Text style={styles.signUpBtnText}>Volunteer</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  notFoundText: {
    fontSize: 16,
    color: "#374151",
  },
  backLink: {
    fontSize: 15,
    color: "#059669",
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    gap: 12,
  },
  eventCardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0F172A",
  },
  eventIcon: {
    backgroundColor: "#F1F5F9",
    padding: 10,
    borderRadius: 12,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 6,
  },
  badgeText: {
    fontWeight: "600",
    fontSize: 13,
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginTop: 5,
  },
  squareIcon: {
    width: 35,
    height: 35,
    backgroundColor: "rgba(5, 150, 105, 0.1)",
    borderRadius: 8,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "500",
    color: "#0F172A",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0F172A",
    marginTop: 8,
  },
  locationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  locationText: {
    flex: 1,
  },
  locationName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },
  locationAddress: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  mapPlaceholder: {
    height: 140,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  directionsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  directionsBtnText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#374151",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  organizerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  organizerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },
  organizerInitial: {
    fontSize: 18,
    fontWeight: "600",
    color: "#166534",
  },
  organizerInfo: {
    flex: 1,
  },
  organizerName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },
  organizerTitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  contactRow: {
    flexDirection: "row",
    gap: 12,
  },
  contactBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  contactBtnText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  signUpBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#059669",
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 4,
    shadowColor: "#059669",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  signUpBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  signedUpContainer: {
    gap: 12,
    marginTop: 4,
  },
  signedUpBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  signedUpText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#065F46",
  },
  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#DC2626",
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: "#DC2626",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cancelBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
