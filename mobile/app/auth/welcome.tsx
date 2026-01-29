import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function WelcomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedView style={styles.logoContainer}>
            <IconSymbol size={80} name="heart.fill" color="#10B981" />
          </ThemedView>
          <ThemedText type="title" style={styles.title}>
            Welcome to Beacon
          </ThemedText>
          <ThemedText type="subtitle" style={styles.subtitle}>
            Your volunteer operations platform
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.features}>
          <ThemedView style={styles.feature}>
            <IconSymbol size={40} name="calendar.badge.plus" color="#10B981" />
            <ThemedView style={styles.featureText}>
              <ThemedText style={styles.featureTitle}>Find Events</ThemedText>
              <ThemedText style={styles.featureDescription}>
                Discover volunteer opportunities that match your interests and
                schedule
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.feature}>
            <IconSymbol size={40} name="qrcode" color="#10B981" />
            <ThemedView style={styles.featureText}>
              <ThemedText style={styles.featureTitle}>Easy Check-In</ThemedText>
              <ThemedText style={styles.featureDescription}>
                Quick QR code scanning or manual check-in for your volunteer
                shifts
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.feature}>
            <IconSymbol size={40} name="clock" color="#10B981" />
            <ThemedView style={styles.featureText}>
              <ThemedText style={styles.featureTitle}>Track Hours</ThemedText>
              <ThemedText style={styles.featureDescription}>
                Keep track of your volunteer hours and see your impact over time
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.feature}>
            <IconSymbol size={40} name="bell.fill" color="#10B981" />
            <ThemedView style={styles.featureText}>
              <ThemedText style={styles.featureTitle}>
                Stay Connected
              </ThemedText>
              <ThemedText style={styles.featureDescription}>
                Get notifications about upcoming shifts and important updates
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.actions}>
          <Link href="/auth/register" asChild>
            <TouchableOpacity style={styles.primaryButton}>
              <ThemedText style={styles.primaryButtonText}>
                Get Started
              </ThemedText>
            </TouchableOpacity>
          </Link>

          <Link href="/auth/login" asChild>
            <TouchableOpacity style={styles.secondaryButton}>
              <ThemedText style={styles.secondaryButtonText}>
                I Already Have an Account
              </ThemedText>
            </TouchableOpacity>
          </Link>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: 30,
    paddingTop: 80,
    gap: 40,
  },
  header: {
    alignItems: "center",
    gap: 20,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    color: "#6B7280",
  },
  features: {
    gap: 25,
  },
  feature: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 15,
  },
  featureText: {
    flex: 1,
    gap: 5,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  featureDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  actions: {
    gap: 15,
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: "#10B981",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  secondaryButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "500",
  },
});
