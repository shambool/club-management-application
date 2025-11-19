// app/login.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { login, authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.trim().length > 0 && password.length > 0 && !authLoading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError(null);

    try {
      await login(email.trim(), password);
      // if login succeeds, go to main app
      router.replace("/(tabs)/feed");
    } catch (e: any) {
      // in case login() rethrows – extra safety
      setError("Invalid email or password.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F6EDDF" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Simple "logo" circle like your mock */}
        <View style={styles.logoCircle}>
          <View style={styles.logoPacman} />
        </View>

        <Text style={styles.title}>Sign in</Text>

        {/* Error message */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* EMAIL */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <View style={styles.inputRow}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="email_address@"
              placeholderTextColor="#B8A79B"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>
        </View>

        {/* PASSWORD */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputRow}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#B8A79B"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              style={styles.input}
            />
            <Pressable
              onPress={() => setShowPassword((v) => !v)}
              hitSlop={8}
              style={styles.eyeButton}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#7F6C62"
              />
            </Pressable>
          </View>
        </View>

        {/* LOGIN BUTTON */}
        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit}
          style={({ pressed }) => [
            styles.loginButton,
            !canSubmit && styles.loginButtonDisabled,
            pressed && canSubmit && { transform: [{ scale: 0.98 }] },
          ]}
        >
          {authLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.loginText}>LOGIN</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ----------------------------- styles ----------------------------- */

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "#F6EDDF", // warm beige
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: "center",
  },

  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#7F6C62",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  logoPacman: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#7F6C62",
    borderRightColor: "transparent",
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#5A4B44",
    marginBottom: 36,
  },

  errorText: {
    color: "#B91C1C",
    marginBottom: 16,
    textAlign: "center",
  },

  inputGroup: {
    width: "100%",
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    color: "#7F6C62",
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C2B2A3",
    backgroundColor: "#F9F1E6",
    height: 46,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#4B3B33",
  },
  eyeButton: {
    paddingLeft: 8,
  },

  loginButton: {
    marginTop: 28,
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#5A443B",
    backgroundColor: "#5A443B",
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonDisabled: {
    backgroundColor: "#CBB7AA",
    borderColor: "#CBB7AA",
  },
  loginText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
