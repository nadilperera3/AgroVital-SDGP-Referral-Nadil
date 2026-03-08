import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgb(238, 248, 229)',
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
    scrollContent: {
      flex: 1,
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
      lineHeight: 24
    },
    listContainer: {
      padding: 10,
    },
    historyItem: {
      flexDirection: 'row',
        backgroundColor: "rgb(238, 248, 229)",
      borderRadius: 8,
      borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'rgb(53, 108, 5)',
      padding: 12,
      marginBottom: 10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    historyImage: {
      width: 70,
      height: 70,
      borderRadius: 8,
      marginRight: 15,
    },
    historyInfo: {
      flex: 1,
    },
    diseaseText: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    confidenceText: {
      fontSize: 14,
      color: '#666',
      marginBottom: 4,
    },
    dateText: {
      fontSize: 12,
      color: '#888',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: '#666',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
    },
    emptySubtext: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginBottom: 30,
    },
    takePictureButton: {
      backgroundColor: '#4CAF50',
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 25,
    },
    takePictureText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  export default styles;