import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { calculateDayStreak, getGreeting } from "@/utils/date";
import { ShiftCard } from "@/components/shift/shift-card";
import { useUserShifts } from "@/hooks/useUserShifts";

export default function HomeScreen() {
  const { user } = useAuth();
  const { shifts, eventsMap } = useUserShifts(user?.uid);

  const { upcomingShifts, pastShifts } = useMemo(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayMs = startOfToday.getTime();

    const upcoming = shifts.filter(
      (s) => s.timeSlot.start.toMillis() >= todayMs,
    );
    const past = shifts
      .filter((s) => s.timeSlot.start.toMillis() < todayMs)
      .sort((a, b) => b.timeSlot.start.toMillis() - a.timeSlot.start.toMillis());

    return { upcomingShifts: upcoming, pastShifts: past };
  }, [shifts]);

  const greeting = useMemo(() => getGreeting(new Date()), []);

  return (
    <ScrollView style={styles.container}>
      {/* Greeting and streak */}
      <ThemedView style={styles.streakContainer}>
        <View style={styles.textBlock}>
          <Text style={styles.greeting}>{greeting},</Text>
          <Text style={styles.name}>{user?.displayName}!</Text>
        </View>

        <View style={styles.streakPill}>
          <Ionicons name="flame" size={18} color="#EA580C" />
          <Text style={styles.streakText}>
            {calculateDayStreak(user?.lastActive || 0)} Day Streak
          </Text>
        </View>
      </ThemedView>

      <ThemedView style={styles.quickActions}>
        <ThemedView style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <IconSymbol size={32} name="calendar.badge.plus" color="#10B981" />
            <ThemedText style={styles.actionText}>Find Events</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <IconSymbol size={32} name="qrcode" color="#10B981" />
            <ThemedText style={styles.actionText}>Check-In</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <IconSymbol
              size={32}
              name="exclamationmark.triangle"
              color="#F59E0B"
            />
            <ThemedText style={styles.actionText}>Report Issue</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <IconSymbol size={32} name="clock" color="#6B7280" />
            <ThemedText style={styles.actionText}>My Hours</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Upcoming Shifts</ThemedText>
        {upcomingShifts.map((shift) => {
          const event = eventsMap[shift.eventId];
          if (!event) return null;
          return (
            <ShiftCard
              event={event}
              shift={shift}
              key={shift.id}
              userId={user?.uid}
            />
          );
        })}
      </ThemedView>

      {pastShifts.length > 0 && (
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Past Shifts</ThemedText>
          {pastShifts.map((shift) => {
            const event = eventsMap[shift.eventId];
            if (!event) return null;
            return (
              <ShiftCard
                event={event}
                shift={shift}
                key={shift.id}
                userId={user?.uid}
                isPast
              />
            );
          })}
        </ThemedView>
      )}

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Recent Activity</ThemedText>
        <ThemedView style={styles.activityList}>
          <ThemedView style={styles.activityItem}>
            <IconSymbol
              size={16}
              name="checkmark.circle.fill"
              color="#10B981"
            />
            <ThemedText style={styles.activityText}>
              Completed shift at Animal Shelter
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.activityItem}>
            <IconSymbol size={16} name="calendar.badge.plus" color="#3B82F6" />
            <ThemedText style={styles.activityText}>
              Signed up for Beach Cleanup
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.activityItem}>
            <IconSymbol size={16} name="heart.fill" color="#EF4444" />
            <ThemedText style={styles.activityText}>
              Liked Community Garden event
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  textBlock: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: "#64748B",
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0F172A",
  },
  streakPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F5E9DA",
    padding: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#FCD9BD",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  streakText: {
    fontWeight: "700",
    color: "#EA580C",
  },
  quickActions: {
    gap: 15,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  actionCard: {
    width: "47%",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  section: {
    gap: 20,
    padding: 20,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
  },
  activityText: {
    fontSize: 14,
    color: "#374151",
  },
});
