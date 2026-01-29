import { useEffect } from "react";
import { router } from "expo-router";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";

export default function IndexScreen() {
  useEffect(() => {
    // TODO: Check if user is authenticated
    // For now, always redirect to welcome screen
    const timer = setTimeout(() => {
      router.replace("/auth");
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ThemedText>Loading...</ThemedText>
    </ThemedView>
  );
}
