import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styles from '../Styles/HistoryStyles';

const DiagnosisHistoryScreen = () => {
  const navigation = useNavigation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Get user email and fetch history when component mounts
    const fetchUserAndHistory = async () => {
      try {
        // Get the currently logged in user's email from AsyncStorage
        const email = await AsyncStorage.getItem('userEmail');
        
        if (email) {
          console.log("Current user email:", email); 
          setUserEmail(email);
          fetchDiagnosisHistory(email);
        } else {
          setLoading(false);
          Alert.alert('Error', 'User not found. Please login again.');
        }
      } catch (error) {
        console.error('Error getting user info:', error);
        setLoading(false);
      }
    };

    fetchUserAndHistory();
  }, []);

  // Fetch diagnosis history from Firestore for a specific user
  const fetchDiagnosisHistory = async (email) => {
    try {
      setLoading(true);
      
      console.log("Fetching diagnoses for email:", email); 
      
      // Create query for user's diagnoses, ordered by timestamp descending (newest first)
      const q = query(
        collection(db, 'diagnoses'),
        where('userEmail', '==', email),
        orderBy('timestamp', 'desc')
      );
      
      // Execute query
      const querySnapshot = await getDocs(q);
      
      console.log("Found diagnoses count:", querySnapshot.size); // Debugging
      
      // Process results
      const diagnosisData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Log each document data for debugging
        console.log("Diagnosis document:", doc.id, data.userEmail);
        
        // Only add if the userEmail matches (double check)
        if (data.userEmail === email) {
          diagnosisData.push({
            id: doc.id,
            timestamp: data.timestamp?.toDate() || new Date(),
            imageUrl: data.imageUrl,
            isTea: data.isTea,
            diseaseName: data.diseaseName || 'Not a tea leaf',
            confidence: data.confidence || data.teaConfidence || 0,
            userEmail: data.userEmail
          });
        }
      });
      
      setHistory(diagnosisData);
    } catch (error) {
      console.error('Error fetching diagnosis history:', error);
      Alert.alert('Error', 'Failed to load diagnosis history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Navigate to diagnosis details screen
  const viewDiagnosisDetails = (item) => {
    if (item.isTea) {
      navigation.navigate('DiagnosisResult', {
        isTea: true,
        diagnosis: {
          diseaseName: item.diseaseName,
          confidence: item.confidence,
          imageUrl: item.imageUrl
        },
        imageUri: item.imageUrl
      });
    } else {
      navigation.navigate('DiagnosisResult', {
        isTea: false,
        teaConfidence: item.confidence,
        imageUri: item.imageUrl
      });
    }
  };

  // Render each history item
  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => viewDiagnosisDetails(item)}
    >
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.historyImage}
        resizeMode="cover"
      />
      <View style={styles.historyInfo}>
        <Text style={styles.diseaseText}>{item.diseaseName}</Text>
        <Text style={styles.confidenceText}>
          Confidence: {typeof item.confidence === 'number' ? `${item.confidence.toFixed(1)}%` : 'N/A'}
        </Text>
        <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
      </View>
      <Icon name="chevron-right" size={24} color="#777" />
    </TouchableOpacity>
  );

  // Refresh the history
  const refreshHistory = () => {
    if (userEmail) {
      fetchDiagnosisHistory(userEmail);
    } else {
      // If userEmail is not available, try to get it again
      retrieveUserEmailAndRefresh();
    }
  };

  // Retrieve user email and refresh history
  const retrieveUserEmailAndRefresh = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      if (email) {
        setUserEmail(email);
        fetchDiagnosisHistory(email);
      } else {
        Alert.alert('Error', 'User not found. Please login again.');
      }
    } catch (error) {
      console.error('Error retrieving user email:', error);
      Alert.alert('Error', 'Failed to retrieve user information.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrowContainer}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Diagnosis History</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      ) : history.length > 0 ? (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderHistoryItem}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={refreshHistory}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="leaf" size={60} color="#4CAF50" />
          <Text style={styles.emptyText}>No diagnosis history found</Text>
          <Text style={styles.emptySubtext}>Take a picture of a crop to start diagnosing!</Text>
          <TouchableOpacity 
            style={styles.takePictureButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.takePictureText}>Go to Camera</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default DiagnosisHistoryScreen;