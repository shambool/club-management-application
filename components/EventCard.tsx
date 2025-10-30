import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Event } from "@/types/event";

export default function EventCard({ event }: { event: Event }) {
  const mainDesc = event.description[0];

  return (
    <View style={styles.card}>
      {/* Club Info Section */}
      <View style={styles.clubRow}>
        <Image source={{ uri: event.club.clubLogo?? undefined }} style={styles.clubLogo} />
        <Text style={styles.clubName}>{event.club.clubName}</Text>
        <Text style={styles.separator}>•</Text>
        <Text style={styles.eventTitle}>{event.eventTitle}</Text>
      </View>

      {/* Poster */}
      <Image source={{ uri: event.eventPoster }} style={styles.poster} />

      {/* Action Icons */}
      <View style={styles.actions}>
        <TouchableOpacity>
          <Ionicons name="checkmark-circle-outline" size={22} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="chatbubble-ellipses-outline" size={22} />
        </TouchableOpacity>
        {event.hasVolunteerOption ? (
          <TouchableOpacity>
            <Ionicons name="hand-left-outline" size={22} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 22 }} />
        )}
      </View>
      {/* Description */}
      <View style={styles.desc}>
        <Text>🕒 {mainDesc.time}</Text>
        <Text>📍 {mainDesc.place}</Text>
        <Text>{mainDesc.desc}</Text>
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
  eventTitle: { fontSize: 14, color: "#333" },
  poster: { width: "100%", height: 200, borderRadius: 8, marginBottom: 8 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  desc: { gap: 4, marginBottom: 8 },
  attending: { color: "#444", fontWeight: "500" },
});
