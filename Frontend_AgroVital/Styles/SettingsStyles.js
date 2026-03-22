import { StyleSheet} from 'react-native';

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
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 14,
    color: '#333',
    marginTop: '8%',
    marginLeft: '18%',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E8B57',
    marginTop: 20,
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
    marginBottom: 5,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 14,
    color: '#666',
  },
  settingValue: {
    fontSize: 14,
    color: '#333',
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  notificationSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
  },
  notificationSubtitle: {
    fontSize: 14,
    color: '#555',
  },
});

export default styles;