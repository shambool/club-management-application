import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { mockEvents } from "@/constants/mockEvents";
import type { Event } from "@/types/event";

export default function EventFeedbackList() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { clubId } = useLocalSearchParams<{ clubId?: string }>();

  // Filter by club and sort newest -> oldest
  const events: Event[] = useMemo(() => {
    const list = mockEvents.filter((e) => (!clubId ? true : e.club.id === clubId));
    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [clubId]);

  const onBack = () => (router.canGoBack() ? router.back() : router.replace("/"));

  const renderItem = ({ item }: { item: Event }) => (
    <Pressable
      onPress={() =>
        router.push(`/feedback/event/${item.eventId}?clubId=${clubId ?? ""}`)
      }
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.95 }]}
      android_ripple={{ color: "#E5E7EB" }}
    >
      <Image source={{ uri: item.eventPoster }} style={styles.thumb} />
      <View style={styles.cardBody}>
        <Text numberOfLines={2} style={styles.cardTitle}>
          {item.eventTitle}
        </Text>
      </View>
    </Pressable>
  );

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

      <FlatList
        // ⬇️ Push content down so it never collides with back button
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 56,
            paddingBottom: Math.max(insets.bottom, 12) + 12,
          },
        ]}
        ListHeaderComponent={
          <Text style={styles.title}>Select an event to give feedback on!</Text>
        }
        data={events}
        keyExtractor={(e) => e.eventId}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No events yet for this club.</Text>
        }
      />
    </View>
  );
}

const shadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  android: { elevation: 2 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  backBtn: {
    position: "absolute",
    left: 14,
    zIndex: 999,
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#F7F7F8",
    ...shadow,
  },

  // List spacing
  content: {
    paddingHorizontal: 16,
    gap: 10, // nice even rhythm between header and cards
  },

  // Header title (tighter)
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: "#111",
    marginBottom: 10,
  },

  // Event card (slightly more compact radius/border)
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E7E8EF",
    overflow: "hidden",
    ...shadow,
  },

  // Thumbnail (compact)
  thumb: {
    width: 92,
    height: 92,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: "#F1F2F6",
  },

  cardBody: { flex: 1, paddingHorizontal: 12, paddingVertical: 10 },
  cardTitle: { fontSize: 15, fontWeight: "600", color: "#111827" },

  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 14,
    fontSize: 14,
  },
});
