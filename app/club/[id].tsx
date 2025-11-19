import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import SnakeEventsGrid from "@/components/SnakeEventsGrid";

import type { ClubProfile } from "@/types/clubProfile";
import type { Event } from "@/types/event";
import type { EventRow } from "@/api/events";
import { getClub } from "@/api/clubs";
import { getClubEvents } from "@/api/clubs"; // GET /clubs/:id/events
import { getMyClubs } from "@/api/me";
import { joinClub, leaveClub } from "@/api/members";

const { width } = Dimensions.get("window");

/** Map EventRow (backend) -> Event (your UI type) */
function mapEventRowToEvent(row: EventRow): Event {
  const club: ClubProfile = row.clubs
    ? {
        id: String(row.clubs.id),
        name: row.clubs.title,
        description: "",
        logo_url: row.clubs.logourl ?? "",
        created_at: "",
        original_President: "",
        current_President: "",
      }
    : {
        id: "0",
        name: "Club",
        description: "",
        logo_url: "",
        created_at: "",
        original_President: "",
        current_President: "",
      };

  const durationMin = Math.max(
    0,
    Math.round(
      (new Date(row.enddate).getTime() - new Date(row.startdate).getTime()) /
        60000
    )
  );
  const duration =
    durationMin < 60
      ? `${durationMin} min`
      : `${Math.floor(durationMin / 60)}h ${
          durationMin % 60 ? `${durationMin % 60}m` : "0m"
        }`;

  return {
    eventId: String(row.id),
    eventTitle: row.title,
    eventPoster: row.posterimgurl ?? "",
    attending: 0, // not in schema; keep 0 for now
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

export default function ClubDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [club, setClub] = useState<ClubProfile | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const clubIdNum = Number(id);

  const load = useCallback(async () => {
    if (!id || Number.isNaN(clubIdNum)) {
      setError("Invalid club id");
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      setError(null);

      // 1) club
      const c = await getClub(clubIdNum); // { id, title, logourl, description, createdat, originalpresident? }
      const mappedClub: ClubProfile = {
        id: String(c.id),
        name: c.title,
        description: c.description ?? "",
        logo_url: c.logourl ?? "",
        created_at: c.createdat ?? "",
        original_President: c.originalpresident
          ? String(c.originalpresident)
          : "",
        current_President: "", // not returned on this route
      };
      setClub(mappedClub);

      // 2) follow state: is this club in my active memberships?
      try {
        const myClubs = await getMyClubs();
        const activeRow = myClubs.find(
          (row) => row.clubid === clubIdNum && row.status === "active"
        );
        setIsFollowing(!!activeRow);
      } catch (e: any) {
        console.error("Failed to fetch my clubs for follow state:", e?.message || e);
        // leave isFollowing as previous (default false)
      }

      // 3) club events
      const rows = await getClubEvents(clubIdNum); // EventRow[] (no clubs nested here)
      const mappedEvents: Event[] = rows
        .map((r) =>
          mapEventRowToEvent({
            ...r,
            clubs: {
              id: clubIdNum,
              title: mappedClub.name,
              logourl: mappedClub.logo_url || null,
            },
          } as EventRow)
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      setEvents(mappedEvents);
    } catch (e: any) {
      console.error("Club detail load failed:", e?.message || e);
      setError("Failed to load club.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id, clubIdNum]);

  useEffect(() => {
    load();
  }, [load]);

  const onBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/clubs");
  };

  const onToggleFollow = async () => {
    if (!club || followLoading || Number.isNaN(clubIdNum)) return;

    const previous = isFollowing;
    setFollowLoading(true);

    try {
      if (previous) {
        // Unfollow
        setIsFollowing(false); // optimistic
        await leaveClub(clubIdNum);
      } else {
        // Follow
        setIsFollowing(true); // optimistic
        await joinClub(clubIdNum);
      }
    } catch (e: any) {
      console.error("Follow toggle failed:", e?.message || e);
      // revert if request failed
      setIsFollowing(previous);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading…</Text>
      </View>
    );
  }

  if (!club) {
    return (
      <View style={styles.centered}>
        <Text>{error || "Club not found."}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Buttons */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.feedbackButton}
        onPress={() => router.push(`/feedback?clubId=${club.id}`)}
      >
        <Ionicons name="chatbubbles-outline" size={20} color="#fff" />
        <Text style={styles.feedbackText}>Feedback</Text>
      </TouchableOpacity>

      <FlatList
        ListHeaderComponent={
          <>
            {/* Club Image */}
            <Image source={{ uri: club.logo_url }} style={styles.logo} />

            {/* Club Info */}
            <View style={styles.infoCard}>
              {/* name + follow button row */}
              <View style={styles.headerRow}>
                <Text style={styles.title}>{club.name}</Text>

                <TouchableOpacity
                  onPress={onToggleFollow}
                  disabled={followLoading}
                  style={[
                    styles.followBtn,
                    isFollowing && styles.followBtnActive,
                    followLoading && { opacity: 0.7 },
                  ]}
                >
                  <Text
                    style={[
                      styles.followText,
                      isFollowing && styles.followTextActive,
                    ]}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Text>
                </TouchableOpacity>
              </View>

              {club.description ? (
                <Text style={styles.description}>{club.description}</Text>
              ) : null}

              {/* Extra Club Info */}
              <View style={styles.metaBox}>
                <Text style={styles.meta}>
                  <Text style={styles.metaLabel}>Founded: </Text>
                  {club.created_at || "N/A"}
                </Text>
                {club.original_President ? (
                  <Text style={styles.meta}>
                    <Text style={styles.metaLabel}>Original President: </Text>
                    {club.original_President}
                  </Text>
                ) : null}
                {club.current_President ? (
                  <Text style={styles.meta}>
                    <Text style={styles.metaLabel}>Current President: </Text>
                    {club.current_President}
                  </Text>
                ) : null}
              </View>
            </View>

            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Events</Text>

            {/* Serpentine events grid (newest → oldest) */}
            <View style={{ paddingHorizontal: 12, marginBottom: 12 }}>
              <SnakeEventsGrid<Event>
                data={events}
                columns={3}
                getId={(e) => e.eventId}
                getImageUrl={(e) => e.eventPoster}
                getCreatedAt={(e) => e.createdAt}
                onPressItem={() => router.push(`/club/${club.id}/feed`)}
              />
            </View>
          </>
        }
        data={[]}
        keyExtractor={() => "x"}
        renderItem={null as any}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
          />
        }
        ListEmptyComponent={
          events.length === 0 ? (
            <Text style={{ textAlign: "center", color: "#6B7280" }}>
              No events yet for this club.
            </Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50 },
  backButton: {
    position: "absolute",
    top: 10,
    left: 12,
    zIndex: 3,
    backgroundColor: "#f9f9f9",
    padding: 6,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  feedbackButton: {
    position: "absolute",
    top: 10,
    right: 12,
    zIndex: 3,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  feedbackText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 5,
    fontSize: 13,
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  listContent: { paddingBottom: 100, backgroundColor: "#fff" },
  logo: {
    width: width - 24,
    height: 180,
    borderRadius: 16,
    alignSelf: "center",
    marginTop: 12,
    backgroundColor: "#F2F3F7",
  },
  infoCard: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 12,
    marginTop: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 6,
  },
  title: { fontSize: 22, fontWeight: "bold", flexShrink: 1 },

  followBtn: {
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#111827",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  followBtnActive: {
    backgroundColor: "#111827",
  },
  followText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  followTextActive: {
    color: "#ffffff",
  },

  description: { fontSize: 14, color: "#555", lineHeight: 20, marginTop: 4 },
  metaBox: { marginTop: 10 },
  meta: { fontSize: 13, color: "#444", marginVertical: 2 },
  metaLabel: { fontWeight: "600", color: "#000" },
  divider: {
    height: 3,
    backgroundColor: "#555",
    width: width * 0.8,
    alignSelf: "center",
    marginVertical: 20,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
    marginBottom: 10,
  },
});
