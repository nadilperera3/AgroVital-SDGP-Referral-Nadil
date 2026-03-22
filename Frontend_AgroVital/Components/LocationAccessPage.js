import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import styles from '../Styles/LocationAccessPageStyle';

export default function LocationAccessPage() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false); // Track loading state

  const requestLocationPermission = async () => {
    try {
      setLoading(true); 

      // Request permission to access location
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        // Get the current location
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        console.log('Location:', location);

        // Navigate to next screen with location data
        navigation.navigate('LanguageSelection', {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } else {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to use this feature. Please enable it in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => Location.openSettingsAsync(),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to access location. Please try again.', [
        { text: 'OK' },
      ]);
    } finally {
      setLoading(false); // Stop loading animation
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/tea-plantation-2.jpg')}
        style={styles.backgroundImage}
      />
      
      {/* Overlay */}
      <View style={styles.overlay} />

      <TouchableOpacity 
        onPress={() => navigation.goBack()} 
        style={styles.backArrowContainer}
      >
        <Text style={styles.backButton}>←</Text>
      </TouchableOpacity>

      <Image 
        source={require('../assets/map.png')} 
        style={styles.featureIcon} 
      />

      <Text style={styles.title}>Access to device location</Text>
      <Text style={styles.description}>
        To provide you with localized content, AgroVital needs access to your device's location.
      </Text>

      <TouchableOpacity 
        style={[styles.button, loading && styles.disabledButton]} 
        onPress={requestLocationPermission}
        disabled={loading} // Disable button while loading
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" /> // Show loading animation
        ) : (
          <Text style={styles.buttonText}>Allow</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
