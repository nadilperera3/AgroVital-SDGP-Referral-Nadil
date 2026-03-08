import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator, 
  Platform,
  Modal,
  Alert
} from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as Print from 'expo-print';
import { fetchDiseaseReport } from './geminiService';
import styles from '../Styles/ReportPageStyles';

const ReportScreen = ({ route, navigation }) => {
  const { language: initialLanguage, diseaseName, diseaseInfo, confidence, imageUri } = route.params;
  const [language, setLanguage] = useState(initialLanguage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  
  // Available languages
  const languages = [
    { code: 'english', name: 'English' },
    { code: 'sinhala', name: 'සිංහල' },
    { code: 'tamil', name: 'தமிழ்' }
  ];

  // Localized text based on selected language
  const localizedText = {
    english: {
      pageTitle: "Disease Report",
      diagnosisConfidence: "Diagnosis Confidence:",
      quickReferenceGuide: "Quick Reference Guide",
      downloadPdf: "Download PDF Report",
      downloadComplete: "Download Complete",
      downloadFailed: "Download Failed",
      generatingReport: "Generating report in",
      goBack: "Go Back",
      selectLanguage: "Select Language",
      downloadedTo: "Report has been saved to your Downloads folder as",
      disclaimerDefault: "This report is for informational purposes only. Always consult with an agricultural expert before implementing any disease management strategies."
    },
    sinhala: {
      pageTitle: "රෝග වාර්තාව",
      diagnosisConfidence: "රෝග විනිශ්චය විශ්වාසය:",
      quickReferenceGuide: "ඉක්මන් යොමු මාර්ගෝපදේශය",
      downloadPdf: "PDF වාර්තාව බාගත කරන්න",
      downloadComplete: "බාගත කිරීම සම්පූර්ණයි",
      downloadFailed: "බාගත කිරීම අසාර්ථක විය",
      generatingReport: "වාර්තාව ජනනය කරමින්",
      goBack: "ආපසු යන්න",
      selectLanguage: "භාෂාව තෝරන්න",
      downloadedTo: "වාර්තාව ඔබගේ බාගත කිරීම් ෆෝල්ඩරයට සුරකින ලදී",
      disclaimerDefault: "මෙම වාර්තාව තොරතුරු සඳහා පමණි. රෝග කළමනාකරණ ක්‍රමවේද ක්‍රියාත්මක කිරීමට පෙර සැමවිටම කෘෂිකාර්මික විශේෂඥයෙකුගෙන් උපදෙස් ලබා ගන්න."
    },
    tamil: {
      pageTitle: "நோய் அறிக்கை",
      diagnosisConfidence: "நோய் கண்டறிதல் நம்பிக்கை:",
      quickReferenceGuide: "விரைவு குறிப்பு வழிகாட்டி",
      downloadPdf: "PDF அறிக்கையைப் பதிவிறக்கவும்",
      downloadComplete: "பதிவிறக்கம் முடிந்தது",
      downloadFailed: "பதிவிறக்கம் தோல்வியடைந்தது",
      generatingReport: "அறிக்கையை உருவாக்குகிறது",
      goBack: "திரும்பிச் செல்",
      selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
      downloadedTo: "அறிக்கை உங்கள் பதிவிறக்கங்கள் கோப்புறையில் சேமிக்கப்பட்டுள்ளது",
      disclaimerDefault: "இந்த அறிக்கை தகவல் நோக்கங்களுக்கு மட்டுமே. எந்தவொரு நோய் மேலாண்மை உத்திகளையும் செயல்படுத்துவதற்கு முன் எப்போதும் ஒரு விவசாய நிபுணரை ஆலோசிக்கவும்."
    }
  };

  // Get current text based on language
  const getText = (key) => {
    return localizedText[language]?.[key] || localizedText.english[key];
  };

  // Get current date for report
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Request media library permissions on component mount
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Permission to access media library is required to save files.');
        }
      }
    })();
  }, []);

  // Generate report when component mounts or language changes
  useEffect(() => {
    const generateReport = async () => {
      setLoading(true);
      try {
        const generatedReport = await fetchDiseaseReport(diseaseName, language, diseaseInfo);
        setReport(generatedReport);
      } catch (err) {
        console.error('Error generating report:', err);
        setError('Failed to generate report. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    generateReport();
  }, [diseaseName, language, diseaseInfo]);

  // Handle language selection
  const handleLanguageSelect = (languageCode) => {
    setLanguageModalVisible(false);
    if (languageCode !== language) {
      setLanguage(languageCode);
      // Report will be regenerated via useEffect
    }
  };

  // Function to generate report HTML
  const generateReportHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tea Disease Report - ${diseaseName}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid rgb(0, 60, 22);
            padding-bottom: 10px;
          }
          .title {
            color: rgb(0, 60, 22);
            font-size: 24px;
            font-weight: bold;
          }
          .date {
            color: #666;
            font-size: 14px;
            margin-top: 5px;
          }
          .section {
            margin-bottom: 20px;
          }
          .section-title {
            color: rgb(0, 60, 22);
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
          }
          .content {
            font-size: 14px;
            line-height: 1.6;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
          }
          ul {
            padding-left: 20px;
          }
          li {
            margin-bottom: 5px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">Tea Disease Diagnosis Report</div>
          <div class="date">Generated on: ${currentDate}</div>
        </div>
        
        ${report?.contentSections?.map(section => `
          <div class="section">
            <div class="section-title">${section.title}</div>
            <div class="content">${section.content.replace(/\n/g, '<br>')}</div>
          </div>
        `).join('') || ''}
        
        ${report?.quickReference && report.quickReference.length > 0 ? `
          <div class="section">
            <div class="section-title">${getText('quickReferenceGuide')}</div>
            <div class="content">
              <ul>
                ${report.quickReference.map(item => `<li>${item}</li>`).join('')}
              </ul>
            </div>
          </div>
        ` : ''}
        
        <div class="footer">
          Agrovital App - Report generated for ${diseaseName} with ${confidence}% confidence
        </div>
      </body>
      </html>
    `;
  };

  // Function to download the report as PDF - preventing duplicates
  const downloadPdfReport = async () => {
    if (Platform.OS === 'web') {
      alert('Download functionality is not available on web.');
      return;
    }

    setDownloading(true);
    try {
      // Generate HTML content
      const htmlContent = generateReportHTML();
      
      // Create a meaningful filename with date and language
      const filename = `TeaDiseaseReport-${diseaseName.replace(/\s+/g, '-')}-${language}-${new Date().toISOString().split('T')[0]}.pdf`;
      const fileUri = FileSystem.documentDirectory + filename;
      
      // Create PDF file directly to the target path with meaningful name
      const { uri: tempPdfUri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false
      });
      
      // Move the temp file to our target location with proper name
      await FileSystem.moveAsync({
        from: tempPdfUri,
        to: fileUri
      });
      
      if (Platform.OS === 'android') {
        // For Android, save directly to the Media Library with proper filename
        try {
          const asset = await MediaLibrary.createAssetAsync(fileUri);
          
          // Get the Downloads album
          const album = await MediaLibrary.getAlbumAsync('Download');
          
          if (album) {
            // Add the asset to the Downloads album
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
            
            Alert.alert(
              getText('downloadComplete'),
              `${getText('downloadedTo')} ${filename}`,
              [{ text: "OK" }]
            );
          } else {
            // Create Downloads album if it doesn't exist
            await MediaLibrary.createAlbumAsync('Download', asset, false);
            
            Alert.alert(
              getText('downloadComplete'),
              `${getText('downloadedTo')} ${filename}`,
              [{ text: "OK" }]
            );
          }
        } catch (e) {
          console.error('Error saving to media library:', e);
          
          // Fallback to sharing if media library fails
          await Sharing.shareAsync(fileUri, {
            UTI: 'com.adobe.pdf',
            mimeType: 'application/pdf',
            dialogTitle: 'Save Disease Report PDF'
          });
        }
      } else if (Platform.OS === 'ios') {
        // For iOS, use Sharing
        await Sharing.shareAsync(fileUri, {
          UTI: 'com.adobe.pdf',
          mimeType: 'application/pdf',
          dialogTitle: 'Save Disease Report PDF'
        });
      }
      
      // Clean up the temporary file
      await FileSystem.deleteAsync(fileUri, { idempotent: true }).catch(e => console.log('Cleanup error:', e));
      
      setDownloading(false);
    } catch (error) {
      console.error('Error saving PDF report:', error);
      setError('Failed to download report. Please try again.');
      setDownloading(false);
      
      // Show detailed error to help debugging
      Alert.alert(
        getText('downloadFailed'),
        `Error: ${error.message}`,
        [{ text: "OK" }]
      );
    }
  };

  const getLanguageLabel = () => {
    switch (language) {
      case 'sinhala': return 'සිංහල';
      case 'tamil': return 'தமிழ்';
      default: return 'English';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrowContainer}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getText('pageTitle')}</Text>
        
        <TouchableOpacity 
          style={styles.languageBadge}
          onPress={() => setLanguageModalVisible(true)}
        >
          <Text style={styles.languageBadgeText}>{getLanguageLabel()}</Text>
          <Icon name="chevron-down" size={16} color="#333" style={{marginLeft: 5}} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>{getText('generatingReport')} {getLanguageLabel()}...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={60} color="#ff6b6b" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>{getText('goBack')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView style={styles.reportContainer}>
            <View style={styles.reportHeader}>
              <View style={styles.reportImageContainer}>
                {imageUri ? (
                  <Image 
                    source={{ uri: imageUri }} 
                    style={styles.reportImage} 
                    resizeMode="cover" 
                  />
                ) : (
                  <View style={styles.noImageContainer}>
                    <Icon name="image-off" size={40} color="#ccc" />
                  </View>
                )}
              </View>
              
              <View style={styles.reportTitleContainer}>
                <Text style={styles.reportTitle}>{report?.title || diseaseName}</Text>
                <Text style={styles.reportDate}>{currentDate}</Text>
                <View style={styles.confidenceDisplay}>
                  <Text style={styles.confidenceLabel}>{getText('diagnosisConfidence')}</Text>
                  <Text style={[
                    styles.confidenceValue,
                    confidence >= 75 ? styles.highConfidence : 
                    confidence >= 50 ? styles.mediumConfidence : styles.lowConfidence
                  ]}>
                    {confidence}%
                  </Text>
                </View>
              </View>
            </View>
            
            {report?.contentSections?.map((section, index) => (
              <View key={index} style={styles.reportSection}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionContent}>{section.content}</Text>
              </View>
            ))}
            
            {/* Quick Reference Section */}
            {report?.quickReference && report.quickReference.length > 0 && (
              <View style={styles.quickReferenceContainer}>
                <Text style={styles.quickReferenceTitle}>{getText('quickReferenceGuide')}</Text>
                {report.quickReference.map((item, index) => (
                  <View key={index} style={styles.quickReferenceItem}>
                    <Icon name="check-circle" size={20} color="rgb(0, 60, 22)" style={styles.quickReferenceIcon} />
                    <Text style={styles.quickReferenceText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}
            
            <View style={styles.disclaimerContainer}>
              <Text style={styles.disclaimerText}>
                {report?.disclaimer || getText('disclaimerDefault')}
              </Text>
            </View>
          </ScrollView>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.downloadButton}
              onPress={downloadPdfReport}
              disabled={downloading}
            >
              {downloading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Icon name="file-pdf-box" size={20} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>{getText('downloadPdf')}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Language Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{getText('selectLanguage')}</Text>
              <TouchableOpacity onPress={() => setLanguageModalVisible(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            {languages.map(lang => (
              <TouchableOpacity 
                key={lang.code}
                style={[
                  styles.languageOption,
                  language === lang.code && styles.languageOptionSelected
                ]}
                onPress={() => handleLanguageSelect(lang.code)}
              >
                <Text style={[
                  styles.languageName,
                  language === lang.code && styles.languageNameSelected
                ]}>
                  {lang.name}
                </Text>
                {language === lang.code && (
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

export default ReportScreen;