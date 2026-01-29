import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedView style={styles.profileImageContainer}>
          <IconSymbol size={60} name="person.fill" color="#FFFFFF" />
        </ThemedView>
        <ThemedText type="title">John Volunteer</ThemedText>
        <ThemedText type="subtitle">Volunteer since 2024</ThemedText>
      </ThemedView>

      <ThemedView style={styles.content}>
        <ThemedView style={styles.statsSection}>
          <ThemedView style={styles.statCard}>
            <ThemedText style={styles.statNumber}>12</ThemedText>
            <ThemedText style={styles.statLabel}>Events</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statCard}>
            <ThemedText style={styles.statNumber}>48</ThemedText>
            <ThemedText style={styles.statLabel}>Hours</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statCard}>
            <ThemedText style={styles.statNumber}>5</ThemedText>
            <ThemedText style={styles.statLabel}>Organizations</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Account</ThemedText>
          <ThemedView style={styles.menuList}>
            <TouchableOpacity style={styles.menuItem}>
              <IconSymbol size={20} name="person.circle" color="#6B7280" />
              <ThemedText style={styles.menuText}>Edit Profile</ThemedText>
              <IconSymbol size={16} name="chevron.right" color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <IconSymbol size={20} name="bell" color="#6B7280" />
              <ThemedText style={styles.menuText}>Notifications</ThemedText>
              <IconSymbol size={16} name="chevron.right" color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <IconSymbol size={20} name="shield" color="#6B7280" />
              <ThemedText style={styles.menuText}>
                Privacy & Security
              </ThemedText>
              <IconSymbol size={16} name="chevron.right" color="#9CA3AF" />
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Support</ThemedText>
          <ThemedView style={styles.menuList}>
            <TouchableOpacity style={styles.menuItem}>
              <IconSymbol
                size={20}
                name="questionmark.circle"
                color="#6B7280"
              />
              <ThemedText style={styles.menuText}>Help Center</ThemedText>
              <IconSymbol size={16} name="chevron.right" color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <IconSymbol size={20} name="envelope" color="#6B7280" />
              <ThemedText style={styles.menuText}>Contact Us</ThemedText>
              <IconSymbol size={16} name="chevron.right" color="#9CA3AF" />
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <TouchableOpacity style={styles.logoutButton}>
            <IconSymbol size={20} name="arrow.right.square" color="#EF4444" />
            <ThemedText style={styles.logoutText}>Sign Out</ThemedText>
          </TouchableOpacity>
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
    alignItems: "center",
    gap: 10,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
    gap: 25,
  },
  statsSection: {
    flexDirection: "row",
    gap: 15,
  },
  statCard: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    alignItems: "center",
    gap: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#10B981",
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  section: {
    gap: 15,
  },
  menuList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  menuText: {
    flex: 1,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    gap: 10,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 12,
  },
  logoutText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "600",
  },
});
