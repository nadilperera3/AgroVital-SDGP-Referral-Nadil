import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import styles from '../../Styles/EquipmentDetailsStyles.js';

const EquipmentDetails = ({ route, navigation }) => {
  const { equipment } = route.params;
  const [equipmentDetails, setEquipmentDetails] = useState(null);
  const [availableShops, setAvailableShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipmentDetails = async () => {
      try {
        const docRef = doc(db, "equipments", equipment.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setEquipmentDetails(data);

          if (data.available_shops && data.available_shops.length > 0) {
            fetchShops(data.available_shops);
          } else {
            setLoading(false);
          }
        } else {
          console.error("No such equipment document!");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching equipment details:", error);
        setLoading(false);
      }
    };

    fetchEquipmentDetails();
  }, [equipment.id]);

  const fetchShops = async (shopIds) => {
    try {
      const shopPromises = shopIds.map(async (shopId) => {
        const shopDoc = await getDoc(doc(db, "agrishops", shopId));
        return shopDoc.exists() ? { id: shopDoc.id, ...shopDoc.data() } : null;
      });

      const shops = await Promise.all(shopPromises);
      setAvailableShops(shops.filter(shop => shop !== null));
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

  if (!equipmentDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading equipment details.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/tea-plantation-2.jpg')} style={styles.backgroundImage}>
        <View style={styles.overlay} />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrowContainer}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{equipmentDetails.name}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          

          <View style={styles.detailsContainer}>
          <Image source={{ uri: equipmentDetails.image_url }} style={styles.equipmentImage} />
            <Text style={styles.equipmentName}>{equipmentDetails.name}</Text>
            <Text style={styles.manufacturer}> Manufacturer: {equipmentDetails.manufacturer}</Text>
            <Text style={styles.price}> Price: {equipmentDetails.price}</Text>
            <Text style={styles.specification}>{equipmentDetails.specification}</Text>

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

export default EquipmentDetails;