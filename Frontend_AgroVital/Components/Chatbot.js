import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as GoogleGenerativeAI from "@google/generative-ai";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../Styles/ChatbotStyles';

const SendIcon = () => (
  <Text style={styles.sendIcon}>➤</Text>
);

// Questions for each language
const suggestionQuestions = {
  English: [
    "What soil conditions are best for tea plants?",
    "How should I prune my tea plants?",
    "How do I identify and treat common tea plant diseases?",
    "What's the optimal harvesting time for different tea varieties?"
  ],
  Sinhala: [
    "තේ පැළෑටි සඳහා හොඳම පස තත්ත්ව මොනවාද?",
    "මම මගේ තේ පැළෑටි කප්පාදු කළ යුත්තේ කෙසේද?",
    "පොදු තේ පැළෑටි රෝග හඳුනාගෙන ප්‍රතිකාර කරන්නේ කෙසේද?",
    "විවිධ තේ ප්‍රභේද සඳහා අනුකූලතම අස්වනු නෙලන කාලය කුමක්ද?"
  ],
  Tamil: [
    "தேயிலை செடிகளுக்கு சிறந்த மண் நிலைமைகள் என்ன?",
    "நான் எவ்வாறு தேயிலை செடிகளை கத்தரிக்க வேண்டும்?",
    "பொதுவான தேயிலை செடி நோய்களை எவ்வாறு கண்டறிந்து சிகிச்சையளிப்பது?",
    "வெவ்வேறு தேயிலை வகைகளுக்கான சிறந்த அறுவடை நேரம் என்ன?"
  ]
};

// Multilingual content for initial messages
const initialMessages = {
  English: [
    {
      text: "This is the beginning of a conversation with the Tea Cultivation Expert",
      type: 'notification'
    },
    {
      text: "Hello, I'm your Tea Cultivation Expert assistant",
      user: false
    },
    {
      text: "I can help you with all aspects of tea cultivation, from planting to harvesting and processing.",
      user: false
    },
    {
      text: "You can ask me questions like...",
      user: false,
      type: 'suggestion',
      questions: suggestionQuestions.English
    },
    {
      text: "💬 Tap the language button to change the response language (English, සිංහල, தமிழ்)",
      user: false,
      type: 'notification' 
    }
  ],
  Sinhala: [
    {
      text: "මෙය තේ වගා විශේෂඥයා සමඟ සංවාදයක ආරම්භයයි",
      type: 'notification'
    },
    {
      text: "ආයුබෝවන්, මම ඔබේ තේ වගා විශේෂඥ සහායකයා වෙමි",
      user: false
    },
    {
      text: "මට ඔබට තේ වගා කිරීමේ සිට අස්වනු නෙලීම සහ සැකසීම දක්වා සියලු අංශ සඳහා උපකාර කළ හැකිය.",
      user: false
    },
    {
      text: "ඔබට මෙවැනි ප්‍රශ්න අසන්න පුළුවන්...",
      user: false,
      type: 'suggestion',
      questions: suggestionQuestions.Sinhala
    },
    {
      text: "💬 භාෂා බොත්තම තට්ටු කර ප්‍රතිචාර භාෂාව වෙනස් කරන්න (English, සිංහල, தமிழ்)",
      user: false,
      type: 'notification'
    }
  ],
  Tamil: [
    {
      text: "இது தேயிலை சாகுபடி நிபுணருடனான உரையாடலின் தொடக்கம்",
      type: 'notification'
    },
    {
      text: "வணக்கம், நான் உங்கள் தேயிலை சாகுபடி நிபுணர் உதவியாளர்",
      user: false
    },
    {
      text: "நடுதல் முதல் அறுவடை மற்றும் பதப்படுத்துதல் வரை தேயிலை சாகுபடியின் அனைத்து அம்சங்களிலும் நான் உங்களுக்கு உதவ முடியும்.",
      user: false
    },
    {
      text: "நீங்கள் இது போன்ற கேள்விகளைக் கேட்கலாம்...",
      user: false,
      type: 'suggestion',
      questions: suggestionQuestions.Tamil
    },
    {
      text: "💬 பதில் மொழியை மாற்ற மொழி பொத்தானைத் தட்டவும் (English, සිංහල, தமிழ்)",
      user: false,
      type: 'notification'
    }
  ]
};

