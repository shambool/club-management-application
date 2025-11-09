import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Event } from "@/types/event";

export default function EventCard({ event }: { event: Event }) {
  return (
    <View style={styles.card}>
      {/* Club Info Section */}
      <View style={styles.clubRow}>
        {event.club.logo_url ? (
          <Image source={{ uri: event.club.logo_url }} style={styles.clubLogo} />
        ) : (
          <View style={[styles.clubLogo, { backgroundColor: "#eee" }]} />
        )}
        <Text style={styles.clubName}>{event.club.name}</Text>
        <Text style={styles.separator}>•</Text>
        <Text style={styles.eventTitle}>{event.eventTitle}</Text>
      </View>

      {/* Poster */}
      {event.eventPoster ? (
        <Image source={{ uri: event.eventPoster }} style={styles.poster} />
      ) : null}

      {/* Action Icons */}
      <View style={styles.actions}>
        <TouchableOpacity>
          <Ionicons name="checkmark-circle-outline" size={22} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="chatbubble-ellipses-outline" size={22} color="#333" />
        </TouchableOpacity>
        {event.hasVolunteerOption ? (
          <TouchableOpacity>
            <Ionicons name="hand-left-outline" size={22} color="#333" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 22 }} />
        )}
      </View>

      {/* Description */}
      <View style={styles.desc}>
        <Text>🕒 {event.startDate} ({event.duration})</Text>
        <Text>📍 {event.place}</Text>
        <Text>{event.desc}</Text>
      </View>

      <Text style={styles.attending}>👥 {event.attending} attending</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  clubRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  clubLogo: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  clubName: { fontWeight: "bold", fontSize: 14 },
  separator: { marginHorizontal: 6, color: "#999" },
  eventTitle: { fontSize: 14, color: "#333", flexShrink: 1 },
  poster: { width: "100%", height: 200, borderRadius: 8, marginBottom: 8 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  desc: { gap: 4, marginBottom: 8 },
  attending: { color: "#444", fontWeight: "500" },
});
