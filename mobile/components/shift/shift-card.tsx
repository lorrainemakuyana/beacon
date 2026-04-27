import React, { memo, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Timestamp } from "firebase/firestore";
import { Ionicons, Feather } from "@expo/vector-icons";

import { Shift, Event } from "@/interfaces";

type Props = {
  shift: Shift;
  event: Event;
  userId?: string;
  isPast?: boolean;
};

const STATUS_CONFIG: Record<
  Shift["status"],
  { label: string; bg: string; text: string }
> = {
  open: { label: "Open", bg: "#E8F0FE", text: "#1D4ED8" },
  full: { label: "Full", bg: "#F3F4F6", text: "#374151" },
  active: { label: "Active", bg: "#DCFCE7", text: "#166534" },
  completed: { label: "Completed", bg: "#E5E7EB", text: "#6B7280" },
  closed: { label: "Closed", bg: "#FEF2F2", text: "#991B1B" },
  attended: { label: "Attended", bg: "#F0FDF4", text: "#166534" },
};

function formatTimeRange(start: Timestamp, end: Timestamp) {
  const s = start.toDate();
  const e = end.toDate();

  const opts: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
  };

  return `${s.toLocaleTimeString([], opts)} - ${e.toLocaleTimeString(
    [],
    opts,
  )}`;
}

function getRelativeDateLabel(date: Date) {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export const ShiftCard = memo(function ShiftCard({
  shift,
  event,
  userId,
  isPast,
}: Props) {
  const effectiveStatus = useMemo((): Shift["status"] => {
    if (!isPast) return shift.status;
    // Past shift: show attended if user was assigned, otherwise closed
    if (userId && shift.assignedVolunteers?.includes(userId)) return "attended";
    return "closed";
  }, [isPast, shift.status, shift.assignedVolunteers, userId]);

  const statusCfg = STATUS_CONFIG[effectiveStatus];

  const timeRange = useMemo(
    () => formatTimeRange(shift.timeSlot.start, shift.timeSlot.end),
    [shift.timeSlot],
  );

  const computedDateLabel = useMemo(() => {
    return getRelativeDateLabel(shift.timeSlot.start.toDate());
  }, [shift.timeSlot.start]);

  const isToday = useMemo(() => {
    const shiftDate = shift.timeSlot.start.toDate();
    const today = new Date();
    return shiftDate.toDateString() === today.toDateString();
  }, [shift.timeSlot.start]);

  const roleText = shift.role?.title || "Volunteer";

  return (
    <Pressable style={styles.card} onPress={() => {}}>
      {/* Top row */}
      <View style={styles.headerRow}>
        <View style={[styles.badge, { backgroundColor: statusCfg.bg }]}>
          <Text style={[styles.badgeText, { color: statusCfg.text }]}>
            {statusCfg.label}
          </Text>
        </View>

        <Text style={styles.dot}>•</Text>
        <Text style={styles.dateText}>{computedDateLabel}</Text>

        <View style={styles.leafIcon}>
          <Ionicons name="leaf-outline" size={20} color="#64748B" />
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>{shift.title}</Text>

      {/* Time */}
      <View style={styles.row}>
        <Feather name="clock" size={18} color="#64748B" />
        <Text style={styles.secondaryText}>{timeRange}</Text>
      </View>

      {/* Location */}
      <View style={styles.row}>
        <Ionicons name="location-outline" size={18} color="#64748B" />
        <Text style={styles.secondaryText}>{event.location}</Text>
      </View>

      {/* Role */}
      <View style={styles.row}>
        <Ionicons name="person-outline" size={18} color="#64748B" />
        <Text style={styles.secondaryText}>
          Role: <Text style={styles.roleStrong}>{roleText}</Text>
        </Text>
      </View>

      {/* Check-In button only for today's shifts */}
      {isToday && (
        <TouchableOpacity style={styles.checkInButton}>
          <Ionicons name="qr-code-outline" size={18} color="#FFFFFF" />
          <Text style={styles.checkInButtonText}>Check-In Now</Text>
        </TouchableOpacity>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 16,
  },
  time: {
    fontSize: 14,
    color: "#10B981",
    fontWeight: "500",
  },
  location: {
    fontSize: 14,
    color: "#6B7280",
  },
  checkInButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#059669",
    padding: 14,
    borderRadius: 10,
    marginTop: 8,
  },
  checkInButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    fontWeight: "600",
    fontSize: 14,
  },
  dot: {
    marginHorizontal: 8,
    color: "#64748B",
    fontSize: 18,
  },
  dateText: {
    color: "#64748B",
    fontSize: 16,
    flex: 1,
  },
  leafIcon: {
    backgroundColor: "#F1F5F9",
    padding: 10,
    borderRadius: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  squareIcon: {
    width: 18,
    height: 18,
    backgroundColor: "#64748B",
    borderRadius: 3,
  },
  secondaryText: {
    fontSize: 18,
    color: "#64748B",
  },
  roleStrong: {
    color: "#0F172A",
    fontWeight: "400",
  },
});
