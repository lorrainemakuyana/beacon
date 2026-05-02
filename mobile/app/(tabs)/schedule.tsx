import { useMemo } from "react";
import { StyleSheet, ScrollView, View, Text } from "react-native";
import { ShiftCard } from "@/components/shift/shift-card";
import { useUserShifts } from "@/hooks/useUserShifts";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/theme";

function bucket(shifts: ReturnType<typeof useUserShifts>["shifts"]) {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);
  const weekEnd = new Date(todayEnd);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const today: typeof shifts = [];
  const thisWeek: typeof shifts = [];
  const later: typeof shifts = [];

  for (const s of shifts) {
    const d = s.timeSlot.start.toDate();
    if (d < todayStart) continue;
    if (d <= todayEnd) today.push(s);
    else if (d <= weekEnd) thisWeek.push(s);
    else later.push(s);
  }
  return { today, thisWeek, later };
}

function EmptySlot({ label, styles }: { label: string; styles: ReturnType<typeof getStyles> }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>No shifts {label}</Text>
    </View>
  );
}

export default function ScheduleScreen() {
  const { user } = useAuth();
  const { shifts, eventsMap } = useUserShifts(user?.uid);
  const { colors } = useTheme();

  const { today, thisWeek, later } = useMemo(() => bucket(shifts), [shifts]);
  const styles = getStyles(colors);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Today</Text>
        {today.length === 0 ? (
          <EmptySlot label="scheduled for today" styles={styles} />
        ) : (
          today.map((shift) => {
            const event = eventsMap[shift.eventId];
            if (!event) return null;
            return (
              <ShiftCard key={shift.id} shift={shift} event={event} userId={user?.uid} />
            );
          })
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>This Week</Text>
        {thisWeek.length === 0 ? (
          <EmptySlot label="this week" styles={styles} />
        ) : (
          thisWeek.map((shift) => {
            const event = eventsMap[shift.eventId];
            if (!event) return null;
            return (
              <ShiftCard key={shift.id} shift={shift} event={event} userId={user?.uid} />
            );
          })
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Later</Text>
        {later.length === 0 ? (
          <EmptySlot label="further ahead" styles={styles} />
        ) : (
          later.map((shift) => {
            const event = eventsMap[shift.eventId];
            if (!event) return null;
            return (
              <ShiftCard key={shift.id} shift={shift} event={event} userId={user?.uid} />
            );
          })
        )}
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
    content: {
      padding: 20,
      paddingBottom: 40,
      gap: 24,
    },
    section: {
      gap: 12,
    },
    sectionLabel: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.textTertiary,
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    empty: {
      paddingVertical: 18,
      paddingHorizontal: 16,
      backgroundColor: colors.emptyStateBg,
      borderRadius: 12,
      alignItems: "center",
    },
    emptyText: {
      fontSize: 14,
      color: colors.textTertiary,
    },
  });
}
