import React from "react";
<<<<<<< HEAD
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
=======
import SoilDataDisplay from "./Components/SoilDataDisplay";

export default function App() {
  return <SoilDataDisplay />;
>>>>>>> bc75120283872f05d4cdfd426d5bf8627f29f28b
}