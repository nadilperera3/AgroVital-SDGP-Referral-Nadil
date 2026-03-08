import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Linking, ImageBackground, ScrollView} from 'react-native';
import { ActivityIndicator } from 'react-native'; // for loading spinner 
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import styles from '../../Styles/AgrishopDetailsStyles.js';


const AgrishopDetails = ({ route, navigation }) => {
  const { agrishop } = route.params;
  const [shopDetails, setShopDetails] = useState(null);

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const docRef = doc(collection(db, "agrishops"), agrishop.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setShopDetails(docSnap.data());
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching shop details:", error);
      }
    };

    fetchShopDetails();
  }, [agrishop.id]);

  if (!shopDetails) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/tea-plantation-2.jpg')} style={styles.backgroundImage}>
        <View style={styles.overlays} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrowContainer}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{shopDetails.name}</Text>
        </View>

        {/* Shop Details */}
        <ScrollView style={styles.ScrollView}>
          <View style={styles.detailsContainer}>
            <Image source={{ uri: shopDetails.image_url }} style={styles.shopImage} /> 
            <Text style={styles.shopName}>{shopDetails.name}</Text>
            <Text style={styles.description}> {shopDetails.description}</Text>
            <Text style={styles.details}> {shopDetails.rating}</Text>
            <Text style={styles.details}>📍 {shopDetails.address}</Text>
            <Text style={styles.details}>🕐 {shopDetails.hours}</Text>

            {/* Clickable Phone Number */}
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${shopDetails.number}`)} style={styles.callButton}>
              <Text style={styles.callButtonText}>📞 Contact Shop - {shopDetails.number}</Text>
            </TouchableOpacity>

            {/* Embedded Map */}
            <TouchableOpacity onPress={() => Linking.openURL(shopDetails.location_url)} style={styles.mapButton}>
              <Text style={styles.mapButtonText}>🗺️ View on Map</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default AgrishopDetails;
