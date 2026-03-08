import React from 'react';
import { View, Text, ImageBackground, Image, TouchableOpacity } from 'react-native';
import styles from '../../Styles/DescriptionPageStyles';

export default function Page1({ navigation }) {
  return (
    <ImageBackground
      source={require('../../assets/tea-plantation-2.jpg')}
      style={styles.background}
    >
    <View style={styles.overlays} />

      {/* Back Arrow */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrowContainer}>
        <Text style={styles.backButton}>←</Text>
      </TouchableOpacity>
      
      <Text style={styles.welcomeText}>WELCOME</Text>
      <View style={styles.featureContainer}>
        <Image
          source={require('../../assets/community.png')}
          style={styles.featureIcon}
        />
        <Text style={styles.featureText}>Community Forum</Text>
      </View>
      <View style={styles.navigationButtons}>
        <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('LocationAccessPage')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('LocationAccessPage')}>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
