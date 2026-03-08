import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({

    // Guide Overlay Styles
    guideOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    guideContainer: {
      width: "90%",
      backgroundColor: "white",
      borderRadius: 10,
      padding: 20,
      maxHeight: "80%",
    },
    guideTitle: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 10,
    },
    guideSectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginTop: 10,
      marginBottom: 5,
    },
    guideText: {
      fontSize: 14,
      color: "#555",
      marginBottom: 10,
    },
    guideCloseButton: {
      marginLeft: "25%",
      width: "50%",
      backgroundColor: "rgb(0, 60, 22)",
      padding: 10,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 15,
    },
    guideCloseButtonText: {
      color: "rgb(255, 255, 255)",
      fontSize: 18,
      fontWeight: "bold",
    },

    // Message Cloud Styles
    messageCloud: {
      position: "absolute",
      backgroundColor: "rgb(244, 249, 242)",
      borderRadius: 10,
      padding: 10,
      maxWidth: "70%",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    // Message Cloud Pointer Styles
    messageCloudPointer: {
      position: "absolute",
      width: 0,
      height: 0,
      borderLeftWidth: 10,
      borderRightWidth: 10,
      borderBottomWidth: 15,
      borderStyle: "solid",
      borderLeftColor: "transparent",
      borderRightColor: "transparent",
      borderBottomColor: "rgb(244, 249, 242)",
    },
    messageText: {
      fontSize: 16,
      margin: 4,
      color: "rgb(0, 0, 0)",
    },


    background: {
      flex: 1,
      resizeMode: "cover",
      alignItems: "center",
      paddingTop: 20,
    },
    overlays: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(238, 253, 240, 0.8)', // White opacity overlay
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      backgroundColor: "#C2E7B0",
      padding: 20,
      alignItems: "center",
      elevation: 3,
      marginBottom: 10,
      marginTop: -20, 
    },

    scrollView: {
      flex: 1,
    },
    
    profileImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginTop: '40%',
    },

    title: {
      fontSize: 22,
      fontWeight: "bold",
      color: "black",
      marginLeft: '-4%',
      marginTop: '4%',
    },
    weatherContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: '10%',
      marginTop: '4%',
    },
    weatherIcon: {
      width: 45,
      height: 45,
    },
    weatherText: {
      fontSize: 12,
      marginLeft: 5,
      marginBottom: 20,
    },
    testCropContainer: {
      backgroundColor: 'rgb(235, 251, 241)',
      borderColor: 'rgb(0, 60, 22)',
      borderWidth: 1.5,
      padding: 15,
      borderRadius: 15,
      width: "87%",
      alignItems: "center",
      elevation: 3,
    },
    iconStyle: {
      marginHorizontal: -5, 
      marginLeft: -15, 
      marginRight: 2,
      padding: 0,
      marginTop: '-5%',
    },
    
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 15,
      marginTop: 15,
      marginLeft: -200,
    },
    testSteps: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    step: {
      alignItems: "center",
    },
    stepIcon: {
      width: 70,
      height: 70,
      
    },
    stepText: {
      textAlign: "center",
      fontSize: 12,
      marginTop: 5,
      flexWrap: "wrap",
      width: "90%", 
      alignSelf: "center",
      
    },
    takePictureButton: {
      backgroundColor: 'rgb(0, 60, 22)',
      padding: 12,
      borderRadius: 25,
      marginTop: 15,
      width: "70%",
      alignItems: "center",
    },
    takePictureText: {
      color: "#FFF",
      fontSize: 16,
      fontWeight: "bold",
    },
    featuresContainer: {
        backgroundColor: 'rgb(235, 251, 241)',
        borderColor: 'rgb(0, 60, 22)',
        borderWidth: 1.5,
        padding: 8,
        borderRadius: 15,
        width: "87%",
        elevation: 3,
        alignSelf: "center",
      },
      featuresGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between", // Ensures proper spacing
      },
      featureItem: {
        width: "30%", // Each item takes ~30% of the row
        alignItems: "center",
        marginVertical: 10,
      },

    featureText: {
      fontSize: 12,
      textAlign: "center",
      marginTop: 5,
    },

    container: {
        alignItems: "center", // Centers the image and text horizontally
        marginBottom: 10,
        
      },
      image: {
        width: 70, // Adjust as needed
        height: 70, // Adjust as needed
        resizeMode: "contain",
      },
      label: {
        marginTop: 5, // Space between the image and text
        textAlign: "center",
        fontSize: 12,
        marginTop: 5,
        flexWrap: "wrap",
        width: "90%", 
        alignSelf: "center",
      },

      menuButton: {
          padding: 8,
          alignSelf: 'flex-end',
          marginTop: '35%',
          marginRight: '-1%',

        },
        modalOverlay: {
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
        },
        dropdown: {
          position: 'absolute',
          top: 50,
          right: 20,
          backgroundColor: ' rgb(240, 255, 246)',
          borderRadius: 15,
          borderWidth: 0.9,
          borderColor: 'rgb(0, 60, 22)',
          padding: 8,
          minWidth: 180,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 15,
        },
        menuItem: {
          paddingVertical: 12,
          paddingHorizontal: 16,
        },
        menuText: {
          fontSize: 16,
          color: '#333',
        },
        bottomNavBar: {
          flexDirection: 'row',
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
        feedbackOverlay: {
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        },
        feedbackContainer: {
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 10,
          alignItems: 'center',
          width: '80%',
        },
        feedbackTitle: {
          fontSize: 16,
          fontWeight: 'bold',
          marginBottom: 15,
          textAlign: 'center',
        },
        feedbackOptions: {
          flexDirection: 'row',
          justifyContent: 'space-around',
          width: '100%',
          marginBottom: 15,
        },
        feedbackOption: {
          alignItems: 'center',
          padding: 10,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#ccc',
        },
        selectedOption: {
          backgroundColor: '#d4edda',
          borderColor: '#28a745',
        },
        feedbackEmoji: {
          fontSize: 30,
          marginBottom: 5,
        },
        feedbackButtons: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
        },
        submitButton: {
          backgroundColor: 'rgb(0, 60, 22)',
          padding: 10,
          borderRadius: 8,
          flex: 1,
          marginRight: 5,
          alignItems: 'center',
        },
        cancelButton: {
          backgroundColor: '#dc3545',
          padding: 10,
          borderRadius: 8,
          flex: 1,
          marginLeft: 5,
          alignItems: 'center',
        },
        buttonText: {
          color: 'white',
          fontWeight: 'bold',
        },
        feedbackOverlay: {
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        },
        feedbackContainer: {
          backgroundColor: 'rgb(240, 255, 240)',
          borderRadius: 20,
          padding: 20,
          width: '80%',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
          borderColor: 'rgb(0, 60, 22)',
          borderWidth: 1.5,
        },
        feedbackTitle: {
          fontSize: 17,
          fontWeight: 500,
          marginBottom: 15,
          textAlign: 'center',
          marginHorizontal: 10,
        },
        feedbackOptions: {
          flexDirection: 'row',
          justifyContent: 'space-around',
          width: '100%',
          marginVertical: 10,
        },
        feedbackOption: {
          alignItems: 'center',
          padding: 10,
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 10,
          width: 80,
        },
        selectedOption: {
          alignItems: 'center',
          padding: 10,
          borderWidth: 2,
          borderColor: 'rgb(0, 60, 22)',
          backgroundColor: 'rgb(223, 249, 233)',
          borderRadius: 10,
          width: 80,
        },
        feedbackEmoji: {
          fontSize: 30,
          marginBottom: 5,
        },
        feedbackButtons: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          marginTop: 15,
        },
        submitButton: {
          backgroundColor: 'rgb(0, 60, 22)',
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 10,
          marginHorizontal: 5,
        },
        cancelButton: {
          backgroundColor: 'rgb(131, 3, 3)',
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 10,
          marginHorizontal: 5,
        },
        buttonText: {
          color: '#fff',
          fontWeight: 'bold',
          textAlign: 'center',
        },
        disabledOption: {
          opacity: 0.5,
        },
        disabledButton: {
          backgroundColor: '#cccccc',
        },

        successOverlay: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        successContainer: {
          width: '80%',
          backgroundColor: 'white',
          borderRadius: 10,
          padding: 20,
          alignItems: 'center',
        },
        successTitle: {
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 10,
        },
        successMessage: {
          fontSize: 16,
          textAlign: 'center',
          marginBottom: 20,
        },
        successButton: {
          backgroundColor: 'rgb(1, 77, 29)',
          padding: 10,
          borderRadius: 5,
          width: '50%',
          alignItems: 'center',
        },
        successButtonText: {
          color: 'white',
          fontSize: 16,
          fontWeight: 'bold',
        },
  });

  export default styles;