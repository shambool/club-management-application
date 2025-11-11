import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function SuggestionFeedbackScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { clubId } = useLocalSearchParams<{ clubId?: string }>();

  const [text, setText] = useState("");
  const canSubmit = text.trim().length > 0;

  const onBack = () => (router.canGoBack() ? router.back() : router.replace("/"));
  const onSubmit = () => {
    // later: supabase insert
    Alert.alert("Thanks!", "Your suggestion was sent (mock).");
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Back button */}
      <Pressable
        onPress={onBack}
        style={[styles.backBtn, { top: insets.top + 8 }]}
        hitSlop={12}
        android_ripple={{ color: "#E5E7EB", borderless: true }}
      >
        <Ionicons name="arrow-back" size={22} color="#111" />
      </Pressable>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            {
              // ⬇️ compact, consistent vertical rhythm
              paddingTop: insets.top + 56,
              paddingBottom: Math.max(insets.bottom, 12) + 12,
            },
          ]}
        >
          <Text style={styles.title}>Give us a suggestion!</Text>

          {/* compact hero */}
          <View style={styles.hero}>
            <Ionicons name="bulb-outline" size={44} color="#8A5BF5" />
          </View>

          {/* text area */}
          <View style={styles.inputCard}>
            <TextInput
              placeholder="Your idea or suggestion..."
              placeholderTextColor="#9BA0A6"
              value={text}
              onChangeText={setText}
              multiline
              textAlignVertical="top"
              style={styles.input}
              maxLength={1000}
            />
            <Text style={styles.counter}>{text.length}/1000</Text>
          </View>

          {/* button */}
          <Pressable
            disabled={!canSubmit}
            onPress={onSubmit}
            style={[
              styles.button,
              !canSubmit && styles.buttonDisabled,
            ]}
          >
            <Text style={[styles.buttonText, !canSubmit && { opacity: 0.7 }]}>
              Submit suggestion
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

/* ----------------------------- styles ----------------------------- */

const MAX_W = 560;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  backBtn: {
    position: "absolute",
    left: 14,
    zIndex: 999,
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#F7F7F8",
  },

  content: {
    paddingHorizontal: 16,
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
    marginBottom: 10, // tighter under title
  },

  hero: {
    width: "100%",
    maxWidth: MAX_W,
    height: 140,               // ⬅️ was taller; now compact
    borderRadius: 12,
    backgroundColor: "#F7F8FB",
    borderWidth: 1,
    borderColor: "#E6E8F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,          // ⬅️ tighter gap to textarea
  },

  inputCard: {
    width: "100%",
    maxWidth: MAX_W,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6E8F0",
    backgroundColor: "#FFFFFF",
    padding: 10,               // ⬅️ slightly smaller padding
    marginBottom: 12,          // ⬅️ tighter gap to button
  },
  input: {
    minHeight: 140,            // ⬅️ compact textarea
    fontSize: 15,
    color: "#111827",
  },
  counter: {
    textAlign: "right",
    color: "#9BA0A6",
    fontSize: 12,
    marginTop: 6,
  },

  button: {
    width: 220,                // ⬅️ smaller, centered
    height: 42,
    borderRadius: 999,
    backgroundColor: "#8A5BF5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  buttonDisabled: {
    backgroundColor: "#D5C7FF",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
