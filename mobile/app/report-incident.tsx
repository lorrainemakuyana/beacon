import { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/theme";
import { useUserShifts } from "@/hooks/useUserShifts";
import { useAuth } from "@/context/AuthContext";

type IncidentType = "Safety Hazard" | "Equipment Issue" | "Behavioral Concern" | "Medical Emergency" | "Other";
type Severity = "Low" | "Medium" | "High" | "Critical";

const INCIDENT_TYPES: IncidentType[] = [
  "Safety Hazard",
  "Equipment Issue",
  "Behavioral Concern",
  "Medical Emergency",
  "Other",
];

const SEVERITY_COLORS: Record<Severity, string> = {
  Low: "#22C55E",
  Medium: "#F59E0B",
  High: "#F97316",
  Critical: "#EF4444",
};

export default function ReportIncidentScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { user } = useAuth();
  const { shiftId, eventId } = useLocalSearchParams<{ shiftId?: string; eventId?: string }>();
  const { shifts, eventsMap } = useUserShifts(user?.uid);

  const [incidentType, setIncidentType] = useState<IncidentType | null>(null);
  const [selectedShiftId, setSelectedShiftId] = useState<string>(shiftId ?? "");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [severity, setSeverity] = useState<Severity | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const styles = getStyles(colors);

  const selectedShift = shifts.find((s) => s.id === selectedShiftId);
  const selectedEvent = selectedShift ? eventsMap[selectedShift.eventId] : null;

  const handleSubmit = async () => {
    if (!incidentType) { Alert.alert("Required", "Please select a type of incident."); return; }
    if (!severity) { Alert.alert("Required", "Please select a severity level."); return; }
    if (!description.trim()) { Alert.alert("Required", "Please describe what happened."); return; }

    setSubmitting(true);
    try {
      // Submission logic goes here
      await new Promise((r) => setTimeout(r, 800));
      Alert.alert("Report Submitted", "Your incident report has been sent.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert("Error", "Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Incident</Text>
        <TouchableOpacity style={styles.saveDraftBtn}>
          <Text style={styles.saveDraftText}>Save Draft</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Type of Incident */}
        <View style={styles.field}>
          <Text style={styles.label}>
            Type of Incident <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.chipWrap}>
            {INCIDENT_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.chip, incidentType === type && styles.chipActive]}
                onPress={() => setIncidentType(type)}
              >
                <Text style={[styles.chipText, incidentType === type && styles.chipTextActive]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Related Shift */}
        <View style={styles.field}>
          <Text style={styles.label}>Related Shift</Text>
          <View style={styles.shiftSelector}>
            {selectedShift && selectedEvent ? (
              <View style={styles.shiftSelected}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.shiftSelectedTitle}>{selectedEvent.title}</Text>
                  <Text style={styles.shiftSelectedSub}>{selectedShift.title}</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedShiftId("")}>
                  <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.shiftOptions}>
                  {shifts.map((s) => {
                    const ev = eventsMap[s.eventId];
                    if (!ev) return null;
                    return (
                      <TouchableOpacity
                        key={s.id}
                        style={styles.shiftOption}
                        onPress={() => setSelectedShiftId(s.id)}
                      >
                        <Text style={styles.shiftOptionTitle} numberOfLines={1}>{ev.title}</Text>
                        <Text style={styles.shiftOptionSub} numberOfLines={1}>{s.title}</Text>
                      </TouchableOpacity>
                    );
                  })}
                  {shifts.length === 0 && (
                    <Text style={styles.noShiftsText}>No assigned shifts</Text>
                  )}
                </View>
              </ScrollView>
            )}
          </View>
        </View>

        {/* Location */}
        <View style={styles.field}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder={selectedEvent?.location ?? "Enter location"}
            placeholderTextColor={colors.textTertiary}
          />
          <TouchableOpacity style={styles.locationBtn}>
            <Ionicons name="location" size={16} color={colors.tint} />
            <Text style={styles.locationBtnText}>Use My Current Location</Text>
          </TouchableOpacity>
        </View>

        {/* Description */}
        <View style={styles.field}>
          <Text style={styles.label}>
            Description <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.textarea}
            value={description}
            onChangeText={(t) => t.length <= 500 && setDescription(t)}
            placeholder="Describe what happened in detail..."
            placeholderTextColor={colors.textTertiary}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{description.length}/500</Text>
        </View>

        {/* Severity */}
        <View style={styles.field}>
          <Text style={styles.label}>
            Severity Level <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.severityGrid}>
            {(Object.keys(SEVERITY_COLORS) as Severity[]).map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.severityBtn,
                  severity === level && {
                    borderColor: SEVERITY_COLORS[level],
                    borderWidth: 2,
                  },
                ]}
                onPress={() => setSeverity(level)}
              >
                <View style={[styles.severityDot, { backgroundColor: SEVERITY_COLORS[level] }]} />
                <Text style={styles.severityText}>{level}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Add Photos */}
        <View style={styles.field}>
          <Text style={styles.label}>Add Photos (Optional)</Text>
          <View style={styles.photosRow}>
            <TouchableOpacity style={styles.addPhotoBtn}>
              <Ionicons name="camera-outline" size={28} color={colors.textTertiary} />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.photoHint}>You can add up to 5 photos</Text>
        </View>

        {/* Footer note */}
        <View style={styles.footerNote}>
          <Ionicons name="information-circle" size={16} color={colors.tint} />
          <Text style={styles.footerNoteText}>This report will be sent to your shift coordinator</Text>
        </View>
      </ScrollView>

      {/* Submit */}
      <View style={[styles.submitContainer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitBtnText}>Submit Report</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.headerBorder,
    },
    headerBtn: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    saveDraftBtn: {
      paddingHorizontal: 4,
    },
    saveDraftText: {
      fontSize: 15,
      fontWeight: "500",
      color: colors.tint,
    },
    scroll: {
      flex: 1,
    },
    content: {
      padding: 20,
      gap: 24,
      paddingBottom: 8,
    },
    field: {
      gap: 10,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    required: {
      color: colors.danger,
    },
    chipWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    chip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.cardBackground,
    },
    chipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    chipText: {
      fontSize: 13,
      fontWeight: "500",
      color: colors.textSecondary,
    },
    chipTextActive: {
      color: "#FFFFFF",
    },
    shiftSelector: {
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 10,
      backgroundColor: colors.inputBackground,
      minHeight: 52,
      justifyContent: "center",
    },
    shiftSelected: {
      flexDirection: "row",
      alignItems: "center",
      padding: 14,
      gap: 10,
    },
    shiftSelectedTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    shiftSelectedSub: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    shiftOptions: {
      flexDirection: "row",
      gap: 10,
      padding: 12,
    },
    shiftOption: {
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      borderRadius: 8,
      padding: 10,
      minWidth: 140,
      maxWidth: 200,
    },
    shiftOptionTitle: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    shiftOptionSub: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    noShiftsText: {
      fontSize: 13,
      color: colors.textTertiary,
      padding: 14,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 10,
      padding: 14,
      fontSize: 15,
      backgroundColor: colors.inputBackground,
      color: colors.textPrimary,
    },
    locationBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    locationBtnText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.tint,
    },
    textarea: {
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 10,
      padding: 14,
      fontSize: 15,
      backgroundColor: colors.inputBackground,
      color: colors.textPrimary,
      minHeight: 120,
    },
    charCount: {
      fontSize: 12,
      color: colors.textTertiary,
      textAlign: "right",
    },
    severityGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    severityBtn: {
      width: "47%",
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 14,
      paddingHorizontal: 16,
      backgroundColor: colors.cardBackground,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    severityDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    severityText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textPrimary,
    },
    photosRow: {
      flexDirection: "row",
      gap: 10,
    },
    addPhotoBtn: {
      width: 90,
      height: 90,
      backgroundColor: colors.emptyStateBg,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },
    addPhotoText: {
      fontSize: 11,
      color: colors.textTertiary,
    },
    photoHint: {
      fontSize: 12,
      color: colors.textTertiary,
    },
    footerNote: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: colors.infoSubtle,
      padding: 14,
      borderRadius: 10,
    },
    footerNoteText: {
      fontSize: 13,
      color: colors.textSecondary,
      flex: 1,
    },
    submitContainer: {
      padding: 20,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
    },
    submitBtn: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 14,
      alignItems: "center",
    },
    submitBtnDisabled: {
      opacity: 0.6,
    },
    submitBtnText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
  });
}
