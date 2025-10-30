// API/clubs.ts
import axios from "axios";

export type Club = {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  slug?: string;
};

const BASE_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Get all clubs
export const getAllClubs = async (): Promise<Club[]> => {
  try {
    const response = await api.get("/api/clubs");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching clubs:", error.response?.data || error.message);
    throw error;
  }
};

// Get single club by ID
export const getClubById = async (id: string): Promise<Club> => {
  try {
    const response = await api.get(`/api/clubs/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching club ${id}:`, error.response?.data || error.message);
    throw error;
  }
};
export const createClub = async (
  token: string, // your auth token if required
  clubData: { name: string; description?: string; logo_url?: string; slug?: string }
) => {
  try {
    const response = await api.post("/api/clubs", clubData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error creating club:", error.response?.data || error.message);
    throw error;
  }
};

// =============================
// Update club (creator only)
// =============================
export const updateClub = async (
  token: string,
  id: string,
  clubData: { name?: string; description?: string; logo_url?: string }
) => {
  try {
    const response = await api.put(`/clubs/${id}`, clubData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error updating club:", error.response?.data || error.message);
    throw error;
  }
};
