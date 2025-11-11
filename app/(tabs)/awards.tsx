import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  FlatList,
  Platform,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

/* =========================
   Schema-aligned Types
   ========================= */
type UserRow = { id: number; name: string; imgurl?: string | null };
type ClubRow = { id: number; title: string };
type EventRow = { id: number; clubid: number; title: string; createdat?: string };
type UserPointsRow = {
  pointsid: number;
  userid: number;
  type: "volunteer" | "attendee";
  eventid: number;
  points: number;
  createdat: string;
};

/* =========================
   TEMP MOCKS (swap with Supabase)
   ========================= */
const mockUsers: UserRow[] = [
  { id: 1, name: "Maxwell", imgurl: "https://i.pravatar.cc/120?img=1" },
  { id: 2, name: "Camelia", imgurl: "https://i.pravatar.cc/120?img=2" },
  { id: 3, name: "Wilson", imgurl: "https://i.pravatar.cc/120?img=3" },
  { id: 4, name: "Jessica Anderson", imgurl: "https://i.pravatar.cc/120?img=4" },
  { id: 5, name: "Sophia Anderson" },
  { id: 6, name: "Ethan Carter", imgurl: "https://i.pravatar.cc/120?img=6" },
  { id: 7, name: "Liam Johnson" },
  { id: 8, name: "Oliver Smith", imgurl: "https://i.pravatar.cc/120?img=8" },
];

const mockClubs: ClubRow[] = [
  { id: 10, title: "Tech Club" },
  { id: 20, title: "Green Earth" },
  { id: 30, title: "Debate Society" },
];

const mockEvents: EventRow[] = [
  { id: 1001, clubid: 10, title: "AI Workshop", createdat: "2025-10-01" },
  { id: 1002, clubid: 20, title: "Tree Drive", createdat: "2025-09-15" },
  { id: 1003, clubid: 30, title: "Debate Finals", createdat: "2025-03-10" },
  { id: 1004, clubid: 10, title: "Hack Night", createdat: "2025-02-01" },
];

const mockUserPoints: UserPointsRow[] = [
  { pointsid: 1, userid: 1, type: "attendee", eventid: 1001, points: 8, createdat: "2025-10-02" },
  { pointsid: 2, userid: 2, type: "attendee", eventid: 1001, points: 8, createdat: "2025-10-02" },
  { pointsid: 3, userid: 3, type: "volunteer", eventid: 1002, points: 20, createdat: "2025-09-16" },
  { pointsid: 4, userid: 4, type: "attendee", eventid: 1002, points: 8, createdat: "2025-09-16" },
  { pointsid: 5, userid: 5, type: "attendee", eventid: 1001, points: 8, createdat: "2025-10-02" },
  { pointsid: 6, userid: 6, type: "attendee", eventid: 1003, points: 8, createdat: "2025-03-11" },
  { pointsid: 7, userid: 7, type: "volunteer", eventid: 1004, points: 20, createdat: "2025-02-02" },
  { pointsid: 8, userid: 8, type: "attendee", eventid: 1003, points: 8, createdat: "2025-03-11" },
];

/* =========================
   Semesters
   ========================= */
type Semester = { key: string; label: string; start: Date; end: Date };
const makeSemester = (season: "Fall" | "Spring", year: number): Semester => {
  const start = season === "Fall" ? new Date(year, 6, 1) : new Date(year, 0, 1);
  const end =
    season === "Fall"
      ? new Date(year, 11, 31, 23, 59, 59, 999)
      : new Date(year, 5, 30, 23, 59, 59, 999);
  return { key: `${season}-${year}`, label: `${season} ${year}`, start, end };
};
const SEMESTERS: Semester[] = [
  makeSemester("Fall", 2025),
  makeSemester("Spring", 2025),
  makeSemester("Fall", 2024),
];

/* =========================
   Reusable: Chip + Modal + Avatar
   ========================= */
function Chip({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.chip, pressed && { opacity: 0.9 }]}
    >
      <Text style={styles.chipText}>{label}</Text>
      <Ionicons name="chevron-down" size={14} color="#4B5563" />
    </Pressable>
  );
}

