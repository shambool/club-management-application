// src/api/clubs.ts
import axios from "axios";

/**
 * Configure your API base URL via env:
 *   - Expo: EXPO_PUBLIC_API_BASE_URL
 *   - Vite/Next: VITE_API_BASE_URL / NEXT_PUBLIC_API_BASE_URL
 */
const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  "http://localhost:5050"; // fallback for local dev

export const api = axios.create({
  baseURL: `${BASE_URL}/api/clubs`,
  withCredentials: true, // keep cookies/session for auth-protected routes
  headers: { "Content-Type": "application/json" },
});

/* =========================
   Types aligned to your schema
   ========================= */

export type Club = {
  id: number;
  title: string;
  logourl?: string | null;
  description?: string | null;
  createdat: string; // ISO timestamp
};

export type ClubDetail = Club & {
  originalpresident?: number | null;
};

export type EventRow = {
  id: number;
  clubid: number;
  title: string;
  description?: string | null;
  posterimgurl?: string | null;
  externallink?: string | null;
  startdate: string; // ISO
  enddate: string; // ISO
  location?: string | null;
  attendee_points: number;   // matches column name
  volunteer_points: number;  // matches column name
  createdat: string;         // ISO
};

export type Paginated<T> = {
  items: T[];
  limit: number;
  offset: number;
};

/* =========================
   API calls (match your Express routes)
   GET /clubs?limit&offset
   GET /clubs/:id
   GET /clubs/:id/events
   POST /clubs/:id/join
   ========================= */

/** Fetch paginated clubs (sorted by title ASC on server). */
export async function getClubs(params?: {
  limit?: number;
  offset?: number;
}): Promise<Paginated<Club>> {
  const { limit = 20, offset = 0 } = params ?? {};
  const { data } = await api.get<Paginated<Club>>("/", {
    params: { limit, offset },
  });
  return data;
}

/** Fetch one club by id. */
export async function getClub(id: number): Promise<ClubDetail> {
  const { data } = await api.get<{ club: ClubDetail }>(`/${id}`);
  return data.club;
}

/** Fetch events for a club (newest first by startdate). */
export async function getClubEvents(id: number): Promise<EventRow[]> {
  const { data } = await api.get<{ items: EventRow[] }>(`/${id}/events`);
  return data.items;
}

/**
 * Join a club for the current (authenticated) user.
 * Server returns: { ok: true, memberid }
 */
export async function joinClub(id: number): Promise<{ ok: boolean; memberid: number }> {
  const { data } = await api.post<{ ok: boolean; memberid: number }>(`/${id}/join`);
  return data;
}

/* =========================
   Optional helpers
   ========================= */

/** Convenience method to page through all clubs (client-side) */
export async function getAllClubs(max = 500): Promise<Club[]> {
  const pageSize = 100;
  const results: Club[] = [];
  for (let offset = 0; offset < max; offset += pageSize) {
    const { items } = await getClubs({ limit: pageSize, offset });
    results.push(...items);
    if (items.length < pageSize) break;
  }
  return results;
}
