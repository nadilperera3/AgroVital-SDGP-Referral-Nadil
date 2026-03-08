import { StyleSheet, Platform, StatusBar } from 'react-native';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(187, 248, 196, 0.4)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  sendButton: {
    backgroundColor: 'rgb(0, 60, 22)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    marginTop: '6%',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 14,
  },
  addCropButton: {
    margin: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: 'rgb(0, 60, 22)',
    borderRadius: 8,
    alignItems: 'center',
  },
  addCropButtonText: {
    color: '#666',
  },
  selectedImage: {
    height: 200,
    margin: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  inputContainer: {
    margin: 16,
  },
  questionInput: {
    height: 150,
    borderWidth: 1.5,
    borderColor: 'rgb(0, 60, 22)',
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
  },
  descriptionInput: {
    height: 200,
    borderWidth: 1.5,
    borderColor: 'rgb(0, 60, 22)',
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    color: '#999',
    marginTop: 4,
    fontSize: 12,
  },
  helpText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 12,
    fontSize: 12,
    marginBottom: 20,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    backgroundColor: "#C2E7B0",
    paddingVertical: 18,
    position: "absolute",
    bottom: 0,
  },

  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeNavItem: {
    backgroundColor: '#EFE9',
    borderRadius: 30,
    marginHorizontal: 8,
    borderColor: '#004D40',
    borderWidth: 1,

  },
  navIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: '#666',
  },
  activeNavText: {
    color: '#004D40',
    fontWeight: '500',
  },
});

export default styles;
