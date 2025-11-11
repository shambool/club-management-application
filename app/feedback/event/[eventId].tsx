import React, { useMemo, useState } from "react";
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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// TEMP: mock source; later swap to Supabase fetch
import { mockEvents } from "@/constants/mockEvents";
import type { Event } from "@/types/event";

export default function EventRatingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { eventId, clubId } = useLocalSearchParams<{
    eventId: string;
    clubId?: string;
  }>();

  // Look up event (newest -> oldest not needed here)
  const event: Event | undefined = useMemo(
    () => mockEvents.find((e) => e.eventId === eventId),
    [eventId]
  );

  // rating + text state
  const [rating, setRating] = useState<number>(0); // 0..5
  const [text, setText] = useState("");

  const onBack = () =>
    router.canGoBack() ? router.back() : router.replace("/");

  const onStarPress = (value: number) => setRating(value);

  const onSubmit = () => {
    // Later: insert into Supabase (feedback table)
    // Example payload shape (keep this for later wiring):
    // {
    //   event_id: eventId,
    //   club_id: clubId ?? null,
    //   rating: rating,           // integer 1..5
    //   comment: text.trim(),
    //   created_at: new Date().toISOString(),
    //   user_id: <loggedInUserId> // when auth is hooked up
    // }

    Alert.alert("Thank you!", "Your feedback has been recorded (mock).");
    router.back();
  };

  const submitEnabled = rating > 0 || text.trim().length > 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Back */}
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
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
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
          {/* Title */}
          <Text style={styles.title}>
            {`Rate: ${event?.eventTitle ?? "Event"}!`}
          </Text>

          {/* Big icon “hero” */}
          <View style={styles.hero}>
            <MaterialCommunityIcons
              name="calendar-star"
              size={54}
              color="#4F63F6"
            />
          </View>

          {/* Stars */}
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((v) => (
              <Pressable
                key={v}
                onPress={() => onStarPress(v)}
                hitSlop={8}
                style={({ pressed }) => [
                  styles.starWrap,
                  pressed && { opacity: 0.9 },
                ]}
              >
                <Ionicons
                  name={v <= rating ? "star" : "star-outline"}
                  size={30}
                  color={v <= rating ? "#F59E0B" : "#C4C7D0"}
                />
              </Pressable>
            ))}
          </View>

          {/* Text area */}
          <View style={styles.inputCard}>
            <TextInput
              placeholder="Share your thoughts about this event…"
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

          {/* Submit */}
          <Pressable
            disabled={!submitEnabled}
            onPress={onSubmit}
            style={({ pressed }) => [
              styles.submitBtn,
              !submitEnabled && styles.submitDisabled,
              pressed && submitEnabled && { transform: [{ scale: 0.98 }] },
            ]}
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

/* ------------------------------ styles ------------------------------ */

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
  starsRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10, // ⟵ tight gap to textarea
  },
  starWrap: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    minHeight: 140,
    fontSize: 15,
    color: "#111827",
  },
  counter: { textAlign: "right", color: "#9BA0A6", fontSize: 12, marginTop: 6 },
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
    width: 220, // ⬅️ smaller, centered
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
