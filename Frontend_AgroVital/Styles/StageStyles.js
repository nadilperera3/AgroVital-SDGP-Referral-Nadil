import { StyleSheet, width } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlays: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(238, 253, 240, 0.8)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    width: "100%",
    backgroundColor: "#C2E7B0",
    padding: 15,
    elevation: 3,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: '3%',
    marginLeft: '18%',
  },
  backArrowContainer: {
    position: 'absolute',
    top: 20,
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
  diseaseCard: {
    backgroundColor: 'rgb(245, 255, 242)',
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: 'rgb(3, 65, 0)'
  },
  diseaseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(28, 102, 55)'
  },
  detailContainer: {
    marginTop: 10
  },
  diseaseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5
  },
  diseaseType: {
    color: '#666',
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#2C8E3D'
  },
  sectionContent: {
    marginBottom: 10
  },
  listItem: {
    marginLeft: 10,
    marginBottom: 5
  },
  medicationItem: {
    backgroundColor: '#F9F9F9',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5
  },
  medicationName: {
    fontWeight: 'bold'
  },
  medicationDetails: {
    color: '#666'
  },

  carouselButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -25 }],
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    left: 10,
  },
  carouselButtonRight: {
    left: undefined,
    right: 10,
  },
  carouselButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },

  carouselContainer: {
    marginVertical: 10,
  },
  imageContainer: {
    width: width,
    height: 200,
    padding: 5,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#333',
    marginHorizontal: 4,
  },
});

export default styles;