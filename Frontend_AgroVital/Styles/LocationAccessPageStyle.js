import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
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
  featureIcon: {
    resizeMode: 'contain',
    width: 150,
    height: 150,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: -20,
    marginTop: 20,
    marginLeft: 170,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  featureIcon: {
    marginTop: '8%', 
    marginLeft: '8%',
  },
});

export default styles;
