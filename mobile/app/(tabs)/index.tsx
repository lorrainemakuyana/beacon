import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Welcome to Beacon</ThemedText>
        <ThemedText type="subtitle">Your volunteer hub</ThemedText>
      </ThemedView>

      <ThemedView style={styles.content}>
        <ThemedView style={styles.quickActions}>
          <ThemedText type="subtitle">Quick Actions</ThemedText>
          <ThemedView style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <IconSymbol
                size={32}
                name="calendar.badge.plus"
                color="#10B981"
              />
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
          <ThemedView style={styles.shiftCard}>
            <ThemedView style={styles.shiftHeader}>
              <ThemedText style={styles.shiftTitle}>
                Community Food Bank
              </ThemedText>
              <ThemedText style={styles.shiftTime}>
                Tomorrow, 9:00 AM
              </ThemedText>
            </ThemedView>
            <ThemedText style={styles.shiftLocation}>
              📍 Downtown Community Center
            </ThemedText>
            <TouchableOpacity style={styles.shiftButton}>
              <ThemedText style={styles.shiftButtonText}>
                View Details
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

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
              <IconSymbol
                size={16}
                name="calendar.badge.plus"
                color="#3B82F6"
              />
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
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  content: {
    padding: 20,
    gap: 25,
  },
  quickActions: {
    gap: 15,
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
    shadowOffset: {
      width: 0,
      height: 1,
    },
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
    gap: 15,
  },
  shiftCard: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  shiftHeader: {
    gap: 5,
  },
  shiftTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  shiftTime: {
    fontSize: 14,
    color: "#10B981",
    fontWeight: "500",
  },
  shiftLocation: {
    fontSize: 14,
    color: "#6B7280",
  },
  shiftButton: {
    backgroundColor: "#F0FDF4",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },
  shiftButtonText: {
    color: "#10B981",
    fontWeight: "600",
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
