import { StyleSheet, StatusBar, Platform } from 'react-native';
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
    fontSize: 24, 
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center', 
    lineHeight: 24, 
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(241, 252, 241, 0.7)',
    borderRadius: 25,
    paddingHorizontal: 12,
    marginHorizontal: 15,
    marginVertical: 8,
    height: 44,
    borderWidth: 1.5,
    borderColor: 'rgb(0, 60, 22)',
  },
  
  searchIcon: {
    marginRight: 8,
  },
  
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    height: '100%',
  },

  filterSection: {
    backgroundColor: 'white',
    padding: 16,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  changeText: {
    color: '#2196F3',
    fontSize: 14,
  },
  filterList: {
    flexGrow: 0,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196F3',
  },
  filterIcon: {
    marginRight: 4,
    fontSize: 16,
  },
  filterText: {
    fontSize: 14,
  },

  postCard: {
    backgroundColor: 'rgba(238, 253, 240, 0.7)',
    marginBottom: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgb(0, 60, 22)',
    marginLeft: 15,
    marginRight: 15,
    padding: 5,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
  },
  postContent: {
    padding: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  timeAgo: {
    fontSize: 14,
    color: '#666',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  solvedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  solvedText: {
    color: '#4CAF50',
    marginLeft: 4,
    fontSize: 12,
  },
  askButton: {
    position: 'absolute',
    bottom: 24,
    right: 60,
    left: 80,
    backgroundColor: 'rgb(0, 60, 22)',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  askButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
    paddingRight: 8,
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