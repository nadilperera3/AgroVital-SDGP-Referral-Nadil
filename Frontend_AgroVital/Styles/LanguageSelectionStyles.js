import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
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
    backgroundColor: 'rgba(205, 228, 244, 0.8)', // White opacity overlay
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    marginBottom: -100,
    
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginTop: -40,
    fontFamily: "sans-serif-medium",
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
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center', 
    lineHeight: 24, 
  },
  
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 60,
  },
  radioContainer: {
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#0066FF",
  },
  radioLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 10,
    flex: 1,
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    marginTop: 40,
  },
  checkboxText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 10,
  },
  acceptButton: {
    backgroundColor: "#0066FF",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 30,
    width: "60%",
  },
  acceptButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },

 
});

export default styles;