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
import { useMemo } from "react";
import { Timestamp } from "firebase/firestore";

import { dummyShifts } from "@/constants/dummy_shifts";
import { dummyEvents } from "@/constants/dummy_events";
import { dummyUsers } from "@/constants/dummy_users";
import { Shift } from "@/interfaces";
import { ThemedText } from "@/components/themed-text";

const STATUS_CONFIG: Record<
  Shift["status"],
  { label: string; bg: string; text: string }
> = {
  open: { label: "Open", bg: "#E8F0FE", text: "#1D4ED8" },
  full: { label: "Full", bg: "#F3F4F6", text: "#374151" },
  active: { label: "Confirmed", bg: "#DCFCE7", text: "#166534" },
  completed: { label: "Completed", bg: "#E5E7EB", text: "#6B7280" },
  closed: { label: "Closed", bg: "#FEF2F2", text: "#991B1B" },
  attended: { label: "Attended", bg: "#F0FDF4", text: "#166534" },
};

const AVATAR_PALETTES = [
  { bg: "#DCFCE7", fg: "#166534" },
  { bg: "#FEF3C7", fg: "#92400E" },
  { bg: "#FCE7F3", fg: "#9D174D" },
  { bg: "#E0F2FE", fg: "#0C4A6E" },
  { bg: "#F3E8FF", fg: "#6B21A8" },
];

function randomPalette() {
  return AVATAR_PALETTES[Math.floor(Math.random() * AVATAR_PALETTES.length)];
}

function formatDetailDate(date: Date): string {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const formatted = date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (date.toDateString() === today.toDateString())
    return `Today, ${date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}`;
  if (date.toDateString() === tomorrow.toDateString())
    return `Tomorrow, ${date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}`;
  return formatted;
}

function formatTimeRange(start: Timestamp, end: Timestamp): string {
  const opts: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
  };
  return `${start.toDate().toLocaleTimeString([], opts)} - ${end.toDate().toLocaleTimeString([], opts)}`;
}

function getDuration(start: Timestamp, end: Timestamp): string {
  const hours = (end.toMillis() - start.toMillis()) / (1000 * 60 * 60);
  return hours === 1 ? "1 hour" : `${hours} hours`;
}

