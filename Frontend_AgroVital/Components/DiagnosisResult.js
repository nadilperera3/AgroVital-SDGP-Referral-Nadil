import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ImageBackground, ActivityIndicator, Modal } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styles from '../Styles/DiagnosisResultStyles';
import { fetchDiseaseInfo } from './geminiService';

const DiagnosisResult = ({ route, navigation }) => {
  const { isTea, teaConfidence, diagnosis, imageUri } = route.params;
  const [diseaseInfo, setDiseaseInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('english'); // Default language
  
  // Available languages
  const languages = [
    { code: 'english', name: 'English' },
    { code: 'sinhala', name: 'සිංහල' },
    { code: 'tamil', name: 'தமிழ்' }
  ];
  
  // Fetch disease information from Gemini when component mounts
  useEffect(() => {
    const getDiseaseData = async () => {
      if (isTea && diagnosis && diagnosis.diseaseName) {
        try {
          setLoading(true);
          const formattedDiseaseName = diagnosis.diseaseName.replace(/_/g, ' ');
          const info = await fetchDiseaseInfo(formattedDiseaseName);
          setDiseaseInfo(info);
        } catch (error) {
          console.error('Error fetching disease info:', error);
          // Set fallback info if API call fails
          setDiseaseInfo({
            description: "Information about this disease is temporarily unavailable.",
            symptoms: ["Unable to retrieve symptoms"],
            causativeAgent: "Information unavailable",
            lifecycle: "Information unavailable",
            controlMeasures: {
              cultural: ["Please check your connection and try again"],
              chemical: ["Information unavailable"],
              resistantVarieties: ["Information unavailable"]
            }
          });
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    getDiseaseData();
  }, [diagnosis]);

  // Handle language selection and navigate to report screen
  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode);
    setLanguageModalVisible(false);
    
    // Navigate to report screen with selected language and diagnosis data
    navigation.navigate('Report', {
      language: languageCode,
      diseaseName: diagnosis?.diseaseName?.replace(/_/g, ' ') || 'Unknown Disease',
      diseaseInfo: diseaseInfo,
      confidence: diagnosis?.confidence || 0,
      imageUri: imageUri || diagnosis?.imageUrl
    });
  };

  // If not a tea leaf, display a different screen
  if (!isTea) {
    return (
      <ScrollView style={styles.container}>
        <ImageBackground
          source={require('../assets/tea-plantation-2.jpg')}
          style={styles.backgroundImage}
        >
          <View style={styles.overlays} />

          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('DiagnosisHistory')} style={styles.backArrowContainer}>
              <Text style={styles.backButton}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Diagnosis Results</Text>
          </View>
          
          <View style={styles.imageContainer}>
            {imageUri ? (
              <Image 
                source={{ uri: imageUri }} 
                style={styles.image} 
                resizeMode="contain" 
              />
            ) : (
              <View style={[styles.image, styles.noImagePlaceholder]}>
                <Icon name="image-off" size={50} color="#ccc" />
                <Text style={styles.noImageText}>No image available</Text>
              </View>
            )}
          </View>
          
          <View style={styles.notTeaContainer}>
            <Icon name="alert-circle-outline" size={60} color="#ff6b6b" />
            <Text style={styles.notTeaTitle}>Not a Tea Leaf</Text>
            <Text style={styles.notTeaDescription}>
              This image doesn't appear to be a tea leaf. Our system is specifically trained to diagnose tea leaf diseases.
            </Text>
            <Text style={styles.confidenceText}>
              Confidence: {teaConfidence}%
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.takeAnotherButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Take Another Picture</Text>
          </TouchableOpacity>
        </ImageBackground>
      </ScrollView>
    );
  }
  
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/tea-plantation-2.jpg')}
        style={styles.backgroundImage}
      >
        <View style={styles.overlays} />
        <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrowContainer}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
          <Text style={styles.headerTitle}>Diagnosis Results</Text>
        </View>
        <ScrollView style={styles.container}>
          <View style={styles.imageContainer}>
            {imageUri ? (
              <Image 
                source={{ uri: imageUri }} 
                style={styles.image} 
                resizeMode="contain" 
              />
            ) : diagnosis && diagnosis.imageUrl ? (
              <Image 
                source={{ uri: diagnosis.imageUrl }} 
                style={styles.image} 
                resizeMode="contain" 
              />
            ) : (
              <View style={[styles.image, styles.noImagePlaceholder]}>
                <Icon name="image-off" size={50} color="#ccc" />
                <Text style={styles.noImageText}>No image available</Text>
              </View>
            )}
          </View>
          
          <View style={styles.resultContainer}>
            <Text style={styles.diagnosisTitle}>
              {diagnosis.diseaseName.replace(/_/g, ' ')}
            </Text>
            
            <View style={styles.confidenceContainer}>
              <Text style={styles.confidenceText}>
                Confidence: {diagnosis.confidence}%
              </Text>
              <View style={styles.confidenceBar}>
                <View 
                  style={[
                    styles.confidenceFill, 
                    { width: `${diagnosis.confidence}%` },
                    diagnosis.confidence > 50 ? styles.highConfidence : styles.lowConfidence
                  ]} 
                />
              </View>
            </View>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="rgb(0, 60, 22)" />
                <Text style={styles.loadingText}>Loading disease information...</Text>
              </View>
            ) : diseaseInfo ? (
              <>
                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Description</Text>
                  <Text style={styles.sectionText}>{diseaseInfo.description}</Text>
                </View>
                
                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Causative Agent</Text>
                  <Text style={styles.sectionText}>{diseaseInfo.causativeAgent}</Text>
                </View>
                
                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Symptoms</Text>
                  {diseaseInfo.symptoms && diseaseInfo.symptoms.map((symptom, index) => (
                    <View key={index} style={styles.symptomItem}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.symptomText}>{symptom}</Text>
                    </View>
                  ))}
                </View>
                
                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Life Cycle</Text>
                  <Text style={styles.sectionText}>{diseaseInfo.lifecycle}</Text>
                </View>
                
                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Control Measures</Text>
                  
                  <Text style={styles.subsectionTitle}>Cultural Management</Text>
                  {diseaseInfo.controlMeasures?.cultural?.map((method, index) => (
                    <View key={index} style={styles.symptomItem}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.symptomText}>{method}</Text>
                    </View>
                  ))}
                  
                  <Text style={styles.subsectionTitle}>Chemical Control</Text>
                  {diseaseInfo.controlMeasures?.chemical?.map((chemical, index) => (
                    <View key={index} style={styles.symptomItem}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.symptomText}>{chemical}</Text>
                    </View>
                  ))}
                  
                  <Text style={styles.subsectionTitle}>Resistant Varieties</Text>
                  {diseaseInfo.controlMeasures?.resistantVarieties?.map((variety, index) => (
                    <View key={index} style={styles.symptomItem}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.symptomText}>{variety}</Text>
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <Text style={styles.errorText}>Failed to load disease information</Text>
            )}
          </View>
          
          {/* Action Buttons Container */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="camera" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Take Another</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setLanguageModalVisible(true)}
              disabled={loading || !diseaseInfo}
            >
              <Icon name="file-document" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Report</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
      
      {/* Language Selection Modal - Updated with selection indicators */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity onPress={() => setLanguageModalVisible(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            {languages.map(lang => (
              <TouchableOpacity 
                key={lang.code}
                style={[
                  styles.languageOption,
                  selectedLanguage === lang.code && styles.languageOptionSelected
                ]}
                onPress={() => handleLanguageSelect(lang.code)}
              >
                <Text style={[
                  styles.languageName,
                  selectedLanguage === lang.code && styles.languageNameSelected
                ]}>
                  {lang.name}
                </Text>
                {selectedLanguage === lang.code && (
                  <Icon name="check" size={20} color="rgb(0, 60, 22)" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DiagnosisResult;