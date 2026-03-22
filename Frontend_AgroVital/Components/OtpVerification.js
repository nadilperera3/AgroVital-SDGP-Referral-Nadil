import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, TextInput, Button, Alert, ImageBackground, TouchableOpacity } from 'react-native';
import axios from 'axios';
import styles from '../Styles/OtpVerificationStyles.js';
import CustomPopup from './Popups';

const OtpVerification = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params || {}; // Get email from route params
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupOnConfirm, setPopupOnConfirm] = useState(() => () => {});

  const showPopup = (title, message, onConfirm = () => {}) => {
    setPopupTitle(title);
    setPopupMessage(message);
    setPopupOnConfirm(() => onConfirm); // Set the confirmation callback
    setPopupVisible(true);
  };

  const hidePopup = () => {
    setPopupVisible(false);
  };

  const handleVerifyOtp = async () => {
    try {
      // Only verify OTP here, don't reset password yet
      const response = await axios.post('http://172.27.2.30:5000/api/auth/verify-otp', { 
        email, 
        otp 
      });
      setMessage(response.data.message);
      // Alert.alert('Success', 'OTP verified');
      // Pass email and OTP to password reset screen
      showPopup('Success', 'OTP verified', () => {
        navigation.navigate('ResetPassword', { email, otp });
      });
      // navigation.navigate('ResetPassword', { email, otp });
    } catch (error) {
      showPopup("Error",error.response?.data?.error || 'Invalid OTP');

    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/tea-plantation-2.jpg')} style={styles.backgroundImage}>
        <View style={styles.overlays} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}  style={styles.backArrowContainer}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Forgot Password</Text>
        </View>
        <Text style={styles.topic}>Enter OTP to Verify Email</Text>
        <TextInput
          placeholder="Enter OTP..."
          value={otp}
          onChangeText={setOtp}
          style={styles.input}
          keyboardType="number-pad"
        />
        
        <TouchableOpacity onPress={handleVerifyOtp} style={styles.button}>
            <Text style={styles.buttonText}>Verify OTP</Text>
        </TouchableOpacity>
        
        <CustomPopup
          isVisible={popupVisible}
          title={popupTitle}
          message={popupMessage}
          onConfirm={() => {
            popupOnConfirm(); 
            hidePopup(); 
          }}
        />

      </ImageBackground>
    </View>
  );
};

export default OtpVerification;