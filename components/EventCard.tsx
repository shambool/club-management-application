// src/components/EventCard.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Event } from "@/types/event";

type EventCardProps = {
  event: Event;

  // NEW: user-specific state from Feed
  isAttending?: boolean;
  isVolunteering?: boolean;
  onToggleAttend?: () => void | Promise<void>;
  onToggleVolunteer?: () => void | Promise<void>;
};

export default function EventCard({
  event,
  isAttending = false,
  isVolunteering = false,
  onToggleAttend,
  onToggleVolunteer,
}: EventCardProps) {
  const handleAttendPress = () => {
    if (onToggleAttend) onToggleAttend();
  };

  const handleVolunteerPress = () => {
    if (onToggleVolunteer) onToggleVolunteer();
  };

  return (
    <View style={styles.card}>
      {/* header: avatar + club name etc. */}
      <View style={styles.headerRow}>
        <Image
          source={{ uri: event.club.logo_url || "https://via.placeholder.com/40" }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.clubName}>{event.club.name}</Text>
          {/* you can add subtitle here if you want */}
        </View>

        {/* bookmark or whatever you already had on the right */}
      </View>

      {/* poster */}
      <Image
        source={{ uri: event.eventPoster || "https://via.placeholder.com/400x250" }}
        style={styles.poster}
      />

      {/* row of 3 icons under poster */}
      <View style={styles.iconRow}>
        {/* ✅ attend icon */}
        <Pressable
          onPress={handleAttendPress}
          hitSlop={10}
          style={styles.iconButton}
        >
          <Ionicons
            name={isAttending ? "checkmark-circle" : "checkmark-circle-outline"}
            size={26}
            color={isAttending ? "#16A34A" : "#6B7280"}
          />
        </Pressable>

        {/* 💬 middle icon (unchanged / display only) */}
        <View style={styles.iconButton}>
          <Ionicons name="chatbubble-ellipses-outline" size={26} color="#6B7280" />
        </View>

        {/* ✋ volunteer icon */}
        <Pressable
          onPress={handleVolunteerPress}
          hitSlop={10}
          style={styles.iconButton}
        >
          <Ionicons
            name={isVolunteering ? "hand-left" : "hand-left-outline"}
            size={26}
            color={isVolunteering ? "#0EA5E9" : "#6B7280"}
          />
        </Pressable>
      </View>

      {/* the rest of your card: time, location, description, etc. */}
      <View style={styles.infoBlock}>
        <Text style={styles.timeText}>
          {/* just an example – keep whatever you had */}
          {event.startDate} ({event.duration})
        </Text>
        <Text style={styles.locationText}>📍 {event.place}</Text>
        <Text style={styles.desc}>{event.desc}</Text>
        {/* attendees count etc. */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  clubName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  poster: {
    width: "100%",
    height: 220,
    borderRadius: 14,
    marginVertical: 8,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 8,
  },
  iconButton: {
    padding: 4,
  },
  infoBlock: {
    marginTop: 4,
  },
  timeText: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 2,
  },
  locationText: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 4,
  },
  desc: {
    fontSize: 14,
    color: "#374151",
  },
});
