import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { RadioButton, Checkbox } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import CustomPopup from './Popups'; // Import the CustomPopup component
import styles from "../Styles/LanguageSelectionStyles";

const LanguageSelection = ({ navigation }) => {
  const [language, setLanguage] = useState("");
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupOnConfirm, setPopupOnConfirm] = useState(() => () => {});

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
    if (!isTermsAccepted) {
      showPopup("Error", "You must accept the terms and conditions to proceed.", () => {});
      return;
    } else if (!language) {
      showPopup("Error", "Please select a language to continue.", () => {});
      return;
    }

    try {
      // Save the selected language to AsyncStorage
      await AsyncStorage.setItem('userLanguage', language);
      showPopup(
        "Success",
        `You selected ${language}`,
        () => navigation.navigate("Login", { selectedLanguage: language })
      );
    } catch (error) {
      showPopup("Error", "Failed to save language preference.", () => {});
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
        <Text style={styles.title}>Welcome</Text>
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

        <View style={styles.checkboxContainer}>
          <Checkbox
            status={isTermsAccepted ? "checked" : "unchecked"}
            onPress={() => setIsTermsAccepted(!isTermsAccepted)}
            color="#0066FF"
          />
          <Text style={styles.checkboxText}>
            I read and accept the terms and conditions of use
          </Text>
        </View>

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