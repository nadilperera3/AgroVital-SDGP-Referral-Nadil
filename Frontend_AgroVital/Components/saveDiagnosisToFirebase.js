import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebaseConfig'; 
import { Platform } from 'react-native';

/**
 * Upload an image to Firebase Storage
 * @param {string} imageUri - The local URI of the image
 * @param {string} userEmail - The user's email
 * @returns {Promise<string>} - The download URL of the uploaded image
 */
const uploadImageToStorage = async (imageUri, userEmail) => {
  try {
    // Generate a unique filename
    const timestamp = new Date().getTime();
    const filename = `diagnosis_images/${userEmail.replace('@', '_at_')}/${timestamp}.jpg`;
    
    // Create a reference to the storage location
    const storageRef = ref(storage, filename);
    
    // Fetch the image as a blob
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    // Upload the blob to Firebase Storage
    const uploadTask = uploadBytesResumable(storageRef, blob);
    
    // Return a promise that resolves with the download URL when the upload is complete
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload progress: ${progress.toFixed(2)}%`);
        },
        (error) => {
          // Handle upload errors
          console.error('Error uploading image:', error);
          reject(error);
        },
        async () => {
          // Upload completed successfully, get download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('Image uploaded, download URL:', downloadURL);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error('Error in uploadImageToStorage:', error);
    throw error;
  }
};

/**
 * Save diagnosis data to Firestore
 * @param {Object} diagnosisData - The diagnosis data from the API
 * @param {string} imageUrl - The download URL of the uploaded image
 * @param {string} userEmail - The user's email
 * @returns {Promise<DocumentReference>} - The Firestore document reference
 */
const saveDiagnosisToFirestore = async (diagnosisData, imageUrl, userEmail) => {
  try {
    // Extract relevant data from diagnosisData
    const { isTea, teaConfidence, diagnosis } = diagnosisData;
    
    // Create a data object to save to Firestore
    const diagnosisRecord = {
      userEmail,
      timestamp: serverTimestamp(),
      imageUrl,
      isTea,
      teaConfidence,
      // If it's a tea leaf, include disease details
      ...(isTea && diagnosis ? {
        diseaseName: diagnosis.diseaseName,
        confidence: diagnosis.confidence,
        originalImageUrl: diagnosis.imageUrl || null
      } : {}),

      deviceInfo: {
        platform: Platform.OS,
        version: Platform.Version
      }
    };
    
    // Add the document to the diagnoses collection
    const diagnosesRef = collection(db, 'diagnoses');
    const docRef = await addDoc(diagnosesRef, diagnosisRecord);
    
    console.log('Diagnosis saved to Firestore with ID:', docRef.id);
    return docRef;
  } catch (error) {
    console.error('Error in saveDiagnosisToFirestore:', error);
    throw error;
  }
};

/**
 * Save diagnosis details and image to Firebase
 * @param {Object} diagnosisData - The diagnosis data from the API
 * @param {string} imageUri - The local URI of the image
 * @param {string} userEmail - The user's email
 * @returns {Promise<string>} - The Firestore document ID of the saved diagnosis
 */
const saveDiagnosisToFirebase = async (diagnosisData, imageUri, userEmail) => {
  try {
    console.log('Saving diagnosis to Firebase...');
    
    // Upload the image to Firebase Storage
    let imageUrl = null;
    if (imageUri) {
      imageUrl = await uploadImageToStorage(imageUri, userEmail);
    }
    
    // Save the diagnosis data to Firestore
    const docRef = await saveDiagnosisToFirestore(diagnosisData, imageUrl, userEmail);
    
    console.log('Diagnosis saved to Firebase successfully!');
    return docRef.id;
  } catch (error) {
    console.error('Error saving diagnosis to Firebase:', error);
    throw error;
  }
};

// Make sure to export the function correctly
export default saveDiagnosisToFirebase;