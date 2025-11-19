import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Platform,
  RefreshControl,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { getClubEvents, getClub, type EventRow } from "@/api/clubs";
import type { Event } from "@/types/event";
import type { ClubProfile } from "@/types/clubProfile";

/** Map backend EventRow -> your UI Event type */
function mapRowToEvent(row: EventRow, club: ClubProfile): Event {
  return {
    eventId: String(row.id),
    eventTitle: row.title,
    eventPoster: row.posterimgurl ?? "",
    attending: 0, // not provided yet
    hasVolunteerOption: (row.volunteer_points ?? 0) > 0,
    startDate: row.startdate,
    duration: "",
    place: row.location ?? "",
    desc: row.description ?? "",
    club,
    externalLink: row.externallink ?? "",
    Attendee_points: row.attendee_points ?? 0,
    Volunteer_points: row.volunteer_points ?? 0,
    createdAt: row.createdat ?? row.startdate,
  };
}

export default function EventFeedbackList() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { clubId } = useLocalSearchParams<{ clubId?: string }>();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      if (!clubId) {
        setError("Missing club ID");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const clubNum = Number(clubId);
      const c = await getClub(clubNum);
      const clubProfile: ClubProfile = {
        id: String(c.id),
        name: c.title,
        description: c.description ?? "",
        logo_url: c.logourl ?? "",
        created_at: c.createdat ?? "",
        original_President: c.originalpresident ? String(c.originalpresident) : "",
        current_President: "",
      };

      const rows = await getClubEvents(clubNum);
      const mapped = rows
        .map((r) => mapRowToEvent(r as EventRow, clubProfile))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setEvents(mapped);
    } catch (e: any) {
      console.error("Failed to fetch events:", e?.message || e);
      setError("Failed to load events.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [clubId]);

  useEffect(() => {
    load();
  }, [load]);

  const onBack = () => (router.canGoBack() ? router.back() : router.replace("/"));

  const renderItem = ({ item }: { item: Event }) => (
    <Pressable
      onPress={() => router.push(`/feedback/event/${item.eventId}?clubId=${clubId ?? ""}`)}
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
          <Text style={styles.emptyText}>
            {loading
              ? "Loading events…"
              : error
              ? error
              : "No events yet for this club."}
          </Text>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />
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

  content: {
    paddingHorizontal: 16,
    gap: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: "#111",
    marginBottom: 10,
  },

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
