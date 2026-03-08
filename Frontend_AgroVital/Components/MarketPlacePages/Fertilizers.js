import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ImageBackground, TextInput } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import styles from '../../Styles/FertilizersStyles';

const Fertilizer = ({ navigation }) => {
  const [fertilizers, setFertilizers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFertilizers, setFilteredFertilizers] = useState([]);

  useEffect(() => {
    const fetchFertilizers = async () => {
      try {
        const fertilizerSnap = await getDocs(collection(db, "fertilizer"));
        const fertilizerData = fertilizerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFertilizers(fertilizerData);
        setFilteredFertilizers(fertilizerData);
      } catch (error) {
        console.error("Error fetching Fertilizers:", error);
      }
    };
    fetchFertilizers();
  }, []);

  // Filter fertilizers when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFertilizers(fertilizers);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = fertilizers.filter(fert => 
        fert.name?.toLowerCase().includes(lowercasedQuery) || 
        fert.type?.toLowerCase().includes(lowercasedQuery) ||
        fert.description?.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredFertilizers(filtered);
    }
  }, [searchQuery, fertilizers]);

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/tea-plantation-2.jpg')} style={styles.backgroundImage}>
        <View style={styles.overlays} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('MarketPlace')} style={styles.backArrowContainer}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Fertilizers</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search fertilizers..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#888"
          />
        </View>

        <FlatList
          data={filteredFertilizers}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.tile} 
              onPress={() => navigation.navigate('FertilizerDetails', { fertilizer: item })}
            >
              <Image 
                source={{ uri: item.image_url || 'https://via.placeholder.com/150' }} 
                style={styles.tileImage} 
              />
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.weightText}> {item.weight} </Text>
              <Text style={styles.priceText}> {item.price} </Text>
            </TouchableOpacity>
          )}
        />
      </ImageBackground>
    </View>
  );
};

export default Fertilizer;