import { StyleSheet, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSegments } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Logo from "@/assets/images/logo.png";

const SUBTITLES: Record<string, string> = {
  index: "Your volunteer hub",
  schedule: "Your upcoming shifts",
  "check-in": "Check in",
  alerts: "Updates",
  profile: "Your account",
};

export function AppHeader() {
  const insets = useSafeAreaInsets();
  const segments = useSegments();

  // Last segment is the screen name, e.g. "index", "schedule", etc.
  const screen = segments[segments.length - 1] ?? "index";
  const subtitle = SUBTITLES[screen] ?? "Your volunteer hub";

  return (
    <ThemedView style={[styles.header, { paddingTop: insets.top + 5 }]}>
      <Image source={Logo} style={styles.logo} />
      <ThemedText type="subtitle">{subtitle}</ThemedText>
      <FontAwesome
        name="user-circle-o"
        size={30}
        style={styles.profileIcon}
        color="#10B981"
      />
    </ThemedView>
  );
}

export function useHeaderHeight() {
  const insets = useSafeAreaInsets();
  // logo height (40) + paddingTop (insets.top + 10) + paddingBottom (10) + border (1)
  return insets.top + 71;
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 100,
  },
  logo: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  profileIcon: {
    marginLeft: "auto",
  },
});
