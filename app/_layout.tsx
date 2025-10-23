import React, { useState, useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkLoginStatus = async () => {
      const loggedIn = await AsyncStorage.getItem("isLoggedIn");
      setIsLoggedIn(loggedIn === "true");
    };
    checkLoginStatus();
  }, []);

  if (isLoggedIn === null) {
    // You can return a splash screen or loading spinner here if you want
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9E6" }}>
        <Stack screenOptions={{ headerShown: false }}>
          {!isLoggedIn ? (
            // 👇 Default route if not logged in
            <Stack.Screen name="login" />
          ) : (
            // 👇 Once logged in, go to your tab layout (your main app)
            <Stack.Screen name="(tabs)" />
          )}
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

