import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import BottomNavigator from "./src/navigation/BottomNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <BottomNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}