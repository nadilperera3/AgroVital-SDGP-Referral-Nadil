import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './Components/AppNavigator';
import SplashScreen from './Components/SplashScreen';
import { AuthProvider } from './Components/AuthContext';

import { StatusBar } from 'expo-status-bar'; 

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000); // Transition after 4 seconds
    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer>
          {showSplash ? <SplashScreen /> : <AppNavigator />}
        </NavigationContainer>
      </AuthProvider>
    </View>
  );
}