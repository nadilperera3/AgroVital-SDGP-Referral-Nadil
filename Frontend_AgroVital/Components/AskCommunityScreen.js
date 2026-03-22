import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from './AuthContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import CustomPopup from './CustomPopup'; 
import styles from '../Styles/AskCommunityStyles';

const AskCommunityScreen = () => {
  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth(); // Retrieve user data from AuthContext
  const navigation = useNavigation();
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
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

  const handleAddCrop = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        showPopup('Permission Required', 'Please allow access to your photo library.', () => {});
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      showPopup('Error', 'Failed to pick image.', () => {});
    }
  };

  const handleSubmit = async () => {
    if (!question.trim() || !description.trim() || !selectedImage) {
      showPopup('Error', 'Please fill all fields and add an image.', () => {});
      return;
    }

    if (!user) {
      showPopup('Error', 'You must be logged in to post.', () => {});
      return;
    }

    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        showPopup('Error', 'User is not authenticated!', () => {});
        return;
      }

      // Convert image URI to Blob format
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const filename = selectedImage.substring(selectedImage.lastIndexOf('/') + 1);

      // Upload image to Firebase Storage
      const storage = getStorage();
      const storageRef = ref(storage, `community_posts/${filename}`);
      await uploadBytes(storageRef, blob);

      // Get the image URL after upload
      const imageUrl = await getDownloadURL(storageRef);

      // Save the post in Firestore
      const db = getFirestore();
      const postRef = doc(db, 'communityPosts', filename);
      await setDoc(postRef, {
        userEmail: user.email,
        question,
        description,
        imageUrl,
        timestamp: new Date(),
      });

      showPopup('Success', 'Your question has been posted successfully!', () => {
        navigation.goBack();
      });
    } catch (error) {
      console.error('Error during submission:', error);
      showPopup('Error', 'Failed to submit your question.', () => {});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrowContainer}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ask Community</Text>
        <TouchableOpacity
          onPress={handleSubmit}
          style={styles.sendButton}
          disabled={isLoading}
        >
          <Text style={styles.sendButtonText}>{isLoading ? 'Posting...' : 'Post'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.addCropButton} onPress={handleAddCrop}>
          <Text style={styles.addCropButtonText}>Add Crop</Text>
        </TouchableOpacity>

        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.questionInput}
            placeholder="Add a question, or what's wrong with your crop"
            placeholderTextColor="#999"
            value={question}
            onChangeText={setQuestion}
            multiline
            maxLength={2500}
          />
          <Text style={styles.charCount}>{question.length} / 2500 characters</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Describe specialties, like changes, etc."
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={5000}
          />
          <Text style={styles.charCount}>{description.length} / 5000 characters</Text>
        </View>

        <Text style={styles.helpText}>
          Improve the probability of receiving the right answer
        </Text>
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
    </SafeAreaView>
  );
};

export default AskCommunityScreen;