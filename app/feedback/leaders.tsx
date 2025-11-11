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
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

export default function LeadersFeedbackScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { clubId } = useLocalSearchParams<{ clubId?: string }>();

  const [text, setText] = useState("");
  const submitEnabled = text.trim().length > 0;

  const onBack = () =>
    router.canGoBack() ? router.back() : router.replace("/");
  const onSubmit = () => {
    // Later: supabase.from("leaders_feedback").insert({ club_id: clubId, comment: text.trim() })
    Alert.alert("Thanks!", "Your organizers/leaders feedback was sent (mock).");
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Pressable
        onPress={onBack}
        style={[styles.backBtn, { top: insets.top + 8 }]}
        hitSlop={12}
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
              paddingTop: insets.top + 56,
              paddingBottom: Math.max(insets.bottom, 12) + 12,
            },
          ]}
        >
          <Text style={styles.title}>Anyone you like to complain about?</Text>

          <View style={styles.hero}>
            <MaterialCommunityIcons
              name="account-group-outline"
              size={54}
              color="#FF8A00"
            />
          </View>

          <View style={styles.inputCard}>
            <TextInput
              placeholder="Write your complaint or appreciation for organizers/leaders…"
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

          <Pressable
            disabled={!submitEnabled}
            onPress={onSubmit}
            style={[styles.submitBtn, !submitEnabled && styles.submitDisabled]}
          >
            <Text
              style={[styles.submitText, !submitEnabled && { opacity: 0.7 }]}
            >
              Submit feedback
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const MAX_W = 560;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  backBtn: {
    position: "absolute",
    left: 14,
    zIndex: 999,
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#F7F7F8",
  },
  content: { paddingHorizontal: 18, alignItems: "center", gap: 16 },
  title: {
  fontSize: 22,
  fontWeight: "700",
  color: "#111",
  textAlign: "center",
  marginBottom: 10,
},
hero: {
  width: "100%",
  maxWidth: MAX_W,
  height: 140,
  borderRadius: 12,
  backgroundColor: "#F7F8FB",
  borderWidth: 1,
  borderColor: "#E6E8F0",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 14,
},
 inputCard: {
  width: "100%",
  maxWidth: MAX_W,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#E6E8F0",
  backgroundColor: "#FFFFFF",
  padding: 10,
  marginBottom: 12,
},
input: {
  minHeight: 140,
  fontSize: 15,
  color: "#111827",
},  counter: { textAlign: "right", color: "#9BA0A6", fontSize: 12, marginTop: 6 },
  submitBtn: {
    marginTop: 4,
    width: 190,
    height: 42,
    borderRadius: 999,
    backgroundColor: "#22A699",
    alignItems: "center",
    justifyContent: "center",
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
  submitDisabled: { backgroundColor: "#BFE7DF" },
  submitText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
