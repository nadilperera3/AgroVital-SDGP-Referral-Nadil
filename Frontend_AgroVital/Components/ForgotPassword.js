import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, ImageBackground } from 'react-native';
import axios from 'axios';
import styles from '../Styles/ForgotPasswordStyles';
import CustomPopup from './Popups'; 

const ForgotPassword = () => {
  
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
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

  const handleSendOtp = async () => {
    try {
      const response = await axios.post('http://172.27.2.30:5000/api/auth/send-otp', { email });
      setMessage(response.data.message);
      showPopup("Success", "OTP sent to your email!", () => {
        navigation.navigate('OtpVerification', { email });
      });
    } catch (error) {
      showPopup("Error",error.response?.data?.error || "Error sending OTP");
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/tea-plantation-2.jpg')} style={styles.backgroundImage}>
        <View style={styles.overlays} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}  style={styles.backArrowContainer}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Forgot Password</Text>
        </View>
      
        <Text style={styles.topic}>Enter Email to receive the OTP</Text>
        <TextInput
          placeholder="Enter your email..."
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />
        
        <TouchableOpacity onPress={handleSendOtp} style={styles.button}>
          <Text style={styles.buttonText}>SEND OTP</Text>
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

export default ForgotPassword;
