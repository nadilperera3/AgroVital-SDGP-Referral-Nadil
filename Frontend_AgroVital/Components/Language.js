import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { RadioButton } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomPopup from './Popups'; 
import styles from "../Styles/LanguageSelectionStyles";

const LanguageSelection = ({ navigation }) => {
  const [language, setLanguage] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupOnConfirm, setPopupOnConfirm] = useState(() => () => {});

  // Fetch the saved language when component mounts
  useEffect(() => {
    const getSavedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('userLanguage');
        if (savedLanguage !== null) {
          setLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Error retrieving saved language:', error);
        showPopup('Failed to retrieve saved language.');
      }
    };

    getSavedLanguage();
  }, []);

  const showPopup = (title, message, onConfirm) => {
    setPopupTitle(title);
    setPopupMessage(message);
    setPopupOnConfirm(() => onConfirm);
    setPopupVisible(true);
  };

  const hidePopup = () => {
    setPopupVisible(false);
  };

  const handleAccept = async () => {
    if (!language) {
      showPopup('Error', 'Please select a language to continue.', () => {});
    } else {
      try {
        // Save the selected language to AsyncStorage
        await AsyncStorage.setItem('userLanguage', language);
        showPopup(
          'Success',
          `You selected ${language}`,
          () => navigation.navigate('Settings', { selectedLanguage: language })
        );
      } catch (error) {
        showPopup('Error', 'Failed to save language preference.', () => {});
      }
    }
  };

  return (
    <ImageBackground
      source={require('../assets/tea-plantation-2.jpg')}
      style={styles.background}
    >
      <View style={styles.overlays} />
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrowContainer}>
        <Text style={styles.backButton}>←</Text>
      </TouchableOpacity>
      
      <View style={styles.container}>
        <Text style={styles.title}>App Language</Text>
        <Text style={styles.subtitle}>Select your AgroVital Language</Text>

        <RadioButton.Group
          onValueChange={(newLanguage) => setLanguage(newLanguage)}
          value={language}
        >
          <View style={styles.radioContainer}>
            <RadioButton value="English" color="#0066FF" />
            <Text style={styles.radioLabel}>English</Text>
          </View>
          <View style={styles.radioContainer}>
            <RadioButton value="Sinhala" color="#0066FF" />
            <Text style={styles.radioLabel}>Sinhala</Text>
          </View>
          <View style={styles.radioContainer}>
            <RadioButton value="Tamil" color="#0066FF" />
            <Text style={styles.radioLabel}>Tamil</Text>
          </View>
        </RadioButton.Group>

        <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
      </View>

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
  );
};

export default LanguageSelection;