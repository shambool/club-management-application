import React, { useMemo } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { mockClubProfiles } from "@/constants/mockClubProfiles";
import { mockEvents } from "@/constants/mockEvents";
import type { Event } from "@/types/event";

const { width } = Dimensions.get("window");
const numColumns = 3;

export default function ClubDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const club = mockClubProfiles.find((c) => c.id === id);

  const clubEvents = useMemo<Event[]>(() => {
    if (!club) return [];
    // Filter only events belonging to this club
    return mockEvents.filter((event) => event.club.id === club.id);
  }, [club]);

  if (!club) {
    return (
      <View style={styles.centered}>
        <Text>Club not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <FlatList
        ListHeaderComponent={
          <>
            {/* Club Image */}
            <Image source={{ uri: club.logo_url }} style={styles.logo} />

            {/* Club Info */}
            <View style={styles.infoCard}>
              <Text style={styles.title}>{club.name}</Text>
              <Text style={styles.description}>{club.description}</Text>

              {/* Extra Club Info */}
              <View style={styles.metaBox}>
                <Text style={styles.meta}>
                  <Text style={styles.metaLabel}>Founded: </Text>
                  {club.created_at || "N/A"}
                </Text>
                <Text style={styles.meta}>
                  <Text style={styles.metaLabel}>Original President: </Text>
                  {club.original_President || "N/A"}
                </Text>
                <Text style={styles.meta}>
                  <Text style={styles.metaLabel}>Current President: </Text>
                  {club.current_President || "N/A"}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Events</Text>
          </>
        }
        data={clubEvents}
        keyExtractor={(item) => item.eventId}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Image source={{ uri: item.eventPoster }} style={styles.eventImage} />
          </View>
        )}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
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
    zIndex: 2,
    backgroundColor: "#f9f9f9",
    padding: 6,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  listContent: { paddingBottom: 100, backgroundColor: "#fff" },
  logo: {
    width: width - 24,
    height: 180,
    borderRadius: 16,
    alignSelf: "center",
    marginTop: 12,
  },
  infoCard: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 12,
    marginTop: 16,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 6 },
  description: { fontSize: 14, color: "#555", lineHeight: 20 },
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
  eventCard: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 10,
    margin: 5,
    backgroundColor: "#f2f2f2",
    overflow: "hidden",
  },
  eventImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
