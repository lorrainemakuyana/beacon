import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function AlertsScreen() {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Alerts</ThemedText>
        <ThemedText type="subtitle">Notifications and updates</ThemedText>
      </ThemedView>

      <ThemedView style={styles.content}>
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Recent Notifications</ThemedText>
          <ThemedView style={styles.alertsList}>
            <ThemedView style={styles.alertItem}>
              <IconSymbol size={20} name="bell.fill" color="#10B981" />
              <ThemedView style={styles.alertContent}>
                <ThemedText style={styles.alertTitle}>
                  Shift Reminder
                </ThemedText>
                <ThemedText style={styles.alertText}>
                  Your shift starts in 1 hour
                </ThemedText>
                <ThemedText style={styles.alertTime}>2 hours ago</ThemedText>
              </ThemedView>
            </ThemedView>

            <ThemedView style={styles.alertItem}>
              <IconSymbol
                size={20}
                name="exclamationmark.triangle.fill"
                color="#F59E0B"
              />
              <ThemedView style={styles.alertContent}>
                <ThemedText style={styles.alertTitle}>Event Update</ThemedText>
                <ThemedText style={styles.alertText}>
                  Location changed for Community Cleanup
                </ThemedText>
                <ThemedText style={styles.alertTime}>1 day ago</ThemedText>
              </ThemedView>
            </ThemedView>

            <ThemedView style={styles.alertItem}>
              <IconSymbol
                size={20}
                name="checkmark.circle.fill"
                color="#10B981"
              />
              <ThemedView style={styles.alertContent}>
                <ThemedText style={styles.alertTitle}>
                  Shift Confirmed
                </ThemedText>
                <ThemedText style={styles.alertText}>
                  You're confirmed for Food Bank volunteer shift
                </ThemedText>
                <ThemedText style={styles.alertTime}>3 days ago</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Quick Actions</ThemedText>
          <TouchableOpacity style={styles.actionButton}>
            <IconSymbol
              size={24}
              name="exclamationmark.triangle"
              color="#EF4444"
            />
            <ThemedText style={styles.actionButtonText}>
              Report Incident
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Notification Settings</ThemedText>
          <ThemedView style={styles.settingsCard}>
            <ThemedText>Manage your notification preferences</ThemedText>
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
  section: {
    gap: 15,
  },
  alertsList: {
    gap: 12,
  },
  alertItem: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  alertContent: {
    flex: 1,
    gap: 4,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  alertText: {
    fontSize: 14,
    color: "#6B7280",
  },
  alertTime: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  actionButton: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },
  actionButtonText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "600",
  },
  settingsCard: {
    padding: 20,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    alignItems: "center",
  },
});
