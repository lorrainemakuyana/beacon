import { useState, useMemo } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ShiftCard } from "@/components/shift/shift-card";
import { useUpcomingEvents } from "@/hooks/useUpcomingEvents";
import { useAuth } from "@/context/AuthContext";
import { useUserShifts } from "@/hooks/useUserShifts";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/theme";

export default function EventsScreen() {
  const { user } = useAuth();
  const { events } = useUpcomingEvents();
  const { shifts } = useUserShifts(user?.uid);
  const [searchVisible, setSearchVisible] = useState(false);
  const [query, setQuery] = useState("");
  const { colors } = useTheme();

  const filtered = useMemo(() => {
    if (!query.trim()) return events;
    const lower = query.toLowerCase();
    return events.filter((e) => e.title.toLowerCase().includes(lower));
  }, [events, query]);

  const styles = getStyles(colors);

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Upcoming Events</Text>
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => {
            setSearchVisible((v) => !v);
            if (searchVisible) setQuery("");
          }}
        >
          <Ionicons
            name={searchVisible ? "close" : "search"}
            size={22}
            color={colors.tint}
          />
        </TouchableOpacity>
      </View>

      {searchVisible && (
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color={colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events..."
            placeholderTextColor={colors.textTertiary}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
        </View>
      )}

      <View style={styles.list}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No events found</Text>
          </View>
        ) : (
          filtered.map((event) => {
            const shift = shifts.find((s) => s.eventId === event.id);
            return (
              <ShiftCard
                key={event.id}
                event={event}
                shift={shift}
                userId={user?.uid}
              />
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surfaceBackground,
    },
    pageHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 12,
    },
    pageTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    searchBtn: {
      width: 38,
      height: 38,
      borderRadius: 10,
      backgroundColor: colors.primarySubtle,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.primarySubtleBorder,
    },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginHorizontal: 20,
      marginBottom: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: colors.inputBackground,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.inputBorder,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      color: colors.textPrimary,
    },
    list: {
      paddingHorizontal: 20,
      paddingBottom: 30,
      gap: 12,
    },
    empty: {
      paddingVertical: 40,
      alignItems: "center",
    },
    emptyText: {
      fontSize: 15,
      color: colors.textTertiary,
    },
  });
}
