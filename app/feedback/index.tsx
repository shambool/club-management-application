import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Tile = {
  key: string;
  label: string;
  iconLib: "ion" | "mci";
  iconName: string;
  tint: string;
  chipBg: string;
  onPress: () => void;
};

export default function FeedbackScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { clubId } = useLocalSearchParams<{ clubId?: string }>();

  const tiles: Tile[] = [
    {
      key: "events",
      label: "Event feedback",
      iconLib: "mci",
      iconName: "calendar-star",
      tint: "#4F63F6",
      chipBg: "#EEF0FF",
      onPress: () => router.push(`/feedback/event?clubId=${clubId ?? ""}`),
    },
    {
      key: "club",
      label: "Club feedback",
      iconLib: "ion",
      iconName: "school-outline",
      tint: "#22A699",
      chipBg: "#EAF7F5",
      onPress: () => router.push(`/feedback/club?clubId=${clubId ?? ""}`),
    },
    {
      key: "leaders",
      label: "Organizers / leaders",
      iconLib: "mci",
      iconName: "account-group-outline",
      tint: "#FF8A00",
      chipBg: "#FFF3E6",
      onPress: () => router.push(`/feedback/leaders?clubId=${clubId ?? ""}`),
    },
    {
      key: "other",
      label: "Suggestions / other",
      iconLib: "ion",
      iconName: "bulb-outline",
      tint: "#8A5BF5",
      chipBg: "#F2ECFF",
      onPress: () => router.push(`/feedback/suggestion?clubId=${clubId ?? ""}`),
    },
  ];

  const onBack = () => (router.canGoBack() ? router.back() : router.replace("/"));

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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 56, // ⬇️ now starts lower (like other screens)
            paddingBottom: Math.max(insets.bottom, 12) + 12,
          },
        ]}
      >
        {/* Header */}
        <Text style={styles.title}>Feedback</Text>
        <Text style={styles.subtitle}>Select a category</Text>

        {/* Cards */}
        <View style={styles.tilesWrap}>
          {tiles.map((t) => (
            <Pressable
              key={t.key}
              onPress={t.onPress}
              style={({ pressed }) => [
                styles.tileCard,
                pressed && styles.tilePressed,
              ]}
              android_ripple={{ color: "#E9E9EE" }}
            >
              <View style={styles.heroFrame}>
                <View style={[styles.iconChip, { backgroundColor: t.chipBg }]}>
                  {t.iconLib === "mci" ? (
                    <MaterialCommunityIcons
                      name={t.iconName as any}
                      size={34}
                      color={t.tint}
                    />
                  ) : (
                    <Ionicons name={t.iconName as any} size={34} color={t.tint} />
                  )}
                </View>
              </View>
              <Text numberOfLines={1} style={styles.tileLabel}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

/* ------------------------------ styles ------------------------------ */

const shadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
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
    paddingHorizontal: 18,
    alignItems: "center",
    gap: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
    marginBottom: 6, // tighter
  },
  subtitle: {
    fontSize: 18,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 14,
  },

  tilesWrap: {
    width: "100%",
    maxWidth: 560,
    gap: 14,
  },

  tileCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E7E8EF",
    padding: 12,
    ...shadow,
  },
  tilePressed: { opacity: 0.95 },

  heroFrame: {
    height: 110, // ⬇️ slightly shorter
    borderRadius: 12,
    backgroundColor: "#F8F9FC",
    alignItems: "center",
    justifyContent: "center",
  },

  iconChip: {
    width: 62,
    height: 62,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  tileLabel: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginTop: 10,
  },
});
