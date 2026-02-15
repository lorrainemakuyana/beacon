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
import { Image } from "react-native";
import Logo from "@/assets/images/logo.png";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { calculateDayStreak, getGreeting } from "@/utils/date";

export default function HomeScreen() {
  const { userProfile } = useAuth();

  const greeting = useMemo(() => getGreeting(new Date()), []);

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <Image source={Logo} style={styles.logo} />
        <ThemedText type="subtitle">Your volunteer hub</ThemedText>
        {/* profile icon aligned to the right */}
        <FontAwesome
          name="user-circle-o"
          size={30}
          style={{
            marginLeft: "auto",
          }}
          color="#10B981"
        />
      </ThemedView>

      {/* Greeting and streak */}
      <ThemedView style={styles.streakContainer}>
        {/* Left side */}
        <View style={styles.textBlock}>
          <Text style={styles.greeting}>{greeting},</Text>
          <Text style={styles.name}>{userProfile?.displayName}!</Text>
        </View>

        {/* Right streak pill */}
        <View style={styles.streakPill}>
          <Ionicons name="flame" size={18} color="#EA580C" />
          <Text style={styles.streakText}>
            {calculateDayStreak(userProfile?.lastActive)} Day Streak
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
        <ThemedView style={styles.shiftCard}>
          <ThemedView style={styles.shiftHeader}>
            <ThemedText style={styles.shiftTitle}>
              Community Food Bank
            </ThemedText>
            <ThemedText style={styles.shiftTime}>Tomorrow, 9:00 AM</ThemedText>
          </ThemedView>
          <ThemedText style={styles.shiftLocation}>
            📍 Downtown Community Center
          </ThemedText>
          <TouchableOpacity style={styles.shiftButton}>
            <ThemedText style={styles.shiftButtonText}>View Details</ThemedText>
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
  logo: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 1,
    shadowRadius: 3.84,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
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
    shadowOffset: {
      width: 0,
      height: 1,
    },
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
