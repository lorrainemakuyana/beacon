import { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Link, router } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement Firebase Auth registration
      console.log("Registration attempt:", formData);

      // Simulate registration for now
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert("Success", "Account created successfully!", [
          { text: "OK", onPress: () => router.replace("/(tabs)") },
        ]);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Registration Failed", "Please try again");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedView style={styles.logoContainer}>
          <IconSymbol size={60} name="heart.fill" color="#10B981" />
        </ThemedView>
        <ThemedText type="title">Join Beacon</ThemedText>
        <ThemedText type="subtitle">Create your volunteer account</ThemedText>
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
            />
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Email</ThemedText>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(value) => handleInputChange("email", value)}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
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
          />
        </ThemedView>

        <TouchableOpacity
          style={[
            styles.registerButton,
            isLoading && styles.registerButtonDisabled,
          ]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <ThemedText style={styles.registerButtonText}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </ThemedText>
        </TouchableOpacity>

        <ThemedView style={styles.divider}>
          <ThemedView style={styles.dividerLine} />
          <ThemedText style={styles.dividerText}>OR</ThemedText>
          <ThemedView style={styles.dividerLine} />
        </ThemedView>

        <TouchableOpacity style={styles.socialButton}>
          <IconSymbol size={20} name="globe" color="#4285F4" />
          <ThemedText style={styles.socialButtonText}>
            Continue with Google
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <IconSymbol size={20} name="apple.logo" color="#000000" />
          <ThemedText style={styles.socialButtonText}>
            Continue with Apple
          </ThemedText>
        </TouchableOpacity>

        <ThemedView style={styles.loginPrompt}>
          <ThemedText>Already have an account? </ThemedText>
          <Link href="/auth/login" asChild>
            <TouchableOpacity>
              <ThemedText style={styles.loginLink}>Sign In</ThemedText>
            </TouchableOpacity>
          </Link>
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
    padding: 40,
    paddingTop: 80,
    alignItems: "center",
    gap: 15,
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
    padding: 30,
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
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
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
    marginVertical: 10,
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