function PickerModal<T>({
  visible,
  onClose,
  items,
  getKey,
  getLabel,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  items: T[];
  getKey: (x: T) => string;
  getLabel: (x: T) => string;
  onSelect: (x: T) => void;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <View style={styles.modalSheet}>
          {items.map((it) => (
            <Pressable
              key={getKey(it)}
              style={({ pressed }) => [styles.modalItem, pressed && { backgroundColor: "#F3F4F6" }]}
              onPress={() => {
                onSelect(it);
                onClose();
              }}
            >
              <Text style={styles.modalItemText}>{getLabel(it)}</Text>
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

function initials(name?: string) {
  if (!name) return "•";
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

function Avatar({ uri, name, size = 44, borderColor = "#fff" }: { uri?: string | null; name?: string; size?: number; borderColor?: string }) {
  const r = size / 2;
  return uri ? (
    <Image source={{ uri }} style={{ width: size, height: size, borderRadius: r, borderWidth: 2, borderColor }} />
  ) : (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: r,
        borderWidth: 2,
        borderColor,
        backgroundColor: "#E5E7EB",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontWeight: "700", color: "#374151" }}>{initials(name)}</Text>
    </View>
  );
}

/* =========================
   Main Leaderboard Screen
   ========================= */
export default function LeaderboardScreen() {
  const insets = useSafeAreaInsets();
  const [clubOpen, setClubOpen] = useState(false);
  const [semesterOpen, setSemesterOpen] = useState(false);
  const [pointsOpen, setPointsOpen] = useState(false);
  const [clubId, setClubId] = useState<number | "ALL">("ALL");
  const [semesterKey, setSemesterKey] = useState(SEMESTERS[0].key);
  const [pointsKind, setPointsKind] = useState<"total" | "attendee" | "volunteer">("total");

  const selectedSemester = SEMESTERS.find((s) => s.key === semesterKey)!;

  const clubItems = [{ id: "ALL" as const, title: "All clubs" }, ...mockClubs];

  const rows = useMemo(() => {
    const events = new Map(mockEvents.map((e) => [e.id, e]));
    const users = new Map(mockUsers.map((u) => [u.id, u]));
    const inSem = (iso: string) => {
      const t = new Date(iso).getTime();
      return t >= selectedSemester.start.getTime() && t <= selectedSemester.end.getTime();
    };

    const totals = new Map<number, number>();
    for (const up of mockUserPoints) {
      if (!inSem(up.createdat)) continue;
      if (pointsKind !== "total" && up.type !== pointsKind) continue;
      const ev = events.get(up.eventid);
      if (!ev) continue;
      if (clubId !== "ALL" && ev.clubid !== clubId) continue;
      totals.set(up.userid, (totals.get(up.userid) ?? 0) + up.points);
    }

    const result: { userid: number; name: string; points: number; imgurl?: string | null }[] = [];
    for (const [id, pts] of totals) {
      const u = users.get(id);
      if (u) result.push({ userid: id, name: u.name, imgurl: u.imgurl, points: pts });
    }
    return result.sort((a, b) => b.points - a.points);
  }, [clubId, semesterKey, pointsKind]);

  const podium = rows.slice(0, 3);
  const rest = rows.slice(3);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        <Text style={styles.pageTitle}>Leaderboard</Text>

        <View style={styles.chipsRow}>
          <Chip
            label={clubId === "ALL" ? "Clubs: All" : `Club: ${mockClubs.find((c) => c.id === clubId)?.title}`}
            onPress={() => setClubOpen(true)}
          />
          <Chip label={`Semester: ${selectedSemester.label}`} onPress={() => setSemesterOpen(true)} />
          <Chip
            label={
              pointsKind === "total"
                ? "Points: Total"
                : pointsKind === "attendee"
                ? "Points: Attendance"
                : "Points: Volunteering"
            }
            onPress={() => setPointsOpen(true)}
          />
        </View>

        {/* Podium */}
        <View style={styles.podiumCard}>
          <View style={styles.podiumBars}>
            <Bar place={2} {...podium[1]} color="#5AA3FF" />
            <Bar place={1} {...podium[0]} color="#7C88FF" tallest />
            <Bar place={3} {...podium[2]} color="#233B8A" />
          </View>
        </View>

        {/* Rest */}
        <View style={styles.listCard}>
          <FlatList
            data={rest}
            keyExtractor={(r) => String(r.userid)}
            scrollEnabled={false}
            renderItem={({ item, index }) => (
              <View style={styles.row}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>{(index + 4).toString().padStart(2, "0")}</Text>
                </View>
                <View style={{ marginRight: 10 }}>
                  <Avatar uri={item.imgurl} name={item.name} size={36} borderColor="#E6E8FF" />
                </View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.points}>{item.points} pts</Text>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </ScrollView>

      {/* Pickers */}
      <PickerModal
        visible={clubOpen}
        onClose={() => setClubOpen(false)}
        items={clubItems}
        getKey={(x) => ("id" in x ? String(x.id) : "ALL")}
        getLabel={(x) => ("title" in x ? x.title : "All clubs")}
        onSelect={(x) => setClubId(("id" in x ? (x.id as number) : "ALL"))}
      />
      <PickerModal
        visible={semesterOpen}
        onClose={() => setSemesterOpen(false)}
        items={SEMESTERS}
        getKey={(s) => s.key}
        getLabel={(s) => s.label}
        onSelect={(s) => setSemesterKey(s.key)}
      />
      <PickerModal
        visible={pointsOpen}
        onClose={() => setPointsOpen(false)}
        items={[
          { k: "total", l: "Total (attendance + volunteering)" },
          { k: "attendee", l: "Attendance only" },
          { k: "volunteer", l: "Volunteering only" },
        ] as const}
        getKey={(i) => i.k}
        getLabel={(i) => i.l}
        onSelect={(i) => setPointsKind(i.k)}
      />
    </View>
  );
}

/* =========================
   Podium Bar (avatars higher)
   ========================= */
function Bar({
  place,
  name,
  points,
  imgurl,
  color,
  tallest,
}: {
  place: 1 | 2 | 3;
  name?: string;
  points?: number;
  imgurl?: string | null;
  color: string;
  tallest?: boolean;
}) {
  const height = tallest ? 140 : place === 2 ? 110 : 100;
  return (
    <View style={[styles.barCol, { height }]}>
      <View style={[styles.bar, { backgroundColor: color, height }]}>
        <Text style={styles.barPlace}>{place}</Text>
        <View style={styles.barNamePill}>
          <Text style={styles.barName}>{name ?? "—"}</Text>
        </View>
      </View>

      {/* Avatar circle raised higher */}
      <View style={[styles.barAvatarWrap, { top: -46 }]}>
        <Avatar uri={imgurl} name={name} size={56} />
      </View>

      <Text style={styles.barValue}>{points ?? 0}</Text>
    </View>
  );
}

/* =========================
   Styles
   ========================= */
const shadow = Platform.select({
  ios: { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  android: { elevation: 3 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#5E63F6" },
  pageTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
    justifyContent: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#EEF0FF",
    borderWidth: 1,
    borderColor: "#DDE1FF",
  },
  chipText: { color: "#4B5563", fontWeight: "600", fontSize: 13 },

  podiumCard: { backgroundColor: "#fff", borderRadius: 18, padding: 14, ...shadow },
  podiumBars: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", height: 180 },
  barCol: { width: "31%", alignItems: "center", justifyContent: "flex-end" },
  bar: { width: "100%", borderRadius: 16, alignItems: "center", justifyContent: "flex-end", paddingBottom: 10 },
  barPlace: { color: "#fff", fontWeight: "900", fontSize: 28 },
  barNamePill: {
    marginTop: 10,
    marginBottom: -18,
    backgroundColor: "rgba(255,255,255,0.85)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  barName: { color: "#273043", fontWeight: "700", fontSize: 12 },
  barValue: { color: "#273043", fontWeight: "700", marginTop: 8 },
  barAvatarWrap: { position: "absolute", alignSelf: "center", zIndex: 2 },

  listCard: { backgroundColor: "#fff", borderRadius: 18, padding: 12, marginTop: 12, marginBottom: 18, ...shadow },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
    rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#D9DBF8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  rankText: { color: "#7C88FF", fontWeight: "800" },
  name: { flex: 1, color: "#2F3B4A", fontWeight: "600" },
  points: { color: "#6B7280", fontWeight: "700" },
  separator: { height: 1, backgroundColor: "#F0F1F5" },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  modalSheet: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 12,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  modalItemText: { fontSize: 16, color: "#111827" },
});

