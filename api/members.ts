// src/api/members.ts
import axios from "axios";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  "http://localhost:5050";

export const membersApi = axios.create({
  baseURL: `${BASE_URL}/api/members`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/* ------------ Types (shape matches your backend responses) ------------ */

export type MemberRow = {
  memberid: number;
  userid: number;
  clubid: number;
  joinedat: string;
  membershipstatus: "active" | "inactive" | string;
  name: string | null;
  email: string | null;
  imgurl: string | null;
};

export type MembersResponse = {
  items: MemberRow[];
};

/* --------------------------- Read helpers --------------------------- */

/** GET /api/members — all memberships (mostly admin/debug) */
export async function getAllMembers(): Promise<MemberRow[]> {
  const { data } = await membersApi.get<MembersResponse>("/");
  return data.items;
}

/** GET /api/members/club/:clubId — members for a specific club */
export async function getMembersForClub(clubId: number): Promise<MemberRow[]> {
  const { data } = await membersApi.get<MembersResponse>(`/club/${clubId}`);
  return data.items;
}

/* --------------------- Follow / Unfollow helpers --------------------- */

/** POST /api/members/join — follow a club */
export async function joinClub(clubId: number): Promise<{ ok: boolean }> {
  const { data } = await membersApi.post<{ ok: boolean }>("/join", {
    clubid: clubId,
  });
  return data;
}

/** POST /api/members/leave — unfollow a club */
export async function leaveClub(clubId: number): Promise<{ ok: boolean }> {
  const { data } = await membersApi.post<{ ok: boolean }>("/leave", {
    clubid: clubId,
  });
  return data;
}