const TeaAgribot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("English"); // Default language
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const navigation = useNavigation();

  const API_KEY = "AIzaSyDROshV_2WyBSeeI_SgvFbBz3kfhW3SmWY"; 

  // Fetch the selected language from AsyncStorage
  useEffect(() => {
    const fetchLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem('userLanguage');
      if (savedLanguage) {
        setLanguage(savedLanguage);
        loadMessagesInLanguage(savedLanguage);
      } else {
        loadMessagesInLanguage("English"); // Default to English if no language is saved  
      }
    };
    fetchLanguage();
  }, []);

  // Function to load messages in the selected language
  const loadMessagesInLanguage = (selectedLanguage) => {
    setMessages(initialMessages[selectedLanguage] || initialMessages.English);
  };

  // Function to translate text using Gemini API
  const translateText = async (text, targetLanguage) => {
    const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    try {
      const prompt = `Translate the following text to ${targetLanguage}. 
      Maintain the formatting and structure of the original text as much as possible.
      Keep any technical terms related to tea cultivation accurate.
      
      Text to translate:
      ${text}`;
      
      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Translation error:', error);
      return text + "\n\n[Translation error occurred. Showing original text.]";
    }
  };

  // Function to handle question selection
  const handleQuestionSelect = (question) => {
    setUserInput(question);
    sendMessageWithText(question);
  };

  // Modified sendMessage function to accept text parameter
  const sendMessageWithText = async (text) => {
    if (!text.trim()) return;
    
    setLoading(true);
    const userMessage = { text: text, user: true };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    try {
      const prompt = `You are a specialized tea cultivation expert assistant. 
      Your expertise is specifically focused on tea plants (Camellia sinensis) and their cultivation.
      If the question is not related to tea cultivation, politely redirect the conversation back to tea-related topics.
      
      For tea-related questions, provide detailed, practical, and well-formatted advice about Sri Lankan tea: ${text}
      
      Include specific information about:
      - Tea plant varieties (Assam, Chinese, Darjeeling, etc.) when relevant
      - Climate and environmental requirements
      - Soil conditions and amendments
      - Planting techniques
      - Irrigation needs
      - Fertilization requirements
      - Pruning and maintenance
      - Pest and disease management specific to tea
      - Harvesting techniques and timing
      - Processing methods for different tea types
      
      Format your response with clear sections, and include practical, actionable advice, use tea plant. weather, soil related emojies but do not use each and every place.`;
      
      const result = await model.generateContent(prompt);
      const response = result.response;
      let responseText = response.text();
      
      const formattedText = responseText
      .replace(/\*\*(.*?)\*\*/g, '$1') // Preserve bold formatting
      .replace(/\*(.*?)\*/g, '• $1')       // Convert asterisks to bullet points
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n\n');      // Double line breaks for better readability

    // Format section headers specially
    const finalFormattedText = formattedText
      .replace(/\*\*(.*?):\*\*/g, '\n\n**$1:**\n')  // Add extra spacing around headers
      .replace(/^• /gm, '  • ');                    // Indent bullet points

    let finalText = finalFormattedText;
    if (language !== "English") {
      finalText = await translateText(finalFormattedText, language);
    }
      
      setMessages(prevMessages => [...prevMessages, { 
        text: finalText, 
        user: false 
      }]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = "I apologize, but I encountered an error while retrieving tea cultivation information. Please try asking your question again.";
      
      let finalErrorMessage = errorMessage;
      if (language !== "English") {
        finalErrorMessage = await translateText(errorMessage, language);
      }
      
      setMessages(prevMessages => [...prevMessages, { 
        text: finalErrorMessage, 
        user: false 
      }]);
    }
    setUserInput("");
    setLoading(false);
  };

  const sendMessage = () => {
    sendMessageWithText(userInput);
  };

  const renderMessage = ({ item }) => {
    if (item.type === 'notification') {
      return (
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationText}>{item.text}</Text>
        </View>
      );
    }

    if (item.type === 'suggestion') {
      return (
        <View style={styles.suggestionContainer}>
          <Text style={styles.suggestionText}>{item.text}</Text>
          {item.questions && item.questions.map((question, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.questionButton}
              onPress={() => handleQuestionSelect(question)}
            >
              <Text style={styles.questionButtonText}>{question}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    return (
      <View style={[
        styles.messageContainer,
        item.user ? styles.userMessageContainer : styles.botMessageContainer,
      ]}>
        <Text style={[
          styles.messageText,
          item.user ? styles.userMessageText : styles.botMessageText
        ]}>
          {item.text}
        </Text>
      </View>
    );
  };

  // Function to change language and close modal
  const changeLanguage = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    loadMessagesInLanguage(selectedLanguage);
    setShowLanguageModal(false);
  };

  // Language selection modal
  const LanguageModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showLanguageModal}
      onRequestClose={() => setShowLanguageModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Language</Text>
          
          <TouchableOpacity
            style={[
              styles.languageButton,
              language === "English" && styles.selectedLanguage
            ]}
            onPress={() => changeLanguage("English")}
          >
            <Text style={styles.languageText}>English</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.languageButton,
              language === "Sinhala" && styles.selectedLanguage
            ]}
            onPress={() => changeLanguage("Sinhala")}
          >
            <Text style={styles.languageText}>සිංහල (Sinhala)</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.languageButton,
              language === "Tamil" && styles.selectedLanguage
            ]}
            onPress={() => changeLanguage("Tamil")}
          >
            <Text style={styles.languageText}>தமிழ் (Tamil)</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowLanguageModal(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/tea-plantation-2.jpg')} style={styles.backgroundImage}>
        <View style={styles.overlays} />
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrowContainer}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AgriBot</Text>
          <TouchableOpacity 
            onPress={() => setShowLanguageModal(true)} 
            style={styles.languageButtonContainer}
          >
            <Text style={styles.languageButtonText || { fontSize: 20 }}>
              {language === "English" ? "🇬🇧" : language === "Sinhala" ? "🇱🇰" : "🇱🇰"}
            </Text>
            {/* Dropdown arrow */}
            <Text style={{ fontSize: 12, marginLeft: 5 }}>▼</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => index.toString()}
          style={styles.messagesList}
          inverted={false}
        />

        <View style={styles.inputContainer}>
          <TextInput
            placeholder={language === "English" ? "Ask about tea cultivation..." : 
                      language === "Sinhala" ? "තේ වගාව ගැන අසන්න..." : 
                      "தேயிலை சாகுபடி பற்றி கேளுங்கள்..."}
            onChangeText={setUserInput}
            value={userInput}
            style={styles.input}
            placeholderTextColor="#999"
            multiline
          />
          <TouchableOpacity 
            onPress={sendMessage} 
            style={styles.sendButton}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <SendIcon />
            )}
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <LanguageModal />
    </View>
  );
};

export default TeaAgribot;