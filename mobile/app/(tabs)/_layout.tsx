import { Tabs } from "expo-router";
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AppHeader } from "@/components/app-header";

const CheckInTabButton = ({ children, onPress }: any) => (
  <TouchableOpacity style={styles.checkInButtonContainer} onPress={onPress}>
    <View style={styles.checkInButton}>{children}</View>
  </TouchableOpacity>
);

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.root}>
      <AppHeader />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#059669",
          tabBarInactiveTintColor: "#6B7280",
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            height: 80,
            paddingBottom: 20,
            paddingTop: 10,
            backgroundColor: colorScheme === "dark" ? "#1F2937" : "#FFFFFF",
            borderTopWidth: 1,
            borderTopColor: colorScheme === "dark" ? "#374151" : "#E5E7EB",
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <IconSymbol
                size={24}
                name="house.fill"
                color={focused ? "#059669" : color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="events"
          options={{
            title: "Events",
            tabBarIcon: ({ color, focused }) => (
              <IconSymbol
                size={24}
                name="calendar.badge.plus"
                color={focused ? "#059669" : color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="check-in"
          options={{
            title: "Check-In",
            tabBarButton: (props) => (
              <CheckInTabButton {...props}>
                <IconSymbol size={35} name="qrcode" color="#FFFFFF" />
              </CheckInTabButton>
            ),
            tabBarIcon: () => (
              <IconSymbol size={32} name="qrcode" color="#FFFFFF" />
            ),
          }}
        />
        <Tabs.Screen
          name="schedule"
          options={{
            title: "Schedule",
            tabBarIcon: ({ color, focused }) => (
              <IconSymbol
                size={24}
                name="calendar"
                color={focused ? "#059669" : color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="alerts"
          options={{
            title: "Alerts",
            tabBarIcon: ({ color, focused }) => (
              <IconSymbol
                size={24}
                name="bell.fill"
                color={focused ? "#059669" : color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  checkInButtonContainer: {
    top: -20,
    justifyContent: "center",
    alignItems: "center",
  },
  checkInButton: {
    width: 65,
    height: 65,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: "#FFFFFF",
    backgroundColor: "#059669",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#059669",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.7,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
