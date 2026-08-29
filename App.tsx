import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import BottomNavigator from "./src/navigation/BottomNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <BottomNavigator />
    </NavigationContainer>
  );
}