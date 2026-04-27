import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function CheckInScreen() {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Check-In</ThemedText>
        <ThemedText type="subtitle">
          Scan QR code or check in manually
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.content}>
        <ThemedView style={styles.qrSection}>
          <ThemedView style={styles.qrPlaceholder}>
            <IconSymbol size={80} name="qrcode" color="#10B981" />
            <ThemedText type="subtitle">QR Code Scanner</ThemedText>
            <ThemedText>Position QR code within the frame</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.divider}>
          <ThemedView style={styles.dividerLine} />
          <ThemedText style={styles.dividerText}>OR</ThemedText>
          <ThemedView style={styles.dividerLine} />
        </ThemedView>

        <ThemedView style={styles.manualSection}>
          <TouchableOpacity style={styles.checkInButton}>
            <IconSymbol size={24} name="location.fill" color="#FFFFFF" />
            <ThemedText style={styles.checkInButtonText}>
              Manual Check-In
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.checkOutButton}>
            <IconSymbol size={24} name="location" color="#EF4444" />
            <ThemedText style={styles.checkOutButtonText}>Check-Out</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.statusSection}>
          <ThemedText type="subtitle">Current Status</ThemedText>
          <ThemedView style={styles.statusCard}>
            <ThemedText>Not currently checked in to any shift</ThemedText>
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
    paddingTop: 20,
    alignItems: "center",
  },
  content: {
    padding: 20,
    gap: 30,
  },
  qrSection: {
    alignItems: "center",
  },
  qrPlaceholder: {
    width: 250,
    height: 250,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#10B981",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    color: "#6B7280",
    fontSize: 14,
  },
  manualSection: {
    gap: 15,
  },
  checkInButton: {
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },
  checkInButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  checkOutButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#EF4444",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },
  checkOutButtonText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "600",
  },
  statusSection: {
    gap: 10,
  },
  statusCard: {
    padding: 20,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    alignItems: "center",
  },
});
