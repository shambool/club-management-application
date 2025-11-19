// src/api/me.ts
import axios from "axios";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  "http://localhost:5050";

export const meApi = axios.create({
  baseURL: `${BASE_URL}/api/me`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/* ========= Types for /me/user ========= */

export type MeUser = {
  id: number;
  email: string;
  name: string;
  imgurl?: string | null;
};

export type MeUserResponse = {
  user: MeUser;
};

/** GET /api/me/user */
export async function getMeUser(): Promise<MeUser> {
  const { data } = await meApi.get<MeUserResponse>("/user");
  return data.user;
}

/* ========= Types for /me/clubs ========= */

export type MyClubSlim = {
  id: number;
  title: string;
  logourl?: string | null;
  description?: string | null;
  createdat?: string | null;
};

export type MyClubRow = {
  clubid: number;
  joinedat: string;
  status: "active" | "inactive" | string;
  club: MyClubSlim | null;
};

export type MyClubsResponse = {
  items: MyClubRow[];
};

/* ========= Types for /me/events/* ========= */

export type MyEventRow = {
  eventid: number;
  title: string;
  startdate: string; // ISO
  enddate: string;   // ISO
  location?: string | null;
  clubid: number;
};

export type MyEventsResponse = {
  items: MyEventRow[];
};

/* ========= API helpers ========= */

/** GET /api/me/clubs */
export async function getMyClubs(): Promise<MyClubRow[]> {
  const { data } = await meApi.get<MyClubsResponse>("/clubs");
  return data.items;
}

/** GET /api/me/events/attending — upcoming attended events */
export async function getMyUpcomingAttendingEvents(): Promise<MyEventRow[]> {
  const { data } = await meApi.get<MyEventsResponse>("/events/attending");
  return data.items;
}

/** GET /api/me/events/volunteering — upcoming volunteered events */
export async function getMyUpcomingVolunteeringEvents(): Promise<MyEventRow[]> {
  const { data } = await meApi.get<MyEventsResponse>("/events/volunteering");
  return data.items;
}

/** GET /api/me/events/attended — past attended events */
export async function getMyPastAttendedEvents(): Promise<MyEventRow[]> {
  const { data } = await meApi.get<MyEventsResponse>("/events/attended");
  return data.items;
}

/** GET /api/me/events/volunteered — past volunteered events */
export async function getMyPastVolunteeredEvents(): Promise<MyEventRow[]> {
  const { data } = await meApi.get<MyEventsResponse>("/events/volunteered");
  return data.items;
}
