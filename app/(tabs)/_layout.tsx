import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.grey,
        tabBarStyle:{
          backgroundColor: 'black',
          borderTopWidth: 0,
          position: 'absolute',
          elevation: 0,
          height: 40,
          paddingBottom: 8,
        }
      }}
      
    >
      <Tabs.Screen
        name="feed"
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="clubs"
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="beer" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="awards"
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="ribbon" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
