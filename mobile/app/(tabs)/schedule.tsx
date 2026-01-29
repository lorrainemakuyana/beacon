import { StyleSheet, ScrollView } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function ScheduleScreen() {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">My Schedule</ThemedText>
        <ThemedText type="subtitle">Upcoming volunteer shifts</ThemedText>
      </ThemedView>

      <ThemedView style={styles.content}>
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Today</ThemedText>
          <ThemedView style={styles.placeholder}>
            <ThemedText>No shifts scheduled for today</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">This Week</ThemedText>
          <ThemedView style={styles.placeholder}>
            <ThemedText>No upcoming shifts this week</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Browse Events</ThemedText>
          <ThemedView style={styles.placeholder}>
            <ThemedText>Find volunteer opportunities near you</ThemedText>
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
    gap: 20,
  },
  section: {
    gap: 10,
  },
  placeholder: {
    padding: 20,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    alignItems: "center",
  },
});
