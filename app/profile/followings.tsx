// app/profile/followings.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { getMyClubs, MyClubRow } from "@/api/me";
import { joinClub, leaveClub } from "@/api/members";
import { useAuth } from "@/context/AuthContext";

type FollowingItem = {
  clubId: number;
  name: string;
  logoUrl?: string | null;
  isFollowing: boolean;
};

export default function FollowingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, initializing } = useAuth();

  const [items, setItems] = useState<FollowingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    // 🔒 Don’t hit /api/me/clubs if not logged in
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const rows = await getMyClubs();
      const mapped: FollowingItem[] = rows
        .filter((r) => r.status === "active" && r.club)
        .map((r) => ({
          clubId: r.clubid,
          name: r.club!.title,
          logoUrl: r.club!.logourl ?? null,
          isFollowing: true,
        }));

      setItems(mapped);
    } catch (e: any) {
      console.error("Followings load failed:", e?.message || e);
      if (e?.response?.status === 401) {
        setError("You need to log in to see your followings.");
      } else {
        setError("Failed to load followings.");
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!initializing && user) {
      load();
    }
  }, [initializing, user, load]);

  const followingCount = useMemo(
    () => items.filter((i) => i.isFollowing).length,
    [items]
  );

  const onBack = () =>
    router.canGoBack() ? router.back() : router.replace("/(tabs)/profile");

  const toggleFollow = async (clubId: number) => {
    const current = items.find((i) => i.clubId === clubId);
    if (!current) return;

    const nextIsFollowing = !current.isFollowing;
    setTogglingId(clubId);

    // optimistic UI
    setItems((prev) =>
      prev.map((i) =>
        i.clubId === clubId ? { ...i, isFollowing: nextIsFollowing } : i
      )
    );

    try {
      if (nextIsFollowing) {
        await joinClub(clubId);
      } else {
        await leaveClub(clubId);
      }
    } catch (e: any) {
      console.error("Toggle follow failed:", e?.message || e);
      // rollback if API fails
      setItems((prev) =>
        prev.map((i) =>
          i.clubId === clubId ? { ...i, isFollowing: !nextIsFollowing } : i
        )
      );
    } finally {
      setTogglingId(null);
    }
  };

  // ---------- different high-level states ----------

  if (initializing) {
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

  // If somehow opened without a logged-in user
  if (!user) {
    return (
      <View
        style={[
          styles.container,
          { paddingTop: insets.top + 8, justifyContent: "center" },
        ]}
      >
        <Text style={{ marginBottom: 12, fontSize: 16 }}>
          Please log in to see your followings.
        </Text>
        <Pressable
          onPress={() => router.replace("/login")}
          style={({ pressed }) => [
            styles.loginBtn,
            pressed && { opacity: 0.9 },
          ]}
        >
          <Text style={styles.loginBtnText}>Go to login</Text>
        </Pressable>
      </View>
    );
  }

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

  const renderItem = ({ item }: { item: FollowingItem }) => (
    <View style={styles.clubBlock}>
      <Text style={styles.clubName}>{item.name}</Text>

      <View style={styles.card}>
        {/* Picture area */}
        <View style={styles.cardImage}>
          {item.logoUrl ? (
            <Image
              source={{ uri: item.logoUrl }}
              style={{ width: "100%", height: "100%", borderRadius: 12 }}
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="image-outline" size={28} color="#9CA3AF" />
          )}
        </View>

        {/* Follow / Following pill */}
        <Pressable
          onPress={() => toggleFollow(item.clubId)}
          disabled={togglingId === item.clubId}
          style={({ pressed }) => [
            styles.followChip,
            item.isFollowing ? styles.followingChip : styles.followChipInactive,
            (pressed || togglingId === item.clubId) && { opacity: 0.85 },
          ]}
        >
          <Text style={styles.followChipText}>
            {item.isFollowing ? "Following" : "Follow"}
          </Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      {/* Back arrow */}
      <Pressable
        onPress={onBack}
        style={styles.backBtn}
        hitSlop={10}
        android_ripple={{ color: "#E5E7EB", borderless: true }}
      >
        <Ionicons name="arrow-back" size={24} color="#111827" />
      </Pressable>

      {/* Header text */}
      <Text style={styles.headerText}>
        Followings: <Text style={styles.headerNumber}>{followingCount}</Text>
      </Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={items.filter((i) => i.isFollowing)}
        keyExtractor={(i) => String(i.clubId)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text
            style={{
              textAlign: "center",
              color: "#6B7280",
              marginTop: 24,
            }}
          >
            You don’t follow any clubs yet.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6F8", paddingHorizontal: 16 },

  backBtn: {
    position: "absolute",
    left: 12,
    top: 8,
    padding: 6,
    borderRadius: 999,
  },

  headerText: {
    marginTop: 40,
    fontSize: 22,
    fontWeight: "600",
    color: "#111827",
  },
  headerNumber: { fontWeight: "700" },

  errorText: { color: "#EF4444", marginTop: 6 },

  listContent: { paddingTop: 18, paddingBottom: 24 },

  clubBlock: { marginBottom: 22, alignItems: "center" },

  clubName: {
    fontSize: 19,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 10,
  },

  card: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 14,
    alignItems: "center",
    position: "relative",
  },

  cardImage: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  followChip: {
    position: "absolute",
    top: 18,
    right: 22,
    paddingHorizontal: 16,
    height: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  followingChip: { backgroundColor: "#6B7280" },
  followChipInactive: { backgroundColor: "#111827" },
  followChipText: { color: "#FFFFFF", fontWeight: "600", fontSize: 13 },

  loginBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#111827",
  },
  loginBtnText: { color: "#FFFFFF", fontWeight: "700" },
});
