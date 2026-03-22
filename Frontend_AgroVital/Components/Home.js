import React, { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  BackHandler,
  Alert,
  TextInput,
  ActivityIndicator,
  Share,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Entypo } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { storage } from './firebaseConfig';
import { ref, getDownloadURL } from 'firebase/storage';
import saveDiagnosisToFirebase from './saveDiagnosisToFirebase';
import CustomPopup from './CustomPopup';
import styles from "../Styles/HomeStyles";
import config from '../config';

// Component for individual steps in the test crop process
const StepItem = ({ image, label }) => (
  <View style={styles.step}>
    <Image source={image} style={styles.stepIcon} />
    <Text style={styles.stepText}>{label}</Text>
  </View>
);

const submitFeedbackToBackend = async (rating, email, feedback = '') => {
  try {
    const response = await fetch(`${config.BACKEND_URL}/api/submit-feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        rating,
        feedback: feedback.trim(),
        type: 'rating', // Specify the type as 'rating'
      }),
    });

    const responseData = await response.json();
    
    if (response.ok) {
      console.log('Feedback submitted to Firestore successfully');
      return true;
    } else {
      console.error('Failed to submit feedback:', responseData.error);
      return false;
    }
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return false;
  }
};

// Updated FeedbackModal component
const FeedbackModal = ({ visible, onClose }) => {
  const [selected, setSelected] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const navigation = useNavigation();

  // Fetch user email when modal opens
  useEffect(() => {
    const getUserEmail = async () => {
      try {
        const email = await AsyncStorage.getItem('userEmail');
        if (email) {
          setUserEmail(email);
        }
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };

    if (visible) {
      getUserEmail();
      // Reset state when modal opens
      setSelected(null);
      setFeedbackMessage('');
    }
  }, [visible]);

  const handleSubmit = async () => {
    if (!selected) {
      Alert.alert('Please select a rating');
      return;
    }

    if (!userEmail) {
      Alert.alert('Error', 'Unable to fetch user email. Please try again.');
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await submitFeedbackToBackend(selected, userEmail, feedbackMessage);

      if (success) {
        setSuccessModalVisible(true);
      } else {
        Alert.alert('Error', 'Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessOkPress = () => {
    setSuccessModalVisible(false);
    onClose();
    // Always navigate to FeedbackForm when OK is pressed
    navigation.navigate('FeedbackForm');
  };
  
  return (
    <>
      <Modal transparent visible={visible} animationType="fade">
        <View style={styles.feedbackOverlay}>
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackTitle}>How is your experience with AgroVital app?</Text>
            <View style={styles.feedbackOptions}>
              <TouchableOpacity 
                onPress={() => setSelected('Bad')} 
                style={[
                  styles.feedbackOption,
                  selected === 'Bad' && styles.selectedOption,
                  isSubmitting && styles.disabledOption
                ]}
                disabled={isSubmitting}
              >
                <Text style={styles.feedbackEmoji}>😞</Text>
                <Text>Bad</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setSelected('Good')} 
                style={[
                  styles.feedbackOption,
                  selected === 'Good' && styles.selectedOption,
                  isSubmitting && styles.disabledOption
                ]}
                disabled={isSubmitting}
              >
                <Text style={styles.feedbackEmoji}>😊</Text>
                <Text>Good</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setSelected('Excellent')} 
                style={[
                  styles.feedbackOption,
                  selected === 'Excellent' && styles.selectedOption,
                  isSubmitting && styles.disabledOption
                ]}
                disabled={isSubmitting}
              >
                <Text style={styles.feedbackEmoji}>🌟</Text>
                <Text>Excellent</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.feedbackInput}
              placeholder="Additional feedback (optional)"
              value={feedbackMessage}
              onChangeText={setFeedbackMessage}
              multiline
            />
            <View style={styles.feedbackButtons}>
              <TouchableOpacity 
                onPress={handleSubmit} 
                style={[styles.submitButton, isSubmitting && styles.disabledButton]}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Submit</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={onClose} 
                style={styles.cancelButton}
                disabled={isSubmitting}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.detailedFeedbackLink}
              onPress={() => {
                onClose();
                navigation.navigate('FeedbackForm');
              }}
            >
              <Text style={styles.detailedFeedbackText}>Provide Detailed Feedback</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <CustomPopup
        isVisible={isSuccessModalVisible}
        title="Thank You!"
        message="Your feedback has been submitted successfully."
        onConfirm={handleSuccessOkPress}
      />
    </>
  );
};

// Dropdown Menu Component
const DropdownMenu = ({ onFeedbackPress, onGuidePress }) => {
  const [visible, setVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const navigation = useNavigation();

  const toggleMenu = () => {
    const toValue = visible ? 0 : 1;

    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
      tension: 40,
      friction: 8,
    }).start();

    setVisible(!visible);
  };

  const shareApp = async () => {
    try {
      await Share.share({
        message: "Check out the AgroVital app for all your agricultural needs! Download it here: \n\nAndroid: https://play.google.com/store/apps/details?id=com.agrovital \niOS: https://apps.apple.com/app/id123456789",
      });
    } catch (error) {
      console.log("Error sharing the app:", error);
    }
  };

  const menuItems = [
    { id: 1, title: "Settings", action: () => navigation.navigate('Settings') },
    { id: 2, title: "Give Feedback", action: onFeedbackPress },
    { id: 3, title: "Contact & Social", action: () => navigation.navigate('Contact') },
    { id: 4, title: "Quick Start", action: onGuidePress }, 
    { id: 5, title: "Share AgroVital app", action: shareApp },
  ];

  return (
    <View>
      <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
        <Entypo name="dots-three-vertical" size={24} color="#333" />
      </TouchableOpacity>

      <Modal transparent visible={visible} onRequestClose={() => setVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.dropdown,
                {
                  transform: [
                    {
                      translateY: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-20, 0],
                      }),
                    },
                  ],
                  opacity: animation,
                },
              ]}
            >
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={() => {
                    if (item.action) {
                      item.action();
                    }
                    setVisible(false);
                  }}
                >
                  <Text style={styles.menuText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

// Quick Start Guide Modal Component
const QuickStartGuideModal = ({ visible, onClose, currentStep, onNext }) => {
  const tutorialSteps = [
    {
      message: "Welcome to AgroVital! Let's take a quick tour of the app.",
      position: { top: 100, left: 70 },
      pointerPosition: { top: -15, left: 110 },
    },
    {
      message: "Take a picture of your crop to diagnose diseases and get treatment recommendations.",
      position: { top: 345, left: 65 },
      pointerPosition: { top: -15, left: 115 },
    },
    {
      message: "Search the Marketplace to contact your nearest sellers.",
      position: { top: 525, left: 30 },
      pointerPosition: { top: -15, left: 40 },
    },
    {
      message: "Monitor soil conditions to get better recommendations.",
      position: { top: 540, left: 60 },
      pointerPosition: { top: -15, left: 120 },
    },
    {
      message: "Connect with other farmers in the Community Forum.",
      position: { top: 540, left: 100 },
      pointerPosition: { top: -15, left: 190 },
    },
    {
      message: "Get instant answers about farming from our AI-powered Agribot.",
      position: { top: 605, left: 30 },
      pointerPosition: { top: -15, left: 35 },
    },
    {
      message: "Browse our Disease Library for detailed information.",
      position: { top: 620, left: 70 },
      pointerPosition: { top: -15, left: 110 },
    },
    {
      message: "See your diagnosis history and download detailed reports.",
      position: { top: 610, left: 120 },
      pointerPosition: { top: -15, left: 150 },
    },
  ];

  if (!visible) return null;

  const { message, position, pointerPosition } = tutorialSteps[currentStep];

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.guideOverlay}>
        <View style={[styles.messageCloud, position]}>
          <View style={[styles.messageCloudPointer, pointerPosition]} />
          <Text style={styles.messageText}>{message}</Text>
          <TouchableOpacity onPress={onNext} style={styles.guideCloseButton}>
            <Text style={styles.guideCloseButtonText}>
              {currentStep === tutorialSteps.length - 1 ? "Finish" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Main Home Component
const Home = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [isFeedbackVisible, setFeedbackVisible] = useState(false);
  const [isGuideVisible, setGuideVisible] = useState(false); 
  const [profileImage, setProfileImage] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentTemp, setCurrentTemp] = useState("--");
  const [currentWeatherIcon, setCurrentWeatherIcon] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Constants
  const DEFAULT_PROFILE_IMAGE = require("../assets/profile.jpg");

  // Fetch weather data on component mount
  useEffect(() => {
    fetchWeatherData();
  }, []);

  // Fetch temperature data and set up interval
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const email = await AsyncStorage.getItem("userEmail");
        if (email) {
          setUserEmail(email);
          fetchProfileImage(email);
        }
      } catch (error) {
        console.error("Error retrieving user email:", error);
        setIsImageLoading(false);
      }
    };

    fetchUserEmail();
    fetchTemperature();

    const temperatureInterval = setInterval(fetchTemperature, 60000);
    return () => clearInterval(temperatureInterval);
  }, []);

  // Handle back button press
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Exit App",
        "Do you want to exit the app?",
        [
          {
            text: "No",
            onPress: () => null,
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => BackHandler.exitApp(),
          },
        ],
        { cancelable: false }
      );
      return true; // Prevent default behavior (exit app)
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Cleanup the event listener
  }, []);

  // Update weather data if passed via navigation params
  useEffect(() => {
    if (route.params?.currentTemp) {
      setCurrentTemp(route.params.currentTemp);
    }
    if (route.params?.currentWeatherIcon) {
      setCurrentWeatherIcon(route.params.currentWeatherIcon);
    }
  }, [route.params]);

  // Fetch weather data from AsyncStorage
  const fetchWeatherData = async () => {
    try {
      const temp = await AsyncStorage.getItem('currentTemperature');
      const icon = await AsyncStorage.getItem('currentWeatherIcon');
      if (temp) setCurrentTemp(temp);
      if (icon) setCurrentWeatherIcon(icon);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  // Fetch temperature from AsyncStorage
  const fetchTemperature = async () => {
    try {
      const temp = await AsyncStorage.getItem('currentTemperature');
      if (temp) {
        setCurrentTemp(temp);
      }
    } catch (error) {
      console.error("Error retrieving temperature:", error);
    }
  };

  // Fetch profile image from Firebase
  const fetchProfileImage = async (email) => {
    try {
      setIsImageLoading(true);
      const imageRef = ref(storage, `profileImages/${email}.jpg`);
      const downloadURL = await getDownloadURL(imageRef);
      
      // Verify if the image URL is valid
      const response = await fetch(downloadURL);
      if (response.ok) {
        setProfileImage(downloadURL);
      } else {
        setProfileImage(null);
      }
    } catch (error) {
      setProfileImage(null);
    } finally {
      setIsImageLoading(false);
    }
  };

  // Take picture using device camera
  const takePicture = async () => {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need camera permissions to take pictures.');
      return;
    }
  
    // Launch camera
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log('Image picker result:', result);
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const capturedImage = result.assets[0];
        console.log('Captured image URI:', capturedImage.uri);
        
        // Call function to upload image and get diagnosis
        uploadImageForDiagnosis(capturedImage.uri);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    }
  };
  
  // Upload image for disease diagnosis
  const uploadImageForDiagnosis = async (imageUri) => {
    try {
      // Show loading state
      setIsUploading(true);
      
      // Create form data for image upload
      const formData = new FormData();
      const uriParts = imageUri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      formData.append('image', {
        uri: imageUri,
        name: `crop_image.${fileType}`,
        type: `image/${fileType}`
      });
      
      console.log('Sending image to server for diagnosis...');
      
      // Send request to API
      const response = await fetch(`${config.BACKEND_URL}/api/predict-disease`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Server error response:', errorText);
        Alert.alert('Error', 'Server returned an error response');
        return;
      }
      
      let responseData;
      try {
        responseData = await response.json();
        console.log('Server response:', responseData);
        
        if (responseData.success) {
          // Get the user's email from AsyncStorage
          let userEmail;
          try {
            userEmail = await AsyncStorage.getItem('userEmail');
            if (!userEmail) {
              userEmail = 'anonymous@user.com'; // Fallback if email is not available
            }
          } catch (error) {
            console.error('Error retrieving user email:', error);
            userEmail = 'anonymous@user.com';
          }
          
          // Save the diagnosis to Firebase
          console.log('Attempting to save diagnosis to Firebase...');
          try {
            const diagnosisId = await saveDiagnosisToFirebase(responseData, imageUri, userEmail);
            console.log('Diagnosis saved with ID:', diagnosisId);
          } catch (firebaseError) {
            console.error('Error saving to Firebase:', firebaseError);
          }
          
          // Check if the image is a tea leaf
          if (!responseData.isTea) {
            // If not a tea leaf, navigate to diagnosis result with appropriate info
            navigation.navigate('DiagnosisResult', { 
              isTea: false, 
              teaConfidence: responseData.teaConfidence,
              imageUri: imageUri
            });
            return;
          }
          
          // If it is a tea leaf with disease diagnosis, navigate to result screen
          navigation.navigate('DiagnosisResult', { 
            isTea: true,
            teaConfidence: responseData.teaConfidence,
            diagnosis: responseData.diagnosis,
            imageUri: imageUri
          });
        } else {
          Alert.alert('Diagnosis Failed', responseData.error || 'Could not diagnose the image');
        }
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        Alert.alert('Error', 'Invalid response from server');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Get weather icon based on weather code
  const getWeatherIcon = (weatherCode) => {
    switch (weatherCode) {
      case '01d':
        return require('../assets/sunny.png');
      case '01n':
        return require('../assets/clearNight.png');
      case '02d':
        return require('../assets/partly-cloudy.png');
      case '02n':
        return require('../assets/partlyCloudyNight.png');
      case '03d':
        return require('../assets/partly-cloudy.png');
      case '03n':
        return require('../assets/partlyCloudyNight.png');
      case '04d':
        return require('../assets/cloudy-day.png');
      case '04n':
        return require('../assets/cloudy-night.png');
      case '09d': 
        return require('../assets/drizzleDay.png');
      case '09n': 
        return require('../assets/drizzleNight.png');
      case '10d': 
        return require('../assets/overcast.png');
      case '10n': 
        return require('../assets/overcastNight.png'); 
      default:
        return require('../assets/partly-cloudy.png');
    }
  };

  // Handle next step in guide modal
  const handleNextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else {
      setGuideVisible(false);
      setCurrentStep(0);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/tea-plantation-2.jpg")}
      style={styles.background}
    >
      <View style={styles.overlays} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('ProfileSave')}>
          <Image
            source={profileImage ? { uri: profileImage } : DEFAULT_PROFILE_IMAGE}
            style={styles.profileImage}
            onError={() => setProfileImage(null)}
          />
        </TouchableOpacity>
        <Text style={styles.title}>AgroVital</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Weather')}
          style={styles.weatherContainer}
        >
          <Image 
            source={currentWeatherIcon ? getWeatherIcon(currentWeatherIcon) : require("../assets/weather.png")} 
            style={styles.weatherIcon} 
          />
          <Text style={styles.weatherText}>{currentTemp}°C</Text>
        </TouchableOpacity>
        <DropdownMenu 
          onFeedbackPress={() => setFeedbackVisible(true)} 
          onGuidePress={() => setGuideVisible(true)}
        />
      </View>
      
      {/* Test Your Crop Section */}
      <Text style={styles.sectionTitle}>Test Your Crop</Text>
      <View style={styles.testCropContainer}>
        <View style={styles.testSteps}>
          <StepItem image={require("../assets/plant.png")} label="Take a Picture" />
          <Icon name="chevron-right" size={25} color="black" style={styles.iconStyle} />
          <StepItem image={require("../assets/diagnose.png")} label="See Diagnosis & Treatment" />
          <Icon name="chevron-right" size={25} color="black" style={styles.iconStyle} />
          <StepItem image={require("../assets/medicine.png")} label="Get Medicine" />
        </View>
        <TouchableOpacity 
          style={styles.takePictureButton} 
          onPress={takePicture}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.takePictureText}>Take a Picture</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Features Section */}
      <Text style={styles.sectionTitle}>All Features</Text>
      <View style={styles.featuresContainer}>
        <View style={styles.featuresGrid}>
          {[  
            { image: require("../assets/marketplace.png"), label: "Marketplace", action: () => navigation.navigate('MarketPlace') },
            { image: require("../assets/soil_monitoring.png"), label: "Soil Monitoring", action: () => navigation.navigate('SoilMonitoringInstructions') },
            { image: require("../assets/CommunityForum.png"), label: "Community Forum", action: () => navigation.navigate('MainCommunityScreen') },
            { image: require("../assets/chatbot.png"), label: "Agribot", action: () => navigation.navigate('Chatbot') },
            { image: require("../assets/library.png"), label: "Diseases Library", action: () => navigation.navigate('Library') },
            { image: require("../assets/history.png"), label: "Diagnoses History", action: () => navigation.navigate('DiagnosisHistory') },
          ].map((item, index) => (
            <TouchableOpacity key={index} style={styles.featureItem} onPress={item.action}>
              <Image source={item.image} style={styles.image} />
              <Text style={styles.label}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavBar}>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]} onPress={() => navigation.navigate('Home')}>
          <Icon name="sprout" size={24} color="rgb(1, 77, 29)" />
          <Text style={styles.navText}>Crop</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('MainCommunityScreen')}>
          <Icon name="account-group" size={24} color="#444" />
          <Text style={styles.navText}>Community</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.navItem]} onPress={() => navigation.navigate('MarketPlace')}>
          <Icon name="store" size={24} color="#444" />
          <Text style={[styles.navText]}>Shop</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ProfileSave')}>
          <Icon name="account" size={24} color="#444" />
          <Text style={styles.navText}>You</Text>
        </TouchableOpacity>
      </View>
      
      {/* Modals */}
      <FeedbackModal visible={isFeedbackVisible} onClose={() => setFeedbackVisible(false)} />
      <QuickStartGuideModal 
        visible={isGuideVisible} 
        onClose={() => setGuideVisible(false)} 
        currentStep={currentStep} 
        onNext={handleNextStep} 
      />
    </ImageBackground>
  );
};

export default Home;