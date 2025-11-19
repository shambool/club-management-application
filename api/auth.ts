// src/api/auth.ts
import axios from "axios";

/**
 * Same BASE_URL pattern you used in api/clubs.ts & api/events.ts
 * Make sure EXPO_PUBLIC_API_BASE_URL points to e.g. "http://192.168.x.x:5050"
 */
const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||

  "http://localhost:5050";

export const authApi = axios.create({
  baseURL: `${BASE_URL}/api/auth`,
  withCredentials: true, // ⬅️ so the httpOnly "token" cookie is sent
  headers: { "Content-Type": "application/json" },
});

/* -------------------------- Types -------------------------- */

export type AuthUser = {
  id: number;
  email: string;
  name: string;
};

export type AuthResponse = {
  user: AuthUser;
};

/* ------------------------ API calls ------------------------ */

/** POST /api/auth/register */
export async function registerUser(payload: {
  email: string;
  name: string;
  password: string;
}): Promise<AuthUser> {
  const { data } = await authApi.post<AuthResponse>("/register", payload);
  // backend sets httpOnly cookie; we just return the user
  return data.user;
}

/** POST /api/auth/login */
export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<AuthUser> {
  const { data } = await authApi.post<AuthResponse>("/login", payload);
  return data.user;
}

/** POST /api/auth/logout */
export async function logoutUser(): Promise<{ ok: boolean }> {
  const { data } = await authApi.post<{ ok: boolean }>("/logout");
  return data;
}
