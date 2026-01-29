import {
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { ThemedText } from "@/components/themed-text";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  text: string;
  variant?: ButtonVariant;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  asChild?: boolean;
  loading?: boolean;
  disabled?: boolean;
};

export default function Button({
  text,
  variant = "primary",
  onPress,
  style,
  asChild,
  loading,
  disabled,
}: ButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[isPrimary ? styles.primaryButton : styles.secondaryButton, style]}
      activeOpacity={0.8}
    >
      {loading && (
        <ActivityIndicator
          animating={true}
          color={isPrimary ? "#fff" : "#475569"}
        />
      )}
      <ThemedText
        style={
          isPrimary ? styles.primaryButtonText : styles.secondaryButtonText
        }
      >
        {text}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: "#059669",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    padding: 15,
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
