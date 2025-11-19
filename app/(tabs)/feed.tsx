// app/(tabs)/feed.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";

import Header from "@/components/Header";
import EventCard from "@/components/EventCard";

import {
  getEvents,
  type EventRow,
  attendEvent,
  unattendEvent,
  volunteerEvent,
  unvolunteerEvent,
} from "@/api/events";
import type { Event } from "@/types/event";
import type { ClubProfile } from "@/types/clubProfile";

import {
  getMyUpcomingAttendingEvents,
  getMyUpcomingVolunteeringEvents,
} from "@/api/me";
import { useAuth } from "@/context/AuthContext";

/* ---------- helpers ---------- */

function humanDuration(startISO: string, endISO: string): string {
  try {
    const start = new Date(startISO).getTime();
    const end = new Date(endISO).getTime();
    const mins = Math.max(0, Math.round((end - start) / 60000));
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m ? `${h}h ${m}m` : `${h} hours`;
  } catch {
    return "";
  }
}

// Map backend EventRow -> your UI Event type (used by <EventCard />)
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

  return {
    eventId: String(row.id),
    eventTitle: row.title,
    eventPoster: row.posterimgurl ?? "",
    attending: 0, // generic count, not per-user
    hasVolunteerOption: (row.volunteer_points ?? 0) > 0,
    startDate: row.startdate,
    duration: humanDuration(row.startdate, row.enddate),
    place: row.location ?? "",
    desc: row.description ?? "",
    club,
    externalLink: row.externallink ?? "",
    Attendee_points: row.attendee_points ?? 0,
    Volunteer_points: row.volunteer_points ?? 0,
    createdAt: row.createdat ?? row.startdate,
  };
}

/* ---------- main component ---------- */

export default function Feed() {
  const [items, setItems] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // per-user state (which events THIS user is attending/volunteering)
  const [attendingIds, setAttendingIds] = useState<Set<string>>(new Set());
  const [volunteeringIds, setVolunteeringIds] = useState<Set<string>>(
    new Set()
  );

  const { user } = useAuth();
  const router = useRouter();

  const load = useCallback(async () => {
    try {
      setError(null);

      // 1) all events
      const eventsPromise = getEvents();

      // 2) if logged in, also load this user's upcoming participation
      const attendingPromise = user
        ? getMyUpcomingAttendingEvents()
        : Promise.resolve([]);
      const volunteeringPromise = user
        ? getMyUpcomingVolunteeringEvents()
        : Promise.resolve([]);

      const [rows, myAttending, myVolunteering] = await Promise.all([
        eventsPromise,
        attendingPromise,
        volunteeringPromise,
      ]);

      const mapped = rows.map(mapEventRowToEvent);

      // newest first in feed
      mapped.sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
      setItems(mapped);

      if (user) {
        setAttendingIds(new Set(myAttending.map((e) => String(e.eventid))));
        setVolunteeringIds(
          new Set(myVolunteering.map((e) => String(e.eventid)))
        );
      } else {
        setAttendingIds(new Set());
        setVolunteeringIds(new Set());
      }
    } catch (e: any) {
      console.error("Failed to fetch events", e?.message || e);
      setError("Failed to fetch events.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  /* ----- handlers for the two icons ----- */

  const handleToggleAttend = async (event: Event) => {
    if (!user) {
      router.push("/login");
      return;
    }

    const id = event.eventId;
    const isAttending = attendingIds.has(id);

    // optimistic toggle
    setAttendingIds((prev) => {
      const next = new Set(prev);
      if (isAttending) next.delete(id);
      else next.add(id);
      return next;
    });

    try {
      if (isAttending) {
        await unattendEvent(Number(id)); // DELETE /events/:id/attend
      } else {
        await attendEvent(Number(id)); // POST /events/:id/attend
      }
    } catch (err) {
      console.error("toggle attend failed", err);
      // rollback
      setAttendingIds((prev) => {
        const next = new Set(prev);
        if (isAttending) next.add(id);
        else next.delete(id);
        return next;
      });
    }
  };

  const handleToggleVolunteer = async (event: Event) => {
    if (!user) {
      router.push("/login");
      return;
    }

    const id = event.eventId;
    const isVolunteering = volunteeringIds.has(id);

    // optimistic toggle
    setVolunteeringIds((prev) => {
      const next = new Set(prev);
      if (isVolunteering) next.delete(id);
      else next.add(id);
      return next;
    });

    try {
      if (isVolunteering) {
        await unvolunteerEvent(Number(id)); // DELETE /events/:id/volunteer
      } else {
        await volunteerEvent(Number(id)); // POST /events/:id/volunteer
      }
    } catch (err) {
      console.error("toggle volunteer failed", err);
      // rollback
      setVolunteeringIds((prev) => {
        const next = new Set(prev);
        if (isVolunteering) next.add(id);
        else next.delete(id);
        return next;
      });
    }
  };

  const renderEvent = ({ item }: { item: Event }) => (
    <EventCard
      event={item}
      isAttending={attendingIds.has(item.eventId)}
      isVolunteering={volunteeringIds.has(item.eventId)}
      onToggleAttend={() => handleToggleAttend(item)}
      onToggleVolunteer={() => handleToggleVolunteer(item)}
    />
  );

  return (
    <View style={styles.container}>
      <Header />

      {error ? (
        <Text style={{ color: "red", marginVertical: 8 }}>{error}</Text>
      ) : null}

      {loading ? (
        <Text style={{ marginTop: 12 }}>Loading events…</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.eventId}
          renderItem={renderEvent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={<Text>No events yet.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  listContent: {
    paddingBottom: 80,
  },
});
