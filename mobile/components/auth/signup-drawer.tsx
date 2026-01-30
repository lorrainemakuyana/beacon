import {
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import Button from "../button";
import { useAuth } from "@/context/AuthContext";
import { validateRegistrationData } from "@beacon/shared";

export default function SignupDrawer({ onLogin }: { onLogin: () => void }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { register, loginWithGoogle, loading } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    // Validate input
    const validationError = validateRegistrationData(formData);
    if (validationError) {
      Alert.alert("Error", validationError);
      return;
    }

    try {
      await register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
      );

      Alert.alert(
        "Success",
        "Account created successfully! Please check your email to verify your account.",
        [{ text: "OK", onPress: () => router.replace("/(tabs)") }],
      );
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await loginWithGoogle();
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Google Sign-Up Failed", error.message);
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 40 }}
      style={styles.container}
    >
      <ThemedView style={styles.header}>
        <ThemedText type="subtitle">Create your account</ThemedText>
      </ThemedView>

      <ThemedView style={styles.form}>
        <ThemedView style={styles.nameRow}>
          <ThemedView style={styles.nameInput}>
            <ThemedText style={styles.label}>First Name</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(value) => handleInputChange("firstName", value)}
              placeholder="First name"
              autoComplete="given-name"
              editable={!loading}
            />
          </ThemedView>

          <ThemedView style={styles.nameInput}>
            <ThemedText style={styles.label}>Last Name</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(value) => handleInputChange("lastName", value)}
              placeholder="Last name"
              autoComplete="family-name"
              editable={!loading}
            />
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Email address</ThemedText>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(value) => handleInputChange("email", value)}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            editable={!loading}
          />
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Password</ThemedText>
          <TextInput
            style={styles.input}
            value={formData.password}
            onChangeText={(value) => handleInputChange("password", value)}
            placeholder="Create a password"
            secureTextEntry
            autoComplete="new-password"
            editable={!loading}
          />
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Confirm Password</ThemedText>
          <TextInput
            style={styles.input}
            value={formData.confirmPassword}
            onChangeText={(value) =>
              handleInputChange("confirmPassword", value)
            }
            placeholder="Confirm your password"
            secureTextEntry
            autoComplete="new-password"
            editable={!loading}
          />
        </ThemedView>

        <Button
          text="Register"
          variant="primary"
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
        />

        <ThemedView style={styles.divider}>
          <ThemedView style={styles.dividerLine} />
          <ThemedText style={styles.dividerText}>OR</ThemedText>
          <ThemedView style={styles.dividerLine} />
        </ThemedView>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleGoogleSignup}
          disabled={loading}
        >
          <IconSymbol size={20} name="globe" color="#059669" />
          <ThemedText style={styles.socialButtonText}>
            Continue with Google
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} disabled={loading}>
          <IconSymbol size={20} name="apple.logo" color="#000000" />
          <ThemedText style={styles.socialButtonText}>
            Continue with Apple
          </ThemedText>
        </TouchableOpacity>

        <ThemedView style={styles.loginPrompt}>
          <ThemedText>Already have an account? </ThemedText>

          <TouchableOpacity onPress={onLogin} disabled={loading}>
            <ThemedText style={styles.loginLink}>Sign In</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.terms}>
          <ThemedText style={styles.termsText}>
            By creating an account, you agree to our{" "}
            <ThemedText style={styles.termsLink}>Terms of Service</ThemedText>{" "}
            and <ThemedText style={styles.termsLink}>Privacy Policy</ThemedText>
          </ThemedText>
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
  header: {
    alignItems: "center",
    gap: 15,
    marginBottom: 10,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    paddingTop: 20,
    gap: 20,
  },
  nameRow: {
    flexDirection: "row",
    gap: 15,
  },
  nameInput: {
    flex: 1,
    gap: 8,
  },
  inputGroup: {
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "400",
    color: "#475569",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  registerButton: {
    backgroundColor: "#10B981",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  registerButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginVertical: 5,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    color: "#6B7280",
    fontSize: 14,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    gap: 10,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  loginPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loginLink: {
    color: "#10B981",
    fontWeight: "600",
  },
  terms: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  termsText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 18,
  },
  termsLink: {
    color: "#10B981",
    fontWeight: "500",
  },
});
