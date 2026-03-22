import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(238, 253, 240, 0.4)',
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
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: '18%',
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
  shopContainer: {
    marginBottom: 70,
    marginTop: 0,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 20,
    marginLeft: '5%', // Adjusted margin for better alignment
    fontWeight: 'bold',
    flex: 1, // Allows View All to stay at the right
  },
  viewAllText: {
    fontSize: 15,
    color: '#007BFF',
    right: 10, // Positioned on the right instead of using marginLeft
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Ensures spacing between elements
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  SectionHeaderIcon: {
    width: 35,
    height: 35,
    marginLeft: '4%',
    resizeMode: 'contain',
  },
  categoryContainer: {
    marginVertical: 10, // Ensures proper spacing between categories
    paddingLeft: '3%', // Ensures tiles don't start from the edge
  },
  tile: {
    padding: 10,
    backgroundColor: 'rgb(238, 248, 229)',
    borderRadius: 20,
    borderColor:'rgb(0, 60, 22)',
    borderWidth: 2,
    marginRight: 10, 
    alignItems: 'center',
    justifyContent: 'center', 
    width: 160,
    height: 255, 
    overflow: 'hidden',
  },
  tileImage: {
    width: 160,
    height: 140,
    resizeMode: 'stretch',    
  },
  itemName: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  bottomNavBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
    justifyContent: 'space-around',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    backgroundColor: "#C2E7B0",
  },
  navItem: {
    alignItems: 'center',
    padding: 8,
    
  },
  activeNavItem: {
    backgroundColor: 'rgb(231, 255, 213)',
    borderRadius: 25,
    paddingHorizontal: 20,
    borderColor: 'rgb(0, 60, 22)',
    borderStyle: 'solid',
    borderWidth: 1.2,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  activeNavText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

export default styles;
