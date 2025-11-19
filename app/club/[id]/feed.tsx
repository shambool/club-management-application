// app/club/[id]/feed.tsx
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Pressable,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import EventCard from "@/components/EventCard";
import type { Event } from "@/types/event";
import type { ClubProfile } from "@/types/clubProfile";
import type { EventRow } from "@/api/events";
import { getClub, getClubEvents } from "@/api/clubs";

function mapRowToEvent(row: EventRow, club: ClubProfile): Event {
  const start = new Date(row.startdate).getTime();
  const end = new Date(row.enddate).getTime();
  const mins = Math.max(0, Math.round((end - start) / 60000));
  const duration =
    mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)}h ${mins % 60 ? `${mins % 60}m` : "0m"}`;

  return {
    eventId: String(row.id),
    eventTitle: row.title,
    eventPoster: row.posterimgurl ?? "",
    attending: 0,
    hasVolunteerOption: (row.volunteer_points ?? 0) > 0,
    startDate: row.startdate,
    duration,
    place: row.location ?? "",
    desc: row.description ?? "",
    club,
    externalLink: row.externallink ?? "",
    Attendee_points: row.attendee_points ?? 0,
    Volunteer_points: row.volunteer_points ?? 0,
    createdAt: row.createdat ?? row.startdate,
  };
}

export default function ClubFeed() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const clubId = Number(id);

  const [club, setClub] = useState<ClubProfile | null>(null);
  const [items, setItems] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id || Number.isNaN(clubId)) {
      setError("Invalid club id");
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      setError(null);

      // Fetch club for name/logo mapping
      const c = await getClub(clubId);
      const clubProfile: ClubProfile = {
        id: String(c.id),
        name: c.title,
        description: c.description ?? "",
        logo_url: c.logourl ?? "",
        created_at: c.createdat ?? "",
        original_President: c.originalpresident ? String(c.originalpresident) : "",
        current_President: "",
      };
      setClub(clubProfile);

      // Fetch this club’s events
      const rows = await getClubEvents(clubId);
      const mapped = rows
        .map((r) => mapRowToEvent(r as EventRow, clubProfile))
        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      setItems(mapped);
    } catch (e: any) {
      console.error("Club feed load failed:", e?.message || e);
      setError("Failed to load events.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id, clubId]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <Pressable
        onPress={() => (router.canGoBack() ? router.back() : router.replace("/clubs"))}
        style={styles.backBtn}
        hitSlop={10}
      >
        <Ionicons name="arrow-back" size={22} color="#111" />
      </Pressable>

      {/* Small title */}
      <Text style={styles.title}>{club ? `${club.name} — Events` : "Events"}</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? (
        <Text style={styles.loading}>Loading…</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.eventId}
          renderItem={({ item }) => <EventCard event={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text style={styles.empty}>No events for this club yet.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 12, paddingTop: 12 },
  backBtn: {
    alignSelf: "flex-start",
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#F7F7F8",
    marginBottom: 6,
  },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 6, color: "#111" },
  error: { color: "red", marginBottom: 8 },
  loading: { marginTop: 8 },
  listContent: { paddingBottom: 80 },
  empty: { textAlign: "center", color: "#6B7280", marginTop: 16 },
});
