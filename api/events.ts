// src/api/events.ts
import axios from "axios";

/**
 * Configure your API base URL via env:
 *  - Expo: EXPO_PUBLIC_API_BASE_URL
 */
const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:5050";

export const eventsApi = axios.create({
  baseURL: `${BASE_URL}/api/events`,
  withCredentials: true, // send httpOnly auth cookie
  headers: { "Content-Type": "application/json" },
});

/* =========================
   Types aligned to /routes/events.js
   ========================= */

export type ClubSlim = {
  id: number;
  title: string;
  logourl?: string | null;
};

export type EventRow = {
  id: number;
  title: string;
  description?: string | null;
  posterimgurl?: string | null;
  externallink?: string | null;
  location?: string | null;
  startdate: string; // ISO
  enddate: string;   // ISO
  attendee_points: number;
  volunteer_points: number;
  createdat: string; // ISO
  // join alias from supabase select: clubs:clubid(...)
  clubs?: ClubSlim | null;
};

export type EventsListResponse = { items: EventRow[] };
export type EventDetailResponse = { event: EventRow };

type OkResponse = { ok: boolean };

/* =========================
   Core event list/detail
   ========================= */

/** GET /events — list all events (past, present, future), ordered by startdate ASC */
export async function getEvents(): Promise<EventRow[]> {
  const { data } = await eventsApi.get<EventsListResponse>("/");
  return data.items;
}

/** GET /events/:id — single event by id */
export async function getEvent(id: number): Promise<EventRow> {
  const { data } = await eventsApi.get<EventDetailResponse>(`/${id}`);
  return data.event;
}

/** GET /events/upcoming — only upcoming events (server adds club_title/club_logourl) */
export type UpcomingEventRow = EventRow & {
  club_title?: string | null;
  club_logourl?: string | null;
};

export async function getUpcomingEvents(): Promise<UpcomingEventRow[]> {
  const { data } = await eventsApi.get<{ items: UpcomingEventRow[] }>(
    "/upcoming"
  );
  return data.items;
}

/* =========================
   Attendance / volunteering
   ========================= */

/** POST /events/:id/attend — mark current user as attending & award attendee points */
export async function attendEvent(id: number): Promise<OkResponse> {
  const { data } = await eventsApi.post<OkResponse>(`/${id}/attend`);
  return data;
}

/** DELETE /events/:id/attend — cancel attendance & revoke attendee points (future events only) */
export async function unattendEvent(id: number): Promise<OkResponse> {
  const { data } = await eventsApi.delete<OkResponse>(`/${id}/attend`);
  return data;
}

/** POST /events/:id/volunteer — mark current user as volunteering & award volunteer points */
export async function volunteerEvent(id: number): Promise<OkResponse> {
  const { data } = await eventsApi.post<OkResponse>(`/${id}/volunteer`);
  return data;
}

/** DELETE /events/:id/volunteer — cancel volunteering & revoke volunteer points (future events only) */
export async function unvolunteerEvent(id: number): Promise<OkResponse> {
  const { data } = await eventsApi.delete<OkResponse>(`/${id}/volunteer`);
  return data;
}

/* =========================
   Optional helpers
   ========================= */

/** Get events for a specific club (client-side filter over getEvents) */
export async function getEventsByClubId(clubId: number): Promise<EventRow[]> {
  const items = await getEvents();
  return items.filter((e) => e.clubs?.id === clubId);
}

export type EventCard = {
  id: number;
  title: string;
  poster?: string;
  start: string;
  clubTitle?: string | null;
  clubLogo?: string | null;
};

export function toEventCard(e: EventRow | UpcomingEventRow): EventCard {
  return {
    id: e.id,
    title: e.title,
    poster: e.posterimgurl ?? undefined,
    start: e.startdate,
    clubTitle: "club_title" in e ? e.club_title : e.clubs?.title ?? null,
    clubLogo: "club_logourl" in e ? e.club_logourl : e.clubs?.logourl ?? null,
  };
}
