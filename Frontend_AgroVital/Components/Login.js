import React, { useState } from "react";
import styles from "../Styles/LoginStyles";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useAuth } from './AuthContext';
import CustomPopup from './Popups'; 
import config from '../config';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupOnConfirm, setPopupOnConfirm] = useState(() => () => {});
  const navigation = useNavigation();
  const { login } = useAuth();

  const showPopup = (title, message, onConfirm = () => {}) => {
    setPopupTitle(title);
    setPopupMessage(message);
    setPopupOnConfirm(() => onConfirm); // Set the confirmation callback
    setPopupVisible(true);
  };

  const hidePopup = () => {
    setPopupVisible(false);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showPopup("Error", "Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${config.BACKEND_URL}/api/auth/login`, {

        email,
        password,
      });

      console.log('Login response:', response.data); 

      const { token } = response.data;

      // Store token and email in AsyncStorage
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userEmail", email);

      // Set user data in AuthContext
      login({ email, token });

      // Show success popup and navigate to Home after pressing "OK"
      showPopup("Success", "Login successful!", () => {
        navigation.navigate("Home"); // Navigate to Home
      });
    } catch (error) {
      showPopup("Error", error.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/LoginBackground.jpg")}
      style={styles.background}
    >
      <View style={styles.overlays} />
      <View style={styles.container}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity style={styles.activeToggle}>
            <Text style={styles.toggleTextActive}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.inactiveToggle}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.toggleTextInactive}>Register</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Icon
              name={passwordVisible ? "eye-slash" : "eye"}
              size={20}
              color="#000"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.orText}>or</Text>
        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Icon name="google" size={24} color="#db4a39" />
          </TouchableOpacity>
        </View>

        <CustomPopup
          isVisible={popupVisible}
          title={popupTitle}
          message={popupMessage}
          onConfirm={() => {
            popupOnConfirm(); // Execute the callback (e.g., navigate to Home)
            hidePopup(); // Hide the popup
          }}
        />
      </View>
    </ImageBackground>
  );
};

export default Login;