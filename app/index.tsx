// app/index.tsx
import React from "react";
import { Redirect } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const { user, initializing } = useAuth();

  // Show nothing until we know if user is logged in
  if (initializing) return null;

  // If logged in → go to tabs
  if (user) return <Redirect href="/(tabs)/feed" />;

  // If not logged in → go to login
  return <Redirect href="/login" />;
}
