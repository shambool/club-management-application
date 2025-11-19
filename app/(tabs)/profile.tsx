import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import {
  getMyPastAttendedEvents,
  getMyPastVolunteeredEvents,
  getMeUser,
  MyEventRow,
  MeUser,
} from "@/api/me";
import { getEvent, EventRow } from "@/api/events";

type HistoryType = "attended" | "volunteered";

type HistoryItem = {
  id: string;
  clubName: string;
  eventTitle: string;
  dateISO: string;
  points: number;
  poster?: string;
  type: HistoryType;
};

const { width } = Dimensions.get("window");
const HISTORY_HEIGHT = 420; // gray history area height

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [user, setUser] = useState<MeUser | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [volunteeredCount, setVolunteeredCount] = useState(0);
  const [filter, setFilter] = useState<HistoryType>("attended");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // derive display name + avatar from API user
  const userName = user?.name ?? "Student";
  const avatar =
    user?.imgurl ||
    "https://i.pinimg.com/736x/2f/bd/cf/2fbdcfbe8a646d1d92e3dc5c26cbb80a.jpg";

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        // fetch user + history in parallel
        const [me, attended, volunteered] = await Promise.all([
          getMeUser(),
          getMyPastAttendedEvents(),
          getMyPastVolunteeredEvents(),
        ]);

        setUser(me);

        // fetch event details for points/poster/club name
        const ids = Array.from(
          new Set([...attended, ...volunteered].map((e) => e.eventid))
        );
        const details = await Promise.all(ids.map((id) => getEvent(id)));
        const eventMap = new Map<number, EventRow>();
        details.forEach((ev) => eventMap.set(ev.id, ev));

        const mapToHistory = (
          row: MyEventRow,
          type: HistoryType
        ): HistoryItem => {
          const ev = eventMap.get(row.eventid);
          const clubName =
            ev?.clubs?.title ?? `Club #${row.clubid ?? ev?.clubs?.id ?? ""}`;

          const points =
            type === "attended"
              ? ev?.attendee_points ?? 0
              : ev?.volunteer_points ?? 0;

          return {
            id: `${type}-${row.eventid}-${row.startdate}`,
            clubName,
            eventTitle: row.title,
            dateISO: row.startdate,
            points,
            poster: ev?.posterimgurl ?? undefined,
            type,
          };
        };

        const historyItems: HistoryItem[] = [
          ...attended.map((r) => mapToHistory(r, "attended")),
          ...volunteered.map((r) => mapToHistory(r, "volunteered")),
        ];

        const totalPts = historyItems.reduce((sum, h) => sum + h.points, 0);
        const volCount = volunteered.length;

        setHistory(historyItems);
        setTotalPoints(totalPts);
        setVolunteeredCount(volCount);
      } catch (e: any) {
        console.error("Profile load failed:", e?.message || e);
        setError("Failed to load your profile or history.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(
    () =>
      history
        .filter((h) => h.type === filter)
        .sort(
          (a, b) =>
            new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
        ),
    [history, filter]
  );

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardClub}>{item.clubName}</Text>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.eventTitle}
          </Text>
        </View>
        <View style={styles.dateChip}>
          <Ionicons name="calendar-outline" size={13} color="#111827" />
          <Text style={styles.dateText}>
            {new Date(item.dateISO).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.posterWrap}>
        {item.poster ? (
          <Image source={{ uri: item.poster }} style={styles.poster} />
        ) : (
          <View style={[styles.poster, styles.posterPlaceholder]}>
            <Ionicons name="image-outline" size={24} color="#9CA3AF" />
          </View>
        )}
        <View style={styles.pointsChip}>
          <Text style={styles.pointsText}>{item.points} pts</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { paddingTop: insets.top + 8, justifyContent: "center" },
        ]}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top + 8 }]}
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      {/* TOP BLOCK */}
      <View style={styles.topRow}>
        {/* Left tall grey area */}
        <View style={styles.profileLeft}>
          <View style={styles.avatarCircleWrap}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
          </View>
          <Text style={styles.name}>{userName}</Text>
          <Pressable
            onPress={() => router.push("/profile/followings")}
            style={({ pressed }) => [
              styles.followBtn,
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text style={styles.followText}>Followings</Text>
          </Pressable>
        </View>

        {/* Right stats */}
        <View style={styles.statsRight}>
          <View>
            <Text style={styles.statTitle}>Total Points</Text>
            <Text style={styles.statSub}>(points)</Text>
            <Text style={styles.statNumber}>{totalPoints}</Text>
          </View>

          <View style={{ height: 22 }} />

          <View>
            <Text style={styles.statTitle}>Volunteered</Text>
            <Text style={styles.statSub}>(number)</Text>
            <Text style={styles.statNumber}>{volunteeredCount}</Text>
          </View>
        </View>
      </View>

      {error && (
        <Text style={{ color: "#EF4444", marginTop: 8, marginLeft: 4 }}>
          {error}
        </Text>
      )}

      {/* HISTORY SECTION */}
      <View style={styles.historyShell}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>My History</Text>

          <Pressable
            onPress={() =>
              setFilter((f) => (f === "attended" ? "volunteered" : "attended"))
            }
            style={({ pressed }) => [
              styles.filterPill,
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text style={styles.filterText}>
              {filter === "attended" ? "Attended" : "Volunteered"}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#fff" />
          </Pressable>
        </View>

        {/* inner gray scroll area */}
        <View style={styles.historyPanel}>
          <FlatList
            data={filtered}
            keyExtractor={(i) => i.id}
            renderItem={renderItem}
            nestedScrollEnabled
            showsVerticalScrollIndicator
            style={{ height: HISTORY_HEIGHT }}
            contentContainerStyle={{ padding: 12, gap: 12 }}
            ListEmptyComponent={
              <Text
                style={{
                  textAlign: "center",
                  color: "#E5E7EB",
                  marginTop: 16,
                }}
              >
                No {filter} events yet.
              </Text>
            }
          />
        </View>
      </View>
    </ScrollView>
  );
}

/* ----------------------------- styles ----------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
  },

  /* TOP SECTION */
  topRow: {
    flexDirection: "row",
    marginBottom: 18,
  },
  profileLeft: {
    flex: 1,
    backgroundColor: "#7F8185", // darker grey like your mock
    borderTopLeftRadius: 28,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 18,
    alignItems: "center",
  },
  avatarCircleWrap: {
    width: width * 0.32,
    height: width * 0.32,
    borderRadius: 999,
    backgroundColor: "#EDEFF2",
    borderWidth: 3,
    borderColor: "#D5D7DB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatar: {
    width: "88%",
    height: "88%",
    borderRadius: 999,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  followBtn: {
    paddingHorizontal: 24,
    height: 38,
    borderRadius: 999,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },
  followText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },

  statsRight: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 34,
    paddingBottom: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: "flex-start",
  },
  statTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111111",
  },
  statSub: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 2,
  },
  statNumber: {
    marginTop: 6,
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },

  /* HISTORY SECTION */
  historyShell: {
    marginTop: 10,
    borderRadius: 22,
    backgroundColor: "#7F8185", // big gray block like mock
    padding: 14,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  historyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111111",
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#111111",
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 999,
  },
  filterText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },

  historyPanel: {
    backgroundColor: "#E4E5EB",
    borderRadius: 18,
    overflow: "hidden",
  },

  /* EVENT CARD */
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  cardHeader: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardClub: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  cardTitle: {
    fontSize: 14,
    color: "#374151",
    marginTop: 2,
    maxWidth: width * 0.6,
  },
  dateChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    height: 30,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#111111",
  },
  dateText: {
    fontSize: 12,
    color: "#111827",
    fontWeight: "600",
  },

  posterWrap: {
    marginTop: 10,
    marginHorizontal: 14,
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  poster: {
    width: "100%",
    height: 170,
    resizeMode: "cover",
  },
  posterPlaceholder: {
    backgroundColor: "#F5F6FA",
    alignItems: "center",
    justifyContent: "center",
  },
  pointsChip: {
    position: "absolute",
    bottom: 10,
    left: "50%",
    transform: [{ translateX: -40 }],
    backgroundColor: "#111111",
    paddingHorizontal: 14,
    height: 32,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  pointsText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 13,
  },
});
