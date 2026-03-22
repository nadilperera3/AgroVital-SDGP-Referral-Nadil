import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./Components/AppNavigator";
import { AuthProvider } from "./Components/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}