import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/theme";

export default function CheckInScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.qrSection}>
        <View style={styles.qrPlaceholder}>
          <IconSymbol size={80} name="qrcode" color={colors.tint} />
          <ThemedText type="subtitle">QR Code Scanner</ThemedText>
        </View>
      </View>

      <View style={styles.bottom}>
        <View style={styles.statusSection}>
          <View style={styles.statusCard}>
            <ThemedText>Not currently checked in to any shift</ThemedText>
          </View>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <ThemedText style={styles.dividerText}>OR</ThemedText>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.manualSection}>
          <TouchableOpacity style={styles.checkInButton}>
            <IconSymbol size={24} name="location.fill" color="#FFFFFF" />
            <ThemedText style={styles.checkInButtonText}>
              Manual Check-In
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.checkOutButton}>
            <IconSymbol size={24} name="location" color={colors.danger} />
            <ThemedText style={styles.checkOutButtonText}>Check-Out</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    qrSection: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    qrPlaceholder: {
      width: 260,
      height: 260,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.tint,
      borderStyle: "dashed",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
    },
    bottom: {
      gap: 20,
      paddingBottom: 10,
    },
    divider: {
      flexDirection: "row",
      alignItems: "center",
      gap: 15,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    dividerText: {
      color: colors.textSecondary,
      fontSize: 14,
    },
    manualSection: {
      gap: 15,
    },
    checkInButton: {
      backgroundColor: colors.primary,
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
      backgroundColor: colors.cardBackground,
      borderWidth: 2,
      borderColor: colors.danger,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      borderRadius: 12,
      gap: 10,
    },
    checkOutButtonText: {
      color: colors.danger,
      fontSize: 16,
      fontWeight: "600",
    },
    statusSection: {
      gap: 10,
    },
    statusCard: {
      padding: 20,
      backgroundColor: colors.emptyStateBg,
      borderRadius: 8,
      alignItems: "center",
    },
  });
}
