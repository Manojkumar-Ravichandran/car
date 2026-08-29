import React from "react";

import {
  createBottomTabNavigator
} from "@react-navigation/bottom-tabs";

import {
  Ionicons
} from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import ScannerScreen from "../screens/ScannerScreen";
import HistoryScreen from "../screens/HistoryScreen";

import { COLORS } from "../constants/colors";

const Tab =
  createBottomTabNavigator();

export default function BottomNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor:
          COLORS.primary,

        tabBarInactiveTintColor:
          COLORS.gray,

        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 8
        },

        tabBarIcon: ({
          color,
          size,
          focused
        }) => {

          let iconName: any;

          if (route.name === "Home") {
            iconName = focused
              ? "home"
              : "home-outline";
          }

          if (route.name === "Scanner") {
            iconName = focused
              ? "scan"
              : "scan-outline";
          }

          if (route.name === "History") {
            iconName = focused
              ? "time"
              : "time-outline";
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        }
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />

      <Tab.Screen
        name="Scanner"
        component={ScannerScreen}
      />

      <Tab.Screen
        name="History"
        component={HistoryScreen}
      />
    </Tab.Navigator>
  );
}