import React, { useState, useEffect } from 'react';
import { storage } from './firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, ImageBackground, ScrollView, Platform, Linking } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import CustomPopup from './CustomPopup';
import styles from '../Styles/ProfileStyles';
import config from '../config';

const Profile = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    mobileNo: '',
    dob: new Date(),
    country: 'Sri Lanka',
    state: '',
    city: '',
    profileImage: ''
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState();
  const [userEmail, setUserEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [popupOnConfirm, setPopupOnConfirm] = useState(() => () => {});

  const DEFAULT_PROFILE_IMAGE = require('../assets/profile.jpg');

  const sriLankaProvinces = [
    { name: 'Central Province', districts: ['Kandy', 'Matale', 'Nuwara Eliya'] },
    { name: 'Eastern Province', districts: ['Ampara', 'Batticaloa', 'Trincomalee'] },
    { name: 'Northern Province', districts: ['Jaffna', 'Kilinochchi', 'Mannar', 'Mullaitivu', 'Vavuniya'] },
    { name: 'Southern Province', districts: ['Galle', 'Hambantota', 'Matara'] },
    { name: 'Western Province', districts: ['Colombo', 'Gampaha', 'Kalutara'] },
    { name: 'North Western Province', districts: ['Kurunegala', 'Puttalam'] },
    { name: 'North Central Province', districts: ['Anuradhapura', 'Polonnaruwa'] },
    { name: 'Uva Province', districts: ['Badulla', 'Monaragala'] },
    { name: 'Sabaragamuwa Province', districts: ['Kegalle', 'Ratnapura'] }
  ];

  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    fetchUserEmail();
  }, []);

  const fetchUserEmail = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      if (email) {
        setUserEmail(email);
        fetchUserProfile(email);
      }
    } catch (error) {
      console.error('Error fetching user email:', error);
      showPopup('Error', 'Failed to fetch user email.', () => {});
    }
  };

  const validateName = (name) => {
    const regex = /^[A-Za-z\s]+$/;
    if (!regex.test(name)) {
      setNameError('Name can only contain letters and spaces.');
      return false;
    } else {
      setNameError('');
      return true;
    }
  };

  const fetchUserProfile = async (email) => {
    try {
      const response = await axios.get(`${config.BACKEND_URL}/api/profile/get-profile/${email}`);

      if (response.status === 200) {
        const data = response.data.user;
        const parsedDate = data.dob ? new Date(data.dob) : new Date();

        setUserData({
          fullName: data.fullName || '',
          email: data.email || '',
          mobileNo: data.mobileNo || '',
          dob: parsedDate,
          country: data.country || 'Sri Lanka',
          state: data.state || '',
          city: data.city || '',
          profileImage: data.profileImage || ''
        });
        setProfileImage(data.profileImage ? { uri: data.profileImage } : null);

        if (data.state) {
          const selectedProvince = sriLankaProvinces.find(province => province.name === data.state);
          if (selectedProvince) {
            setDistricts(selectedProvince.districts);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      showPopup('Error', 'Failed to load profile data.', () => {});
    }
  };

  const showPopup = (title, message, onConfirm) => {
    setPopupTitle(title);
    setPopupMessage(message);
    setPopupOnConfirm(() => onConfirm);
    setPopupVisible(true);
  };

  const hidePopup = () => {
    setPopupVisible(false);
  };

  const handleSave = async () => {
    if (!validateName(userData.fullName)) {
      showPopup('Error', 'Name can only contain letters and spaces.', () => {});
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(`${config.BACKEND_URL}/api/profile/update-profile`, {

        email: userEmail,
        fullName: userData.fullName,
        dob: userData.dob,
        country: userData.country,
        state: userData.state,
        city: userData.city,
        mobileNo: userData.mobileNo,
        profileImage: userData.profileImage,
      });

      if (response.status === 200) {
        showPopup('Success', 'Profile updated successfully!', () => {
          navigation.navigate('ProfileSave');
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showPopup('Error', 'Failed to update profile.', () => {});
    } finally {
      setIsLoading(false);
    }
  };

  const handleImagePick = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const imageRef = ref(storage, `profileImages/${userEmail}.jpg`);
        await uploadBytes(imageRef, blob);
        const downloadURL = await getDownloadURL(imageRef);

        setProfileImage({ uri: downloadURL });
        setUserData(prevState => ({ ...prevState, profileImage: downloadURL }));

        await axios.post(`${config.BACKEND_URL}/api/profile/update-profile`, {

          email: userEmail,
          profileImage: downloadURL,
        });

        showPopup('Success', 'Profile picture updated successfully!', () => {});
      }
    } catch (error) {
      console.error("Image picker error:", error);
      showPopup('Error', 'Failed to pick and upload image.', () => {});
    }
  };

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showPopup(
        'Permission Denied',
        'You need to grant gallery permissions to select an image.',
        () => Linking.openSettings()
      );
      return false;
    }
    return true;
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setUserData(prev => ({ ...prev, dob: selectedDate }));
    }
  };

  const updateField = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const handleStateChange = (value) => {
    setUserData(prev => ({ ...prev, state: value, city: '' }));
    const selectedProvince = sriLankaProvinces.find(province => province.name === value);
    if (selectedProvince) {
      setDistricts(selectedProvince.districts);
    } else {
      setDistricts([]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('../assets/tea-plantation-2.jpg')} style={styles.backgroundImage}>
        <View style={styles.overlays} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrowContainer}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isLoading}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.profilePictureContainer}>
            <TouchableOpacity onPress={handleImagePick} activeOpacity={0.8}>
              <Image
                source={profileImage ? { uri: profileImage.uri } : DEFAULT_PROFILE_IMAGE}
                style={styles.profileImage}
                resizeMode="cover"
              />
              <View style={styles.editIconContainer}>
                <Text style={styles.editIcon}>📷</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.username}>{userData.fullName || 'User'}</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={userData.fullName}
              onChangeText={(value) => {
                updateField('fullName', value);
                validateName(value);
              }}
            />
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

            <Text style={styles.label}>Email</Text>
            <TextInput style={[styles.input, styles.readOnlyInput]} value={userData.email} editable={false} />

            <Text style={styles.label}>Phone</Text>
            <TextInput style={styles.input} value={userData.mobileNo} onChangeText={(value) => updateField('mobileNo', value)} keyboardType="phone-pad" />

            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput style={styles.input} value={userData.dob.toLocaleDateString()} editable={false} />
            </TouchableOpacity>
            {showDatePicker && <DateTimePicker value={userData.dob} mode="date" display="default" onChange={handleDateChange} />}

            <Text style={styles.label}>Country</Text>
            <TextInput style={styles.input} value={userData.country} editable={false} />

            <Text style={styles.label}>Province</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={userData.state}
                onValueChange={handleStateChange}
                style={styles.picker}
              >
                <Picker.Item label="Select Province" value="" />
                {sriLankaProvinces.map((province, index) => (
                  <Picker.Item key={index} label={province.name} value={province.name} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>District</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={userData.city}
                onValueChange={(value) => updateField('city', value)}
                style={styles.picker}
              >
                <Picker.Item label="Select District" value="" />
                {districts.map((district, index) => (
                  <Picker.Item key={index} label={district} value={district} />
                ))}
              </Picker>
            </View>
          </View>
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
    </SafeAreaView>
  );
};

export default Profile;