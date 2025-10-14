import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import IntialLayout from "@/components/IntialLayout";
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@/cache";


const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!publishableKey) {
  throw new Error(
    "Missing publishable key. Set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your environment variables."
  );
}

export default function RootLayout() {
  return (
   <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
     <ClerkLoaded>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
            <IntialLayout/>
          </SafeAreaView>
        </SafeAreaProvider>
     </ClerkLoaded>
   </ClerkProvider>
  
  );
}
