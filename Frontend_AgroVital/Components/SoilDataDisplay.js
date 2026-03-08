import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  Image, 
  Dimensions,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart } from 'react-native-chart-kit';  
import styles from '../Styles/SoilDataStyles';
import BluetoothConnection from './BluetoothConnection';
import bluetoothService from './BluetoothService';
import firebaseService from './FirebaseService';
import auth from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const { width } = Dimensions.get('window');

const SoilDataDisplay = () => {
  const navigation = useNavigation();
  

  const [soilData, setSoilData] = useState({
    moisture: 0,
    pH: 0,
    nitrogen: 0,
    phosphorus: 0,
    potassium: 0,
  });
  
  // Historical data for chart
  const [historyData, setHistoryData] = useState({
    moisture: [0, 0, 0, 0, 0],
    timestamps: ['0s', '0s', '0s', '0s', '0s']
  });
  
  // Recommendations state
  const [recommendations, setRecommendations] = useState(null);
  
  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        console.log('User authenticated:', user.uid);
        // Load any previous data
        loadRecentData();
      } else {
        console.log('User not authenticated');
      }
    });
    
    // Cleanup subscription
    return () => unsubscribe();
  }, []);
  
  // Load recent data from Firebase
  const loadRecentData = async () => {
    try {
      const recentReadings = await firebaseService.getRecentReadings(1);
      if (recentReadings.length > 0) {
        const lastReading = recentReadings[0];
        setSoilData({
          moisture: lastReading.moisture || 0,
          pH: lastReading.pH || 0,
          nitrogen: lastReading.nitrogen || 0,
          phosphorus: lastReading.phosphorus || 0,
          potassium: lastReading.potassium || 0,
        });
        
        // Generate recommendations
        const newRecommendations = firebaseService.getNutrientRecommendations(lastReading);
        setRecommendations(newRecommendations);
      }
    } catch (error) {
      console.error('Error loading recent data:', error);
    }
  };
  
  // Handle Bluetooth connection status
  const handleConnectionChange = (connected, deviceName = null) => {
    setIsConnected(connected);
    setConnectedDevice(deviceName);
    
    if (connected) {
      Alert.alert('Connected', `Successfully connected to ${deviceName}`);
    } else {
      Alert.alert('Disconnected', 'Device disconnected');
    }
  };
  
  // Process incoming sensor data
  const processSensorData = useCallback((rawData) => {
    const parsedData = bluetoothService.parseSensorData(rawData);
    
    // Update soil data state
    setSoilData(prev => {
      // Only update if we have valid data (to prevent zeros)
      const newData = {};
      
      if (parsedData.moisture > 0) newData.moisture = parsedData.moisture;
      if (parsedData.pH > 0) newData.pH = parsedData.pH;
      if (parsedData.nitrogen > 0) newData.nitrogen = parsedData.nitrogen;
      if (parsedData.phosphorus > 0) newData.phosphorus = parsedData.phosphorus;
      if (parsedData.potassium > 0) newData.potassium = parsedData.potassium;
      
      return { ...prev, ...newData };
    });
    
    // Update history data for chart (only if moisture value was updated)
    if (parsedData.moisture > 0) {
      setHistoryData(prev => {
        const now = new Date();
        const timeLabel = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
        
        return {
          moisture: [...prev.moisture.slice(1), parsedData.moisture],
          timestamps: [...prev.timestamps.slice(1), timeLabel]
        };
      });
    }
    
    // Save to Firebase if we have valid data and user is authenticated
    if (user && (parsedData.moisture > 0 || parsedData.pH > 0 || 
        parsedData.nitrogen > 0 || parsedData.phosphorus > 0 || 
        parsedData.potassium > 0)) {
      
      firebaseService.saveSensorReading(parsedData)
        .then(docId => {
          if (docId) {
            console.log('Data saved to Firebase:', docId);
          }
        })
        .catch(error => {
          console.error('Error saving to Firebase:', error);
        });
      
      // Update recommendations
      const newRecommendations = firebaseService.getNutrientRecommendations(parsedData);
      setRecommendations(newRecommendations);
    }
  }, [user]);
  
  // Set up Bluetooth data receiver
  useEffect(() => {
    bluetoothService.setDataReceiver(processSensorData);
    
    return () => {
      // Don't disconnect on unmount, just clean up listener
      bluetoothService.setDataReceiver(null);
    };
  }, [processSensorData]);
  
  // Determine status for each parameter
  const getStatusColor = (parameter, value) => {
    switch(parameter) {
      case 'moisture':
        return value > 40 && value < 80 ? '#4CAF50' : '#FF5722';
      case 'pH':
        return value > 5.5 && value < 7.5 ? '#4CAF50' : '#FF5722';
      case 'nitrogen':
        return value > 2.0 && value < 4.0 ? '#4CAF50' : '#FF5722';
      case 'phosphorus':
        return value > 1.5 && value < 3.5 ? '#4CAF50' : '#FF5722';
      case 'potassium':
        return value > 3.0 && value < 5.0 ? '#4CAF50' : '#FF5722';
      default:
        return '#4CAF50';
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  // Function to manually save current readings
  const handleSaveData = async () => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please log in to save data');
      return;
    }
    
    if (!isConnected) {
      Alert.alert('Not Connected', 'Please connect to a sensor first');
      return;
    }
    
    try {
      const docId = await firebaseService.saveSensorReading(soilData);
      if (docId) {
        Alert.alert('Success', 'Soil data saved successfully');
      } else {
        Alert.alert('Error', 'Failed to save data');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'An error occurred while saving data');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Soil Data Overview</Text>
      </View>

      {/* Background Image */}
      <Image
        source={require('../assets/soil-background.jpg')}
        style={styles.backgroundImage}
        blurRadius={5}
      />

      {/* Authentication Status */}
      <View style={styles.authStatusContainer}>
        <Icon name={user ? "account-check" : "account-alert"} size={18} color={user ? "#4CAF50" : "#FF5722"} />
        <Text style={styles.authStatusText}>
          {user ? `Logged in as: ${user.email}` : "Not logged in"}
        </Text>
      </View>

      {/* Bluetooth Connection Button */}
      <BluetoothConnection 
        onConnect={handleConnectionChange}
        isConnected={isConnected}
      />

      {/* Connected Device Info */}
      {isConnected && (
        <View style={styles.connectedInfo}>
          <Icon name="bluetooth-connect" size={18} color="#4CAF50" />
          <Text style={styles.connectedText}>
            Connected to: {connectedDevice}
          </Text>
        </View>
      )}

      <ScrollView style={styles.scrollContent}>
        <View style={styles.contentContainer}>
          {/* Moisture Level Card */}
          <View style={styles.dataCard}>
            <View style={styles.dataHeader}>
              <Icon name="water" size={22} color="#4CAF50" />
              <Text style={styles.dataTitle}>Moisture Level</Text>
            </View>
            <View style={styles.dataContent}>
              <Text style={[styles.dataValue, {color: getStatusColor('moisture', soilData.moisture)}]}>
                {soilData.moisture.toFixed(1)}%
              </Text>
              <View style={styles.statusIndicator}>
                <Text style={styles.statusText}>
                  {soilData.moisture > 40 && soilData.moisture < 80 ? 'Optimal' : 'Attention Needed'}
                </Text>
              </View>
            </View>
          </View>

          {/* pH Level Card */}
          <View style={styles.dataCard}>
            <View style={styles.dataHeader}>
              <Icon name="flask" size={22} color="#4CAF50" />
              <Text style={styles.dataTitle}>pH Level</Text>
            </View>
            <View style={styles.dataContent}>
              <Text style={[styles.dataValue, {color: getStatusColor('pH', soilData.pH)}]}>
                {soilData.pH.toFixed(1)}
              </Text>
              <View style={styles.statusIndicator}>
                <Text style={styles.statusText}>
                  {soilData.pH > 5.5 && soilData.pH < 7.5 ? 'Optimal' : 'Attention Needed'}
                </Text>
              </View>
            </View>
          </View>

          {/* NPK Section Header */}
          <Text style={styles.sectionHeader}>NPK Levels</Text>

          {/* Nitrogen Level Card */}
          <View style={styles.dataCard}>
            <View style={styles.dataHeader}>
              <Icon name="leaf" size={22} color="#4CAF50" />
              <Text style={styles.dataTitle}>Nitrogen (N)</Text>
            </View>
            <View style={styles.dataContent}>
              <Text style={[styles.dataValue, {color: getStatusColor('nitrogen', soilData.nitrogen)}]}>
                {soilData.nitrogen.toFixed(1)} mg/kg
              </Text>
              <View style={styles.statusIndicator}>
                <Text style={styles.statusText}>
                  {soilData.nitrogen > 2.0 && soilData.nitrogen < 4.0 ? 'Optimal' : 'Attention Needed'}
                </Text>
              </View>
            </View>
          </View>

          {/* Phosphorus Level Card */}
          <View style={styles.dataCard}>
            <View style={styles.dataHeader}>
              <Icon name="atom" size={22} color="#4CAF50" />
              <Text style={styles.dataTitle}>Phosphorus (P)</Text>
            </View>
            <View style={styles.dataContent}>
              <Text style={[styles.dataValue, {color: getStatusColor('phosphorus', soilData.phosphorus)}]}>
                {soilData.phosphorus.toFixed(1)} mg/kg
              </Text>
              <View style={styles.statusIndicator}>
                <Text style={styles.statusText}>
                  {soilData.phosphorus > 1.5 && soilData.phosphorus < 3.5 ? 'Optimal' : 'Attention Needed'}
                </Text>
              </View>
            </View>
          </View>

          {/* Potassium Level Card */}
          <View style={styles.dataCard}>
            <View style={styles.dataHeader}>
              <Icon name="molecule" size={22} color="#4CAF50" />
              <Text style={styles.dataTitle}>Potassium (K)</Text>
            </View>
            <View style={styles.dataContent}>
              <Text style={[styles.dataValue, {color: getStatusColor('potassium', soilData.potassium)}]}>
                {soilData.potassium.toFixed(1)} mg/kg
              </Text>
              <View style={styles.statusIndicator}>
                <Text style={styles.statusText}>
                  {soilData.potassium > 3.0 && soilData.potassium < 5.0 ? 'Optimal' : 'Attention Needed'}
                </Text>
              </View>
            </View>
          </View>

          {/* Chart Section */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Moisture Level Over Time</Text>
            <View style={styles.chartContent}>
              <LineChart
                data={{
                  labels: historyData.timestamps,
                  datasets: [
                    {
                      data: historyData.moisture,
                    },
                  ],
                }}
                width={width - 48}
                height={220}
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 1,
                  color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                }}
                bezier
              />
            </View>
          </View>
          
          {/* Recommendations Section */}
          {recommendations && (
            <View style={styles.recommendationCard}>
              <Text style={styles.recommendationTitle}>Recommendations</Text>
              
              <View style={styles.recommendationSection}>
                <Text style={styles.recommendationSubtitle}>General Advice:</Text>
                <Text style={styles.recommendationText}>{recommendations.general}</Text>
              </View>
              
              {recommendations.fertilizers.length > 0 && (
                <View style={styles.recommendationSection}>
                  <Text style={styles.recommendationSubtitle}>Recommended Fertilizers:</Text>
                  {recommendations.fertilizers.map((item, index) => (
                    <View key={index} style={styles.recommendationItem}>
                      <Icon name="leaf" size={16} color="#4CAF50" />
                      <Text style={styles.recommendationItemText}>{item}</Text>
                    </View>
                  ))}
                </View>
              )}
              
              {recommendations.crops.length > 0 && (
                <View style={styles.recommendationSection}>
                  <Text style={styles.recommendationSubtitle}>Suitable Crops:</Text>
                  {recommendations.crops.map((item, index) => (
                    <View key={index} style={styles.recommendationItem}>
                      <Icon name="sprout" size={16} color="#4CAF50" />
                      <Text style={styles.recommendationItemText}>{item}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
          
          {/* Action Button */}
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              (!isConnected || !user) && styles.actionButtonDisabled
            ]} 
            onPress={handleSaveData}
            disabled={!isConnected || !user}
          >
            <Text style={styles.actionButtonText}>
              {!user 
                ? 'Log in to Save Data' 
                : !isConnected 
                  ? 'Connect to Sensor First' 
                  : 'Save Data to Cloud'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavBar}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="sprout" size={24} color="#444" />
          <Text style={styles.navText}>Crop</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Icon name="account-group" size={24} color="#444" />
          <Text style={styles.navText}>Community</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <Icon name="store" size={24} color="#4CAF50" />
          <Text style={[styles.navText, styles.activeNavText]}>Shop</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Icon name="account" size={24} color="#444" />
          <Text style={styles.navText}>You</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SoilDataDisplay;