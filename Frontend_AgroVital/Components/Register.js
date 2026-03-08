import React, { useState } from "react";
import styles from "../Styles/RegisterStyles";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import CustomPopup from './Popups'; 
import config from '../config';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNo: "",
    password: "",
    confirmPassword: "", 
  });
  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // Added new state
  const navigation = useNavigation();
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

  const validateFullName = (name) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!name.trim()) {
      return "Full name is required";
    }
    if (!nameRegex.test(name)) {
      return "Name can only contain letters and spaces";
    }
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return "Email is required";
    }
    if (!emailRegex.test(email.toLowerCase())) {
      return "Invalid email format";
    }
    if (email !== email.toLowerCase()) {
      return "Email must be in lowercase";
    }
    return "";
  };

  const validateMobileNo = (mobile) => {
    const mobileRegex = /^\d{10}$/;
    if (!mobile.trim()) {
      return "Mobile number is required";
    }
    if (!mobileRegex.test(mobile)) {
      return "Mobile number must be exactly 10 digits";
    }
    return "";
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
    if (!/(?=.*[@$!%*?&#])/.test(password)) {
      return "Password must contain at least one special character (@$!%*?&)";
    }
    return "";
  };

  // validation function for confirm password
  const validateConfirmPassword = (confirmPassword) => {
    if (!confirmPassword) {
      return "Please confirm your password";
    }
    if (confirmPassword !== formData.password) {
      return "Passwords do not match";
    }
    return "";
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation
    let error = "";
    switch (name) {
      case "fullName":
        error = validateFullName(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "mobileNo":
        error = validateMobileNo(value);
        break;
      case "password":
        error = validatePassword(value);
        // validate confirm password when password changes
        if (formData.confirmPassword) {
          setErrors(prev => ({
            ...prev,
            confirmPassword: validateConfirmPassword(formData.confirmPassword)
          }));
        }
        break;
      case "confirmPassword":
        error = validateConfirmPassword(value);
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    const newErrors = {
      fullName: validateFullName(formData.fullName),
      email: validateEmail(formData.email),
      mobileNo: validateMobileNo(formData.mobileNo),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      showPopup("Validation Error", "Please fix all errors before submitting.");
      return;
    }

    // Convert email to lowercase before sending
    const submissionData = {
      ...formData,
      email: formData.email.toLowerCase(),
    };
    // Remove confirmPassword from submission data
    delete submissionData.confirmPassword;

    try {
      const response = await fetch(`${config.BACKEND_URL}/api/auth/register`, {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();
      if (response.ok) {
        showPopup("Success", "Registration Successful", () => {
          navigation.navigate("Login");
         }); 
      } else {
        showPopup("Error", data.error || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      showPopup("Error", "Something went wrong. Please try again.");
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
          <TouchableOpacity
            style={styles.inactiveToggle}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.toggleTextInactive}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.activeToggle}>
            <Text style={styles.toggleTextActive}>Register</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={[styles.input, errors.fullName ? styles.inputError : null]}
          placeholder="Full Name"
          placeholderTextColor="#888"
          value={formData.fullName}
          onChangeText={(text) => handleInputChange('fullName', text)}
        />
        {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}

        <TextInput
          style={[styles.input, errors.email ? styles.inputError : null]}
          placeholder="Email"
          placeholderTextColor="#888"
          value={formData.email}
          onChangeText={(text) => handleInputChange('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

        <TextInput
          style={[styles.input, errors.mobileNo ? styles.inputError : null]}
          placeholder="Mobile No."
          placeholderTextColor="#888"
          value={formData.mobileNo}
          onChangeText={(text) => handleInputChange('mobileNo', text)}
          keyboardType="numeric"
          maxLength={10}
        />
        {errors.mobileNo ? <Text style={styles.errorText}>{errors.mobileNo}</Text> : null}

        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.inputPassword, errors.password ? styles.inputError : null]}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry={!passwordVisible}
            value={formData.password}
            onChangeText={(text) => handleInputChange('password', text)}
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
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

        {/* Confirm password field */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.inputPassword, errors.confirmPassword ? styles.inputError : null]}
            placeholder="Confirm Password"
            placeholderTextColor="#888"
            secureTextEntry={!confirmPasswordVisible}
            value={formData.confirmPassword}
            onChangeText={(text) => handleInputChange('confirmPassword', text)}
          />
          <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
            <Icon
              name={confirmPasswordVisible ? "eye-slash" : "eye"}
              size={20}
              color="#000"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

        <TouchableOpacity style={styles.RegisterButton} onPress={handleRegister}>
          <Text style={styles.RegisterButtonText}>Register</Text>
        </TouchableOpacity>

        <CustomPopup
          isVisible={popupVisible}
          title={popupTitle}
          message={popupMessage}
          onConfirm={() => {
            popupOnConfirm(); // Execute the callback
            hidePopup(); // Hide the popup
          }}
        />
        
      </View>
    </ImageBackground>
  );
};

export default Register;