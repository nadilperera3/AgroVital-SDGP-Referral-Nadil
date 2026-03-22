import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, ImageBackground, ScrollView, Alert, Platform, Modal} from 'react-native';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../Styles/ProfileStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import config from '../config';

const Profile = () => {
  const navigation = useNavigation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    mobileNo: '',
    dob: new Date(),
    country: '',
    state: '',
    city: '',
    profileImage: null
  });
  const [imageError, setImageError] = useState(false);

  const [userEmail, setUserEmail] = useState(null);

  const DEFAULT_PROFILE_IMAGE = require('../assets/profile.jpg');

  // Fetch user email when component mounts
  useEffect(() => {
    getUserEmail();
  }, []);

  // Refresh profile when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (userEmail) {
        fetchUserProfile();
      }
    }, [userEmail])
  );

  const getUserEmail = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      if (email) {
        setUserEmail(email);
      } else {
        Alert.alert('Error', 'User not logged in');
        navigation.navigate('Login');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get user information');
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${config.BACKEND_URL}/api/profile/get-profile/${userEmail}`);


      if (response.status === 200) {
        const data = response.data.user;
        
        const parsedDate = data.dob ? new Date(data.dob) : new Date();
        
        setUserData({
          fullName: data.fullName || '',
          email: data.email || '',
          mobileNo: data.mobileNo || '',
          dob: parsedDate,
          country: data.country || '',
          state: data.state || '',
          city: data.city || '',
          profileImage: typeof data.profileImage === 'string' ? data.profileImage : null
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile data.');
    }
  };

  const getProfileImage = () => {
    try {
      if (imageError || !userData.profileImage) {
        return DEFAULT_PROFILE_IMAGE;
      }
      return { uri: userData.profileImage };
    } catch (error) {
      return DEFAULT_PROFILE_IMAGE;
    }
  };

  const handleImageError = () => {
    setImageError(true);
    console.log('Image loading failed, falling back to default image');
  };

  const handleLogout = () => {
    setShowDropdown(false);
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const userEmail = await AsyncStorage.getItem("userEmail");
              
              // Call the logout endpoint
              await axios.post(`${config.BACKEND_URL}/api/auth/logout`, {

                email: userEmail
              });
  
              // Clear local storage
              await AsyncStorage.clear();
              
              // Navigate to login
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to log out.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleEdit = () => {
    setShowDropdown(false);
    navigation.navigate('Profile', { userData });
  };

  const DropdownMenu = () => (
    <Modal
      transparent={true}
      visible={showDropdown}
      onRequestClose={() => setShowDropdown(false)}
    >
      <TouchableOpacity 
        style={styles.dropdownOverlay}
        activeOpacity={1} 
        onPress={() => setShowDropdown(false)}
      >
        <View style={styles.dropdownMenu}>
          <TouchableOpacity 
            style={styles.dropdownItem}
            onPress={handleEdit}
          >
            <Icon name="edit" size={20} color="#333" />
            <Text style={styles.dropdownText}>Edit Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.dropdownItem}
            onPress={handleLogout}
          >
            <Icon name="logout" size={20} color="#333" />
            <Text style={styles.dropdownText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/tea-plantation-2.jpg')}
        style={styles.backgroundImage}>
        <View style={styles.overlays} />
        
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Home')} 
            style={styles.backArrowContainer}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => setShowDropdown(true)}
        >
          <Icon name="more-vert" size={24} color="#333" />
        </TouchableOpacity>
        </View>
        <DropdownMenu />

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.profilePictureContainer}>
            <View style={styles.profilePicture}>
              <Image
                source={getProfileImage()}
                style={styles.profileImage}
                resizeMode="cover"
                onError={handleImageError}
                defaultSource={DEFAULT_PROFILE_IMAGE}
              />
            </View>
            <Text style={styles.username}>{userData.fullName || 'User'}</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput 
              style={[styles.input, styles.readOnlyInput]} 
              value={userData.fullName} 
              editable={false}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput 
              style={[styles.input, styles.readOnlyInput]} 
              value={userData.email}
              editable={false}
            />

            <Text style={styles.label}>Phone</Text>
            <TextInput 
              style={[styles.input, styles.readOnlyInput]} 
              value={userData.mobileNo}
              editable={false}
            />

            <Text style={styles.label}>Date of Birth</Text>
            <TextInput 
              style={[styles.input, styles.readOnlyInput]} 
              value={userData.dob.toLocaleDateString()}
              editable={false}
            />

            <Text style={styles.label}>Country</Text>
            <TextInput 
              style={[styles.input, styles.readOnlyInput]} 
              value={userData.country}
              editable={false}
            />

            <Text style={styles.label}>Province</Text>
            <TextInput 
              style={[styles.input, styles.readOnlyInput]} 
              value={userData.state}
              editable={false}
            />

            <Text style={styles.label}>District</Text>
            <TextInput 
              style={[styles.input, styles.readOnlyInput]} 
              value={userData.city}
              editable={false}
            />
          </View>
        </ScrollView>
        
        {/* Bottom Navigation Bar */}
        <View style={styles.bottomNavBar}>
          <TouchableOpacity style={[styles.navItem]} onPress={() => navigation.navigate('Home')}>
            <Icons name="sprout" size={24} color="#444" />
            <Text style={styles.navText}>Crop</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('MainCommunityScreen')}>
            <Icons name="account-group" size={24} color="#444" />
            <Text style={styles.navText}>Community</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.navItem]} onPress={() => navigation.navigate('MarketPlace')}>
            <Icons name="store" size={24} color="#444" />
            <Text style={[styles.navText]}>Shop</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.navItem,styles.activeNavItem]} onPress={() => navigation.navigate('ProfileSave')}>
            <Icons name="account" size={24} color="rgb(1, 77, 29)" />
            <Text style={styles.navText}>You</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Profile;