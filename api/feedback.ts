// src/api/feedback.ts
import axios from "axios";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  "http://localhost:5050";

export const feedbackApi = axios.create({
  baseURL: `${BASE_URL}/api/feedback`,
  withCredentials: true, // needed so cookies/session are sent
  headers: { "Content-Type": "application/json" },
});

/** Categories allowed by your DB CHECK constraint */
export type FeedbackCategory =
  | "Event"
  | "Club"
  | "Event Management"
  | "Club Member"
  | "Suggestions"
  | "Other";

/** Payload your backend expects (see routes/feedback.js `expect([...])`) */
export type CreateFeedbackBody = {
  clubid: number;              // required
  category: FeedbackCategory;  // required
  rating: number | null;       // send null when not using stars
  message: string | null;      // free text (can be null)
};

export type CreateFeedbackResponse = { ok: true; id: number };

/** POST /feedback — creates a feedback row */
export async function createFeedback(
  body: CreateFeedbackBody
): Promise<CreateFeedbackResponse> {
  const { data } = await feedbackApi.post<CreateFeedbackResponse>("/", body);
  return data;
}

/* ---------- convenience wrappers (optional) ---------- */

export async function createEventFeedback(params: {
  clubid: number;
  rating: number | null; // 1..5 or null
  message: string | null;
}) {
  return createFeedback({
    clubid: params.clubid,
    category: "Event",
    rating: params.rating,
    message: params.message,
  });
}

export async function createClubFeedback(params: {
  clubid: number;
  message: string | null;
}) {
  return createFeedback({
    clubid: params.clubid,
    category: "Club",
    rating: null,
    message: params.message,
  });
}

export async function createLeadersFeedback(params: {
  clubid: number;
  message: string | null;
}) {
  return createFeedback({
    clubid: params.clubid,
    category: "Club Member", // or "Event Management" depending on your UX
    rating: null,
    message: params.message,
  });
}

export async function createSuggestion(params: {
  clubid: number;
  message: string | null;
}) {
  return createFeedback({
    clubid: params.clubid,
    category: "Suggestions",
    rating: null,
    message: params.message,
  });
}
