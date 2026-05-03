import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { calculateDayStreak, getGreeting } from "@/utils/date";
import { ShiftCard } from "@/components/shift/shift-card";
import { useUserShifts } from "@/hooks/useUserShifts";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/theme";

export default function HomeScreen() {
  const { user } = useAuth();
  const { shifts, eventsMap } = useUserShifts(user?.uid);
  const { colors } = useTheme();

  const pastShifts = useMemo(() => {
    const todayMs = new Date().setHours(0, 0, 0, 0);
    return shifts
      .filter((s) => s.timeSlot.start.toMillis() < todayMs)
      .sort((a, b) => b.timeSlot.start.toMillis() - a.timeSlot.start.toMillis());
  }, [shifts]);

  const greeting = useMemo(() => getGreeting(new Date()), []);
  const styles = getStyles(colors);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.streakContainer}>
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
      </View>

      <View style={styles.quickActions}>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <IconSymbol size={32} name="calendar.badge.plus" color={colors.tint} />
            <ThemedText style={styles.actionText}>Find Events</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <IconSymbol size={32} name="qrcode" color={colors.tint} />
            <ThemedText style={styles.actionText}>Check-In</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <IconSymbol
              size={32}
              name="exclamationmark.triangle"
              color={colors.warning}
            />
            <ThemedText style={styles.actionText}>Report Issue</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <IconSymbol size={32} name="clock" color={colors.icon} />
            <ThemedText style={styles.actionText}>My Hours</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {pastShifts.length > 0 && (
        <View style={styles.section}>
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
        </View>
      )}

      <View style={styles.section}>
        <ThemedText type="subtitle">Recent Activity</ThemedText>
        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <IconSymbol
              size={16}
              name="checkmark.circle.fill"
              color={colors.tint}
            />
            <ThemedText style={styles.activityText}>
              Completed shift at Animal Shelter
            </ThemedText>
          </View>
          <View style={styles.activityItem}>
            <IconSymbol size={16} name="calendar.badge.plus" color={colors.info} />
            <ThemedText style={styles.activityText}>
              Signed up for Beach Cleanup
            </ThemedText>
          </View>
          <View style={styles.activityItem}>
            <IconSymbol size={16} name="heart.fill" color={colors.danger} />
            <ThemedText style={styles.activityText}>
              Liked Community Garden event
            </ThemedText>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surfaceBackground,
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
      color: colors.textSecondary,
      marginBottom: 4,
    },
    name: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    streakPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: colors.streakPillBg,
      padding: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.streakPillBorder,
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
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      alignItems: "center",
      gap: 10,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
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
      backgroundColor: colors.surfaceBackground,
      borderRadius: 8,
    },
    activityText: {
      fontSize: 14,
      color: colors.textLabel,
    },
  });
}
