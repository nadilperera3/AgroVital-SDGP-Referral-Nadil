import React, { useState, useEffect } from 'react';
import styles from '../Styles/SettingsStyles';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [currentLanguage, setCurrentLanguage] = useState("");
  
  const [notifications, setNotifications] = useState({
    cropInfo: true,
    popularPost: true,
    answerPost: true,
    upvotePost: true,
    newFollower: false,
    followedPost: true,
  });

  useEffect(() => {
    // Load the saved language when component mounts
    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('userLanguage');
        if (savedLanguage) {
          setCurrentLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Error loading saved language:', error);
      }
    };

    loadSavedLanguage();
  }, []);

  // Update language if changed from route params
  useEffect(() => {
    if (route.params?.selectedLanguage) {
      setCurrentLanguage(route.params.selectedLanguage);
    }
  }, [route.params?.selectedLanguage]);

  const toggleSwitch = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Function to handle language selection
  const handleLanguageSelect = () => {
    navigation.navigate('Language');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/tea-plantation-2.jpg')}
        style={styles.backgroundImage}
      >
        <View style={styles.overlays} />
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Home')} 
            style={styles.backArrowContainer}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <ScrollView style={styles.content}>
          {/* General Section */}
          <Text style={styles.sectionTitle}>General</Text>
          <TouchableOpacity onPress={handleLanguageSelect}>
            <View style={styles.setting}>
              <Text style={styles.settingLabel}>Select your Language</Text>
              <Text style={styles.settingValue}>
                {currentLanguage || "Please select a language"}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Country Section */}
          <Text style={styles.sectionLabel}>Country</Text>
          <View style={styles.setting}>
            <Text style={styles.settingValue}>Sri Lanka</Text>
          </View>

          {/* Notifications Section */}
          <Text style={styles.sectionTitle}>Notifications</Text>

          <View style={styles.notificationItem}>
            <View style={styles.notificationTextContainer}>
              <Text style={styles.notificationTitle}>Information about my crops</Text>
              <Text style={styles.notificationSubtitle}>Receive Push Notification</Text>
            </View>
            <Switch
              trackColor={{ false: '#767577', true: 'rgb(0, 60, 22)' }}
              thumbColor={notifications.cropInfo ? '#fff' : '#f4f3f4'}
              ios_backgroundColor="#767577"
              onValueChange={() => toggleSwitch('cropInfo')}
              value={notifications.cropInfo}
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationTextContainer}>
              <Text style={styles.notificationTitle}>Popular Post</Text>
              <Text style={styles.notificationSubtitle}>Receive Push Notification</Text>
            </View>
            <Switch
              trackColor={{ false: '#767577', true: 'rgb(0, 60, 22)' }}
              thumbColor={notifications.popularPost ? '#fff' : '#f4f3f4'}
              ios_backgroundColor="#767577"
              onValueChange={() => toggleSwitch('popularPost')}
              value={notifications.popularPost}
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationTextContainer}>
              <Text style={styles.notificationTitle}>Answer to you post</Text>
              <Text style={styles.notificationSubtitle}>Receive Push Notification</Text>
            </View>
            <Switch
              trackColor={{ false: '#767577', true: 'rgb(0, 60, 22)' }}
              thumbColor={notifications.answerPost ? '#fff' : '#f4f3f4'}
              ios_backgroundColor="#767577"
              onValueChange={() => toggleSwitch('answerPost')}
              value={notifications.answerPost}
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationTextContainer}>
              <Text style={styles.notificationTitle}>Upvote to your post</Text>
              <Text style={styles.notificationSubtitle}>Receive Push Notification</Text>
            </View>
            <Switch
              trackColor={{ false: '#767577', true: 'rgb(0, 60, 22)' }}
              thumbColor={notifications.upvotePost ? '#fff' : '#f4f3f4'}
              ios_backgroundColor="#767577"
              onValueChange={() => toggleSwitch('upvotePost')}
              value={notifications.upvotePost}
            />
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Settings;