import React from 'react';
import { View, Text, ImageBackground, Image } from 'react-native';
import styles from '../Styles/SplashScreenStyles';

export default function SplashScreen() {
  return (
    <ImageBackground
      source={require('../assets/tea-plantation.jpg')}
      style={styles.background}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/Logo.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>AGROVITAL</Text>
      </View>
      <Text style={styles.subtitle}>EMPOWERING SMART AGRICULTURE...</Text>
    </ImageBackground>
  );
}
