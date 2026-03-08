import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView,ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../Styles/SoilMonitoringStyles';

const SoilMonitoringInstructions = () => {
  const navigation = useNavigation();

  const images = {
    step1: require('../assets/npk-sensor.jpg'),
    step2: require('../assets/bluetooth-wifi.jpg'),
    step3: require('../assets/soil-reading.jpg'),
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrowContainer}>
        <Text style={styles.backButton}>←</Text>
      </TouchableOpacity>
        <Text style={styles.headerTitle}>Soil Monitoring</Text>
      </View>

      <ScrollView style={styles.scrollContent}>
        {/* Page Background Image */}
        <ImageBackground
        source={require('../assets/tea-plantation-2.jpg')}
        style={styles.backgroundImage}
        />
        <View style={styles.overlays} />
        <View style={styles.contentContainer}>
          {/* Step 1 Card */}
          <View style={styles.stepCard}>
            <Image source={images.step1} style={styles.stepImage} />
            <View style={styles.stepInfo}>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={14} color="#FFC107" />
                <Text style={styles.stepNumber}>Step 1</Text>
              </View>
              <Text style={styles.stepTitle}>Connect the NPK Sensor</Text>
              <Text style={styles.stepDescription}>
                Place the NPK sensor in the soil at the desired depth. Ensure the sensor is properly connected to the power source.
              </Text>
            </View>
          </View>

          {/* Step 2 Card */}
          <View style={styles.stepCard}>
            <Image source={images.step2} style={styles.stepImage} />
            <View style={styles.stepInfo}>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={14} color="#FFC107" />
                <Text style={styles.stepNumber}>Step 2</Text>
              </View>
              <Text style={styles.stepTitle}>Connect to Wi-Fi/Bluetooth</Text>
              <Text style={styles.stepDescription}>
                Connect the NPK sensor to the app via Wi-Fi or Bluetooth. Make sure the sensor is within range of your device.
              </Text>
            </View>
          </View>

          {/* Step 3 Card */}
          <View style={styles.stepCard}>
            <Image source={images.step3} style={styles.stepImage} />
            <View style={styles.stepInfo}>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={14} color="#FFC107" />
                <Text style={styles.stepNumber}>Step 3</Text>
              </View>
              <Text style={styles.stepTitle}>Monitor Soil Data</Text>
              <Text style={styles.stepDescription}>
                Once connected, real-time data will be available showing soil moisture, pH, and NPK levels.
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => navigation.navigate('SoilDataDisplay')}
            >
              <Text style={styles.primaryButtonText}>Proceed to Live Data</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Icon name="sprout" size={24} color="#444" />
          <Text style={styles.navText}>Crop</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('MainCommunityScreen')}>
          <Icon name="account-group" size={24} color="#444" />
          <Text style={styles.navText}>Community</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.navItem]} onPress={() => navigation.navigate('MarketPlace')}>
          <Icon name="store" size={24} color="#444" />
          <Text style={[styles.navText]}>Shop</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ProfileSave')}>
          <Icon name="account" size={24} color="#444" />
          <Text style={styles.navText}>You</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SoilMonitoringInstructions;