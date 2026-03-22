import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center', // Center content vertically
    alignItems: 'center',    // Center content horizontally
  },

  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlays: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(205, 228, 244, 0.3)', // White opacity overlay
  },

  welcomeText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
    marginTop: -30,
    marginBottom: 100,
    fontFamily: 'Mochiy Pop One',
  },
  
  featureContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    width: 220, 
    height: 240, 
    padding: 20,
    borderWidth: 2, 
    borderColor: '#000', 
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5, // For Android shadow
  },
  
  featureIcon: {
    width: 70,
    height: 70,
    marginBottom: 15,
  },
  featureText: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    color: '#000',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
    width: width * 0.8,
  },
  skipButton: {
    backgroundColor: 'rgba(200, 200, 200, 1.5)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    width: width * 0.3,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 18,
    color: '#000',

  },
  nextButton: {
    backgroundColor: '#0056D2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderColor: 'black',
    borderWidth: 0.5,
    width: width * 0.3,
    alignItems: 'center',
  },
  nextText: {
    fontSize: 18,
    color: '#fff',
  },
  backArrowContainer: {
    position: 'absolute',
    top: 50,
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
  
  
});

export default styles;