export default function ShiftDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const shift = useMemo(() => dummyShifts.find((s) => s.id === id), [id]);
  const event = useMemo(
    () => (shift ? dummyEvents.find((e) => e.id === shift.eventId) : null),
    [shift],
  );

  if (!shift || !event) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.notFoundText}>Shift not found.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusCfg = STATUS_CONFIG[shift.status];
  const timeRange = formatTimeRange(shift.timeSlot.start, shift.timeSlot.end);
  const duration = getDuration(shift.timeSlot.start, shift.timeSlot.end);
  const dateLabel = formatDetailDate(shift.timeSlot.start.toDate());
  const roleTitle = shift.role?.title ?? "Volunteer";
  const tasks = shift.tasks ?? [];
  const isToday =
    shift.timeSlot.start.toDate().toDateString() === new Date().toDateString();
  const teamMembers = shift.assignedVolunteers.map((uid) => {
    const user = dummyUsers.find((u) => u.uid === uid);
    const name = user?.displayName ?? uid;
    const palette = randomPalette();
    return { uid, name, initial: name.charAt(0).toUpperCase(), ...palette };
  });
  const teamCount = teamMembers.length;

  function handleGetDirections() {
    const query = encodeURIComponent(
      `${event!.location}, ${event!.address ?? ""}`,
    );
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

  function handleCancelShift() {
    Alert.alert(
      "Cancel Shift",
      "Are you sure you want to cancel this shift? This action cannot be undone.",
      [
        { text: "Keep Shift", style: "cancel" },
        {
          text: "Cancel Shift",
          style: "destructive",
          onPress: () => router.back(),
        },
      ],
    );
  }

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 5 }]}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <ThemedText type="subtitle">Shift Details</ThemedText>
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
            <View>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={[styles.badge, { backgroundColor: statusCfg.bg }]}>
                <Text style={[styles.badgeText, { color: statusCfg.text }]}>
                  {statusCfg.label}
                </Text>
              </View>
            </View>
            <View style={styles.eventIcon}>
              <MaterialCommunityIcons
                name="package-variant-closed"
                size={22}
                color="#64748B"
              />
            </View>
          </View>

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

          {/* Map placeholder */}
          <View style={styles.mapPlaceholder}>
            <Ionicons name="image-outline" size={36} color="#CBD5E1" />
          </View>

          <TouchableOpacity
            style={styles.directionsBtn}
            onPress={handleGetDirections}
          >
            <Feather name="navigation" size={16} color="#374151" />
            <Text style={styles.directionsBtnText}>Get Directions</Text>
          </TouchableOpacity>
        </View>

        {/* Shift Information */}
        <Text style={styles.sectionTitle}>Shift Information</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={24} color="#64748B" />
            <View>
              <Text style={styles.infoLabel}>Your Role</Text>
              <Text style={styles.infoValue}>{roleTitle}</Text>
            </View>
          </View>

          {tasks.length > 0 && (
            <View style={styles.tasksRow}>
              <Ionicons
                name="clipboard-outline"
                size={24}
                color="#64748B"
                style={styles.tasksIcon}
              />
              <View style={styles.tasksContent}>
                <Text style={styles.infoLabel}>Tasks</Text>
                {tasks.map((task, i) => (
                  <View key={i} style={styles.taskItem}>
                    <Text style={styles.taskBullet}>•</Text>
                    <Text style={styles.taskText}>{task}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.infoRow}>
            <Ionicons name="hourglass-outline" size={24} color="#64748B" />
            <View>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>{duration}</Text>
            </View>
          </View>

          {event.organizer && (
            <>
              <View style={styles.divider} />
              <Text style={styles.organizerLabel}>Organizer</Text>
              <View style={styles.organizerRow}>
                <View style={styles.organizerAvatar}>
                  <Text style={styles.organizerInitial}>
                    {event.organizer.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.organizerInfo}>
                  <Text style={styles.organizerName}>
                    {event.organizer.name}
                  </Text>
                  <Text style={styles.organizerTitle}>
                    {event.organizer.title}
                  </Text>
                </View>
              </View>
              <View style={styles.contactRow}>
                <TouchableOpacity
                  style={styles.contactBtn}
                  onPress={handleCall}
                >
                  <Ionicons name="call" size={16} color="#374151" />
                  <Text style={styles.contactBtnText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.contactBtn}
                  onPress={handleEmail}
                >
                  <Ionicons name="mail" size={16} color="#374151" />
                  <Text style={styles.contactBtnText}>Email</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* Your Team */}
        <View style={styles.teamHeader}>
          <Text style={styles.sectionTitle}>Your Team</Text>
          <Text style={styles.teamCount}>{teamCount} volunteers</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.teamRow}>
            {teamMembers.map((member) => (
              <View key={member.uid} style={styles.teamMember}>
                <View
                  style={[styles.teamAvatar, { backgroundColor: member.bg }]}
                >
                  <Text style={[styles.teamInitial, { color: member.fg }]}>
                    {member.initial}
                  </Text>
                </View>
                <Text style={styles.teamName}>{member.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Actions */}
        {isToday && (
          <TouchableOpacity
            style={styles.checkInBtn}
            onPress={() => router.push("/(tabs)/check-in")}
          >
            <Ionicons name="qr-code-outline" size={20} color="#FFFFFF" />
            <Text style={styles.checkInBtnText}>Check-In Now</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelShift}>
          <Text style={styles.cancelBtnText}>Cancel Shift</Text>
        </TouchableOpacity>
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
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
    color: "#0F172A",
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
    flex: 1,
    marginRight: 12,
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
    display: "flex",
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
  tasksRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  tasksIcon: {
    marginTop: 2,
  },
  tasksContent: {
    flex: 1,
    gap: 4,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  taskBullet: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  taskText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  organizerLabel: {
    fontSize: 14,
    color: "#9CA3AF",
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
  teamHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  teamCount: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  teamRow: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
  },
  teamMember: {
    alignItems: "center",
    gap: 6,
  },
  teamAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#F8FAFC",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  teamInitial: {
    fontSize: 18,
    fontWeight: "600",
  },
  teamName: {
    fontSize: 11,
    color: "#374151",
    textAlign: "center",
    maxWidth: 60,
  },
  checkInBtn: {
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
  checkInBtnText: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelBtn: {
    alignItems: "center",
    paddingVertical: 14,
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#EF4444",
  },
});
