// app/_layout.tsx
import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import { AuthProvider, useAuth } from "@/context/AuthContext";

function RootNavigator() {
  const { user, initializing } = useAuth();

  // While we’re checking /api/me/user for an existing session
  if (initializing) {
    // You can return a splash / loader instead of null if you want
    return null;
  }

  const isLoggedIn = !!user;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9E6" }}>
      <Stack screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          // 👇 When NOT logged in, show only login stack
          <Stack.Screen name="login" />
        ) : (
          // 👇 When logged in, show your tabs layout
          <Stack.Screen name="(tabs)" />
        )}
      </Stack>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </AuthProvider>
  );
}
