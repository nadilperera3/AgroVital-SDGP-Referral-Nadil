import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, TextInput, Alert, ImageBackground,ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Icon from "react-native-vector-icons/FontAwesome";
import styles from '../Styles/ResetPasswordStyles';
import CustomPopup from './Popups';

const ResetPassword = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const { email, otp } = route.params || {};
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({
    newPassword: '',
    confirmPassword: ''
  });
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

  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return "Password must contain at least one special character (@$!%*?&)";
    }
    return "";
  };

  const validateConfirmPassword = (confirmPass) => {
    if (!confirmPass) {
      return "Please confirm your password";
    }
    if (confirmPass !== newPassword) {
      return "Passwords do not match";
    }
    return "";
  };

  const handleUpdatePassword = async () => {
    const newPasswordError = validatePassword(newPassword);
    const confirmPasswordError = validateConfirmPassword(confirmPassword);

    setErrors({
      newPassword: newPasswordError,
      confirmPassword: confirmPasswordError
    });

    if (newPasswordError || confirmPasswordError) {
      return;
    }

    try {
      const response = await axios.post('http://172.27.2.30:5000/api/auth/reset-password', { 
        email, 
        otp, 
        newPassword 
      });
      setMessage(response.data.message);
      // Alert.alert('Success', 'Password updated successfully', [
      //   { text: 'OK', onPress: () => navigation.navigate('Login') }
      // ]);
      showPopup('Success', 'Password updated successfully', () => {
        navigation.navigate('Login'); 
      });

    } catch (error) {
      // const errorMsg = error.response?.data?.error || 'Error updating password';
      // setMessage(errorMsg);
      // Alert.alert('Error', errorMsg);
      showPopup("Error", error.response?.data?.error || 'Error updating password');
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/tea-plantation-2.jpg')} style={styles.backgroundImage}>
        <View style={styles.overlays} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrowContainer}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Reset Password</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <Text style={styles.topic}>Enter New Password</Text>
          
          <View style={styles.newPasswordContainer}>
            <TextInput
              placeholder="New Password"
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                setErrors({...errors, newPassword: ''});
              }}
              style={[styles.input, errors.newPassword ? styles.inputError : null]}
              secureTextEntry={!newPasswordVisible}
            />
            <TouchableOpacity 
              onPress={() => setNewPasswordVisible(!newPasswordVisible)}
              style={styles.eyeIconContainer}
            >
              <Icon
                name={newPasswordVisible ? "eye-slash" : "eye"}
                size={20}
                color="#000"
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
          {errors.newPassword ? <Text style={styles.errorText}>{errors.newPassword}</Text> : null}

          <View style={styles.confirmPasswordContainer}>
            <TextInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setErrors({...errors, confirmPassword: ''});
              }}
              style={[styles.input, errors.confirmPassword ? styles.inputError : null]}
              secureTextEntry={!confirmPasswordVisible}
            />
            <TouchableOpacity 
              onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              style={styles.eyeIconContainer}
            >
              <Icon
                name={confirmPasswordVisible ? "eye-slash" : "eye"}
                size={20}
                color="#000"
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

          <TouchableOpacity onPress={handleUpdatePassword} style={styles.button}>
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
        </ScrollView>

        <CustomPopup
          isVisible={popupVisible}
          title={popupTitle}
          message={popupMessage}
          onConfirm={() => {
            popupOnConfirm();
            hidePopup();
          }}
          onCancel={hidePopup}
        />
      </ImageBackground>
    </View>
  );
};

export default ResetPassword;