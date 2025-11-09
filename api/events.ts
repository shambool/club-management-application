// API/events.ts
import axios from "axios";

// =============================
// Event & Club types
// =============================
export type Event = {
  id: string;
  title: string;
  description?: string;
  location?: string;
  start_time?: string;
  end_time?: string;
  requires_volunteers?: boolean;
  image_url?: string;
  created_at: string;
  updated_at: string;
  club_id: string;
  club_name: string;
  club_logo?: string;
};

const BASE_URL = "http://localhost:8080"; // replace with your backend URL

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// =============================
// Get all events
// =============================
export const getAllEvents = async (): Promise<Event[]> => {
  try {
    const response = await api.get("/api/events"); // fetches events with club info via view
    return response.data;
  } catch (error: any) {
    console.error("Error fetching events:", error.response?.data || error.message);
    throw error;
  }
};

// =============================
// Get single event by ID
// =============================
export const getEventById = async (id: string): Promise<Event> => {
  try {
    const response = await api.get(`/api/events/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching event ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// =============================
// Create a new event
// =============================
export const createEvent = async (
  token: string,
  eventData: {
    club_id: string;
    title: string;
    description?: string;
    location?: string;
    start_time?: string;
    end_time?: string;
    requires_volunteers?: boolean;
    image_url?: string;
  }
): Promise<{ event: Event; qr?: string }> => {
  try {
    const response = await api.post("/api/events", eventData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error creating event:", error.response?.data || error.message);
    throw error;
  }
};

// =============================
// Update an event
// =============================
export const updateEvent = async (
  token: string,
  id: string,
  eventData: {
    title?: string;
    description?: string;
    location?: string;
    start_time?: string;
    end_time?: string;
    requires_volunteers?: boolean;
    image_url?: string;
  }
): Promise<Event> => {
  try {
    const response = await api.put(`/api/events/${id}`, eventData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(`Error updating event ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// =============================
// Delete an event
// =============================
export const deleteEvent = async (token: string, id: string): Promise<{ message: string; event: Event }> => {
  try {
    const response = await api.delete(`/api/events/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(`Error deleting event ${id}:`, error.response?.data || error.message);
    throw error;
  }
};
