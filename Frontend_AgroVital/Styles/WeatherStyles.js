import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(227, 243, 255, 0.8)', // White opacity overlay
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    width: "100%",
    backgroundColor: "#C2E7B0",
    padding: 20,
    elevation: 3,
    marginBottom: 10,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 14,
    color: '#333',
    marginTop: '8%',
    marginLeft: '18%',
  },
    backArrowContainer: {
    position: 'absolute',
    top: 40,
    left: 22,
    zIndex: 10,
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: '#000', 
  },
  backButton: {
    fontSize: 24, // Slightly reduced size to fit better
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center', // Ensures the text aligns properly
    lineHeight: 24, // Matches the fontSize for perfect centering
  },
  weatherContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  mainCard: {
    backgroundColor: 'rgb(235, 251, 241)',
    borderColor: 'rgb(0, 60, 22)',
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    elevation: 3,
  },
  dateLocation: {
    marginBottom: 12,
  },
  date: {
    fontSize: 16,
    color: '#333',
  },
  weatherDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  currentWeather: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tempContainer: {
    flex: 1,
  },
  temperature: {
    fontSize: 48,
    fontWeight: '600',
    color: '#333',
  },
  weatherDetails: {
    marginTop: 8,
  },
  humidity: {
    fontSize: 14,
    color: '#666',
  },
  windSpeed: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  weatherIcon: {
    width: 140,
    height: 140,
  },
  locationContainer: {
    marginTop: 12,
  },
  location: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  weatherStation: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },

  growingConditionsPanel: {
    backgroundColor: 'rgb(235, 251, 241)', // Light green background
    borderColor: 'rgb(0, 60, 22)', // Dark green border
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(0, 60, 22)', // Dark green text
    marginBottom: 12,
  },
  conditionContainer: {
    marginBottom: 12,
  },
  conditionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333', // Dark gray text
  },
  conditionMessage: {
    fontSize: 14,
    color: '#666', // Light gray text
    marginTop: 4,
  },
  diseaseRiskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  diseaseRiskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333', // Dark gray text
    marginRight: 8,
  },
  diseaseRiskValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recommendationsContainer: {
    marginTop: 12,
  },
  recommendationsTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: 'rgb(0, 60, 22)', // Dark gray text
    marginBottom: 10,
  },
  recommendationItem: {
    fontSize: 14,
    color: '#666', // Light gray text
    marginBottom: 4,
  },
  diseaseName: {
    fontSize: 15,
    color: 'rgb(79, 79, 79)', // Light gray text
    fontWeight: 500,
    marginBottom: 5,
  },
   weatherDetails: {
    marginTop: 10,
  },
  humidity: {
    fontSize: 14,
    color: "#555",
  },
  windSpeed: {
    fontSize: 14,
    color: "#555",
  },
  rainfall: {
    fontSize: 14,
    color: "#555",
  },
  elevation: {
    fontSize: 14,
    color: "#555",
  },
  conditionContainer: {
    marginBottom: 10,
  },
  conditionValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  conditionMessage: {
    fontSize: 14,
    color: "#555",
  },



  forecastSection: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    elevation: 3,
    backgroundColor: 'rgb(235, 251, 241)',
    borderColor: 'rgb(0, 60, 22)',
    borderWidth: 1.5,
    marginBottom: 20,
  },
  forecastTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  forecastContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forecastDay: {
    alignItems: 'center',
    flex: 1,
  },
  dayName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  forecastIcon: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  forecastTemp: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  forecastDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#E8F5E9',
  },
  loadingText: {
    marginTop: 12,
    color: '#333',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 20,
  },
  errorText: { 
    color: '#D32F2F',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  // Add these to your existing styles object
growthStageContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginVertical: 10,
  paddingHorizontal: 10,
},
growthStageLabel: {
  fontSize: 16,
  fontWeight: '600',
  color: '#333',
},
growthStageButton: {
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 20,
  backgroundColor: '#E0E0E0',
  marginHorizontal: 5,
},
activeGrowthStage: {
  backgroundColor: '#C2E7B0',
},
growthStageText: {
  fontWeight: '500',
  color: '#333',
},

});

export default styles;