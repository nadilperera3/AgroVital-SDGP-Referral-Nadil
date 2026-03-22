import React, { useState, useEffect } from 'react';
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert
} from 'react-native';
import CustomPopup from './CustomPopup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../Styles/FeedbackFormStyles'; 

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState('');
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 2500;
  const navigation = useNavigation();

  // Fetch user email when component mounts
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const email = await AsyncStorage.getItem('userEmail');
        if (email) {
          setUserEmail(email);
        }
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };
    fetchUserEmail();
  }, []);

  const handleFeedbackChange = (text) => {
    if (text.length <= MAX_CHARS) {
      setFeedback(text);
      setCharCount(text.length);
    }
  };

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      Alert.alert('Error', 'Please enter your feedback before submitting.');
      return;
    }

    if (!userEmail) {
      Alert.alert('Error', 'Unable to fetch user information. Please try again.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://192.168.43.158:5000/api/submit-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          rating: '', 
          feedback: feedback,
          type: 'detailed' 
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setPopupVisible(true);
      } else {
        Alert.alert('Error', result.error || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', 'Network error. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePopupConfirm = () => {
    setPopupVisible(false);
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#F2F2F2" barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>Let us know what we can improve:</Text>
        
        <TextInput
          style={styles.input}
          multiline
          placeholder="Write your detailed feedback here..."
          value={feedback}
          onChangeText={handleFeedbackChange}
          numberOfLines={5}
          maxLength={MAX_CHARS}
        />
        
        <Text style={styles.charCounter}>
          {charCount}/{MAX_CHARS} characters
        </Text>
        
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
          )}
        </TouchableOpacity>
      </View>

      <CustomPopup
        isVisible={isPopupVisible}
        title="Thank You!"
        message="Your feedback has been submitted successfully."
        onConfirm={handlePopupConfirm}
      />
    </SafeAreaView>
  );
};

export default FeedbackForm;