import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(238, 253, 240, 0.4)',
  },
  ScrollView: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlays: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(238, 253, 240, 0.82)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    width: '100%',
    backgroundColor: '#C2E7B0',
    padding: 20,
    elevation: 3,
    marginBottom: 10,
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
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: '18%',
    color: '#333',
    marginTop: '8%',
    marginLeft: '18%',
  },
  shopImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  detailsContainer: {
    padding: 10,
    borderRadius: 15,
    borderWidth: 1.8,
    borderColor: 'rgb(0, 60, 22)',
    backgroundColor: 'rgb(238, 248, 229)',
    margin: 10,
  },
  shopName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  details: {
    fontSize: 16,
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  callButton: {
    backgroundColor: 'rgb(0, 60, 22)',
    padding: 15,
    marginLeft: 25,
    marginRight: 25,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 25,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mapButton: {
    backgroundColor: 'rgb(110, 115, 8)',
    padding: 15,
    marginLeft: 25,
    marginRight: 25,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 25,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(255, 254, 254)', // Light overlay effect
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 10,
  },
});

export default styles;
