import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
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
    fontSize: 24, 
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center', 
    lineHeight: 24, 
  },
  section: {
    backgroundColor: 'transparent',
    padding: 20,
    marginVertical: 10,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#999',
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
  itemText: {
    fontSize: 14,
    color: '#333',
  },
});

export default styles;

