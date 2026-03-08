import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    width: "100%",
    backgroundColor: "#C2E7B0",
    padding: 30,
    elevation: 3,
    marginBottom: 10,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: '8%',
    marginLeft: '18%',
  },
  der: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    width: '100%',
    backgroundColor: '#C2E7B0',
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
    fontSize: 24, // Slightly reduced size to fit better
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center', // Ensures the text aligns properly
    lineHeight: 24, // Matches the fontSize for perfect centering
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  listContainer: {
    padding: 20,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#E6F7FF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  diseaseName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#DDDDDD',
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 20,
    width: '100%',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default styles;