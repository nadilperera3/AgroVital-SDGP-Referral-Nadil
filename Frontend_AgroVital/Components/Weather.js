import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  ActivityIndicator, 
  TouchableOpacity, 
  SafeAreaView,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as GoogleGenerativeAI from "@google/generative-ai";
import styles from '../Styles/WeatherStyles';

const API_KEY = "70c8e63e2d3fbcbb558e7341db563a26";
const GEMINI_API_KEY = "AIzaSyAbyxpBcvjSgPB5M-afZ4UfnHvCd4J1drs"; 

const Weather = () => {
  const navigation = useNavigation();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [teaGrowingConditions, setTeaGrowingConditions] = useState(null);
  const [growthStage, setGrowthStage] = useState("vegetative"); // Default to vegetative stage

  useEffect(() => {
    // Get growth stage from AsyncStorage if available
    const getGrowthStage = async () => {
      try {
        const storedStage = await AsyncStorage.getItem('teaGrowthStage');
        if (storedStage) {
          setGrowthStage(storedStage);
        }
      } catch (error) {
        console.error("Failed to get growth stage:", error);
      }
    };
    
    getGrowthStage();
    checkLocationPermissionAndFetchWeather();
  }, []);

  // Function to retry fetching location and weather data
  const retryFetchData = async () => {
    setErrorMsg(null); 
    setLoading(true); 
    await getLocationAndFetchWeather(); // Retry fetching data
  };

  const checkLocationPermissionAndFetchWeather = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        return requestLocationPermission();
      }
      
      await getLocationAndFetchWeather();
    } catch (error) {
      console.error("Permission check error:", error);
      setErrorMsg("Failed to check location permissions");
      setLoading(false);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        await getLocationAndFetchWeather();
      } else {
        Alert.alert(
          "Permission Denied",
          "Location access is required to show weather for your plantation. Please enable it in settings.",
          [
            { text: "Cancel", style: "cancel" },
            { 
              text: "Open Settings",
              onPress: () => Location.openSettingsAsync()
            }
          ]
        );
        setLoading(false);
        setErrorMsg("Location permission denied");
      }
    } catch (error) {
      setErrorMsg("Failed to request location permission");
      setLoading(false);
    }
  };

  const getLocationAndFetchWeather = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
        maximumAge: 10000,
        timeout: 30000 // Timeout to 30 seconds
      });
      
      const { latitude, longitude } = location.coords;

      // Get detailed location name with retry mechanism
      let geocodeResult;
      try {
        geocodeResult = await Location.reverseGeocodeAsync({
          latitude,
          longitude
        });
      } catch (geocodeError) {
        // Retry once
        geocodeResult = await Location.reverseGeocodeAsync({
          latitude,
          longitude
        });
      }

      if (geocodeResult && geocodeResult[0]) {
        const address = geocodeResult[0];
        const detailedLocation = [
          address.city,
          address.district,
          address.subregion
        ].filter(Boolean)[0];
        setLocationName(detailedLocation);
      } else {
        setLocationName("Unknown Location");
      }
  
      // Fetch both current weather and forecast
      const [weatherData, forecastData] = await Promise.all([
        fetchCurrentWeather(latitude, longitude),
        fetchForecast(latitude, longitude),
      ]);
  
      // Get tea growing conditions from Gemini API
      const conditions = await analyzeTeaGrowingConditions(weatherData, forecastData);
      setTeaGrowingConditions(conditions);
      setLoading(false);
    } catch (error) {
      console.error("Location and weather error:", error);
      setErrorMsg("Failed to get weather data");
      setLoading(false);
    }
  };
  
  const fetchCurrentWeather = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      setWeather(response.data);
  
      // Store the temperature and weather icon in AsyncStorage
      const currentTemp = Math.round(response.data.main.temp);
      const weatherIcon = response.data.weather[0].icon; // Get the weather icon code
      await AsyncStorage.setItem('currentTemperature', currentTemp.toString());
      await AsyncStorage.setItem('currentWeatherIcon', weatherIcon); // Store the icon code
  
      return response.data;
    } catch (error) {
      console.error("Weather fetch error:", error);
      throw error;
    }
  };

  const fetchForecast = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      setForecast(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const analyzeTeaGrowingConditions = async (weatherData, forecastData) => {
    const temp = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;
    const rainfall = weatherData.rain ? weatherData.rain["1h"] || 0 : 0;
  
    try {
      // Initialize the Gemini API
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
      // Create a prompt for Gemini API
      const prompt = `You are a specialized tea cultivation expert assistant.
        
      Given the following weather conditions for tea plants in the ${growthStage} stage:
      - Temperature: ${temp}°C
      - Humidity: ${humidity}%
      - Wind Speed: ${windSpeed} m/s
      - Rainfall: ${rainfall} mm
      
      Analyze these conditions and provide the following information as JSON ONLY (no explanations before or after):
      
      {
        "temperature": {
          "status": "optimal OR warning OR critical",
          "message": "Brief description of the temperature impact"
        },
        "humidity": {
          "status": "optimal OR warning OR critical",
          "message": "Brief description of the humidity impact"
        },
        "wind": {
          "status": "optimal OR warning OR critical",
          "message": "Brief description of the wind impact"
        },
        "rainfall": {
          "status": "optimal OR warning OR critical",
          "message": "Brief description of the rainfall impact"
        },
        "diseaseRisk": "low OR moderate OR high",
        "diseaseDetails": [
          {
            "name": "Disease Name",
            "symptoms": "Visible symptoms on tea plants",
            "treatment": "Recommended treatment methods",
            "preventive": "Preventive measures"
          },
          {
            "name": "Another Disease Name",
            "symptoms": "Visible symptoms on tea plants",
            "treatment": "Recommended treatment methods",
            "preventive": "Preventive measures"
          }
        ],
        "recommendations": ["Specific recommendation 1", "Specific recommendation 2", "Specific recommendation 3"],
        "harvestingAdvice": ["Harvesting advice 1", "Harvesting advice 2"]
      }
      
      Provide real, detailed disease information for tea plants do not be too long in point form, base recommendations on the Sri Lankan Tea Research Institute guidelines and Sri lankan Weather,Reffer Sri Lankan Tea Research papers, and include only JSON format.`;
  
      // Generate content from Gemini
      const result = await model.generateContent(prompt);
      const response = result.response;
      let responseText = response.text();
      
      // Parse the JSON response
      // Extract JSON from response (in case there's additional text)
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || 
                         responseText.match(/{[\s\S]*}/);
      
      let parsedResponse;
      if (jsonMatch) {
        const jsonString = jsonMatch[0].replace(/```json|```/g, '').trim();
        parsedResponse = JSON.parse(jsonString);
      } else {
        parsedResponse = JSON.parse(responseText);
      }
  
      // Add value properties to each condition
      return {
        temperature: {
          ...parsedResponse.temperature,
          value: temp,
          type: "temperature"
        },
        humidity: {
          ...parsedResponse.humidity,
          value: humidity,
          type: "humidity"
        },
        wind: {
          ...parsedResponse.wind,
          value: windSpeed,
          type: "wind"
        },
        rainfall: {
          ...parsedResponse.rainfall,
          value: rainfall,
          type: "rainfall"
        },
        diseaseRisk: parsedResponse.diseaseRisk,
        diseaseDetails: parsedResponse.diseaseDetails,
        recommendations: parsedResponse.recommendations,
        harvestingAdvice: parsedResponse.harvestingAdvice || []
      };
    } catch (error) {
      console.error("Gemini API error:", error);
      
      // Fallback response if API call fails
      return {
        temperature: {
          status: temp < 12 ? "warning" : temp > 28 ? "warning" : "optimal",
          message: temp < 12 ? "Temperature too low for tea growth" : 
                   temp > 28 ? "Temperature high for tea growth" : 
                   "Temperature is ideal for tea growth",
          value: temp,
          type: "temperature"
        },
        humidity: {
          status: humidity > 85 ? "warning" : humidity < 50 ? "warning" : "optimal",
          message: humidity > 85 ? "High humidity - increased disease risk" : 
                   humidity < 50 ? "Low humidity may stress plants" : 
                   "Humidity levels are suitable",
          value: humidity,
          type: "humidity"
        },
        wind: {
          status: windSpeed > 8 ? "warning" : "optimal",
          message: windSpeed > 8 ? "High wind may damage tea shoots" : "Wind speed is normal",
          value: windSpeed,
          type: "wind"
        },
        rainfall: {
          status: rainfall > 30 ? "warning" : rainfall < 5 ? "warning" : "optimal",
          message: rainfall > 30 ? "Heavy rainfall may cause waterlogging" : 
                   rainfall < 5 ? "Insufficient rainfall for tea growth" :
                   "Rainfall is within optimal range",
          value: rainfall,
          type: "rainfall"
        },
        diseaseRisk: humidity > 85 ? "high" : "low",
        diseaseDetails: [
          {
            name: "Blister Blight",
            symptoms: "Yellow translucent spots on young leaves",
            treatment: "Apply recommended fungicide as per local guidelines",
            preventive: "Maintain proper spacing between plants"
          }
        ],
        recommendations: [
          "Monitor plantation conditions regularly",
          "Follow standard tea cultivation practices"
        ],
        harvestingAdvice: ["Follow standard harvesting procedures"]
      };
    }
  };

// Function to toggle growth stage and update conditions
const toggleGrowthStage = async (stage) => {
  if (stage === growthStage) return; // Don't update if the same stage is selected
  
  setGrowthStage(stage);
  await AsyncStorage.setItem('teaGrowthStage', stage);
  
  // Show loading while refreshing
  setLoading(true);
  
  // Refresh the growing conditions based on new stage
  if (weather && forecast) {
    const conditions = await analyzeTeaGrowingConditions(weather, forecast);
    setTeaGrowingConditions(conditions);
  }
  
  setLoading(false);
};

  const goBackToHome = () => {
    navigation.navigate('Home', {
      currentTemp: Math.round(weather?.main?.temp ?? 0),
      currentWeatherIcon: weather?.weather[0]?.icon,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading plantation weather data...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorMsg}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={retryFetchData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getDayName = (date) => {
    return new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
  };

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

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });

  const renderConditionStatus = (condition) => {
    const statusColors = {
      optimal: "rgb(93, 92, 92)",
      warning: "rgb(203, 1, 1)",
      critical: "#EF5350"
    };

    return (
      <View style={styles.conditionContainer}>
        <Text style={styles.conditionValue}>
          {Math.round(condition.value ?? 0)}
          {condition.type === "temperature" ? " °C" : 
           condition.type === "humidity" ? " %" : 
           condition.type === "wind" ? " m/s " : 
           condition.type === "rainfall" ? " mm" : "%"}
        </Text>
        <Text style={[styles.conditionMessage, { color: statusColors[condition.status] || "black" }]}>
          {condition.message}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/tea-plantation-2.jpg')}
        style={styles.backgroundImage}
      />
        <View style={styles.overlay} />
        <View style={styles.header}>
        <TouchableOpacity onPress={goBackToHome} style={styles.backArrowContainer}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
          <Text style={styles.headerTitle}>Weather Forecast</Text>
        </View>

        <ScrollView style={styles.scrollContainer}>
          <View style={styles.weatherContainer}>
            <Text style={styles.sectionTitle}>Current Weather</Text>
            <View style={styles.mainCard}>
              <View style={styles.dateLocation}>
                <Text style={styles.date}>Today, {formattedDate}</Text>
                <Text style={styles.weatherDescription}>
                  {weather?.weather[0]?.description}
                </Text>
              </View>
              <View style={styles.currentWeather}>
                <View style={styles.tempContainer}>
                  <Text style={styles.temperature}>
                    {Math.round(weather?.main?.temp ?? 0)}°C
                  </Text>
                  <View style={styles.weatherDetails}>
                    <Text style={styles.humidity}>
                      Humidity: {weather?.main?.humidity ?? 0}%
                    </Text>
                    <Text style={styles.windSpeed}>
                      Wind: {Math.round(weather?.wind?.speed ?? 0)} m/s
                    </Text>
                    <Text style={styles.rainfall}>
                      Rainfall: {weather?.rain ? weather.rain["1h"] || 0 : 0} mm
                    </Text>
                  </View>
                </View>
                <Image 
                  source={getWeatherIcon(weather?.weather[0]?.icon)}
                  style={styles.weatherIcon}
                />
              </View>
              <View style={styles.locationContainer}>
                <Text style={styles.location}>
                  {locationName || "Unknown Location"}
                </Text>
                <Text style={styles.weatherStation}>
                  Weather station: {weather?.name}
                </Text>
              </View>
            </View>

            {/* Growth Stage Toggle */}
            <View style={styles.growthStageContainer}>
              <Text style={styles.growthStageLabel}>Tea Plant Stage:</Text>
              <TouchableOpacity 
                style={[
                  styles.growthStageButton, 
                  growthStage === "vegetative" && styles.activeGrowthStage
                ]}
                onPress={() => toggleGrowthStage("vegetative")}
              >
                <Text style={styles.growthStageText}>Seedling</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.growthStageButton, 
                  growthStage === "seeding" && styles.activeGrowthStage
                ]}
                onPress={() => toggleGrowthStage("seeding")}
              >
                <Text style={styles.growthStageText}>Vegetative</Text>
              </TouchableOpacity>
            </View>

            {teaGrowingConditions && (
              <View style={styles.growingConditionsPanel}>
                <Text style={styles.panelTitle}>Growing Conditions</Text>
                {renderConditionStatus(teaGrowingConditions.temperature)}
                {renderConditionStatus(teaGrowingConditions.humidity)}
                {renderConditionStatus(teaGrowingConditions.wind)}
                
                {renderConditionStatus({
                  type: "rainfall",
                  value: weather?.rain ? weather.rain["1h"] || 0 : 0,
                  status: teaGrowingConditions.rainfall?.status || "optimal",
                  message: teaGrowingConditions.rainfall?.message || "Rainfall is within optimal range"
                })}
                          
                <View style={styles.diseaseRiskContainer}>
                  <Text style={styles.diseaseRiskTitle}>Disease Risk:</Text>
                  <Text style={[
                    styles.diseaseRiskValue,
                    { color: teaGrowingConditions.diseaseRisk === "high" ? "#EF5350" : "#4CAF50" }
                  ]}>
                    {teaGrowingConditions.diseaseRisk.toUpperCase()}
                  </Text>
                </View>

                <View style={styles.recommendationsContainer}>
                  <Text style={styles.recommendationsTitle}>Disease Details:</Text>
                  {teaGrowingConditions.diseaseDetails.map((disease, index) => (
                    <View key={index} style={styles.diseaseItem}>
                      <Text style={styles.diseaseName}>{disease.name}</Text>
                      <Text style={styles.recommendationItem}><Text style={styles.diseaseLabel}>Symptoms:</Text> {disease.symptoms}</Text>
                      <Text style={styles.recommendationItem}><Text style={styles.diseaseLabel}>Treatment:</Text> {disease.treatment}</Text>
                      <Text style={styles.recommendationItem}><Text style={styles.diseaseLabel}>Preventive Measures:</Text> {disease.preventive}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.recommendationsContainer}>
                  <Text style={styles.recommendationsTitle}>Recommendations:</Text>
                  {teaGrowingConditions.recommendations.map((rec, index) => (
                    <Text key={index} style={styles.recommendationItem}>
                      • {rec}
                    </Text>
                  ))}
                </View>
              </View>
            )}

          <View style={styles.forecastSection}>
            <Text style={styles.forecastTitle}>4-Day Forecast</Text>
            <View style={styles.forecastContainer}>
              {forecast?.list?.filter((item, index) => index % 8 === 0).slice(1, 5).map((day, index) => (
                <View key={index} style={styles.forecastDay}>
                  <Text style={styles.dayName}>{getDayName(day.dt_txt)}</Text>
                  <Image 
                    source={getWeatherIcon(day.weather[0].icon)}
                    style={styles.forecastIcon}
                  />
                  <Text style={styles.forecastTemp}>{Math.round(day.main.temp)}°C</Text>
                  <Text style={styles.forecastDescription}>
                    {day.weather[0].main}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Weather;