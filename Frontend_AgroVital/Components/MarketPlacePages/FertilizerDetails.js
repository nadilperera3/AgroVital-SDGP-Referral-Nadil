import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import styles from '../../Styles/FertilizerDetailsStyles.js';

const FertilizerDetails = ({ route, navigation }) => {
  const { fertilizer } = route.params;
  const [fertilizerDetails, setFertilizerDetails] = useState(null);
  const [availableShops, setAvailableShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFertilizerDetails = async () => {
      try {
        const docRef = doc(db, "fertilizer", fertilizer.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFertilizerDetails(data);

          // Fetch available shops using stored shop IDs
          if (data.available_shops && data.available_shops.length > 0) {
            fetchShops(data.available_shops);
          } else {
            setLoading(false);
          }
        } else {
          console.error("No such fertilizer document!");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching fertilizer details:", error);
        setLoading(false);
      }
    };

    fetchFertilizerDetails();
  }, [fertilizer.id]);

  const fetchShops = async (shopIds) => {
    try {
      const shopPromises = shopIds.map(async (shopId) => {
        const shopDoc = await getDoc(doc(db, "agrishops", shopId));
        return shopDoc.exists() ? { id: shopDoc.id, ...shopDoc.data() } : null;
      });

      const shops = await Promise.all(shopPromises);
      setAvailableShops(shops.filter(shop => shop !== null)); // Remove null values
    } catch (error) {
      console.error("Error fetching shop details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!fertilizerDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading fertilizer details.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/tea-plantation-2.jpg')} style={styles.backgroundImage}>
        <View style={styles.overlay} />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrowContainer}>
              <Text style={styles.backButton}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{fertilizerDetails.name}</Text>
          </View>
          {/* Scrollable content */}
          <ScrollView contentContainerStyle={styles.scrollContainer} > 

            {/* Fertilizer Details */}
            <View style={styles.detailsContainer}>
              <Image source={{ uri: fertilizerDetails.image_url }} style={styles.fertilizerImage} />
              <Text style={styles.fertilizerName}>{fertilizerDetails.name}</Text>
              <Text style={styles.producer}> Producer: {fertilizerDetails.producer}</Text>
              <Text style={styles.netWeight}> Net Weight: {fertilizerDetails.weight}</Text>
              <Text style={styles.price}> Price: {fertilizerDetails.price}</Text>
              <Text style={styles.description}>{fertilizerDetails.description}</Text>

              {/* Available Shops */}
              <Text style={styles.availableShopsTitle}> Available Shops:</Text>
              {availableShops.length > 0 ? (
                <View>
                  {availableShops.map((item) => (
                    <TouchableOpacity 
                      key={item.id}
                      style={styles.shopContainer} 
                      onPress={() => navigation.navigate('AgrishopDetails', { agrishop: item })}
                    >
                      <Image source={{ uri: item.image_url }} style={styles.shopImage} />
                      <View style={styles.shopInfo}>
                        <Text style={styles.shopName}>{item.name}</Text>
                        <Text style={styles.shopLocation}>📍 {item.location}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text style={styles.noShopsText}>No available shops found.</Text>
              )}
            </View>
          </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default FertilizerDetails;
