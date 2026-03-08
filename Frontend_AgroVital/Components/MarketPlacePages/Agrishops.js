import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ImageBackground, TextInput } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import styles from '../../Styles/AgrishopsStyles';

const Agrishops = ({ navigation }) => {
  const [agrishops, setAgrishops] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAgrishops, setFilteredAgrishops] = useState([]);

  useEffect(() => {
    const fetchAgrishops = async () => {
      try {
        const agrishopSnap = await getDocs(collection(db, "agrishops"));
        const agrishopData = agrishopSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAgrishops(agrishopData);
        setFilteredAgrishops(agrishopData);
      } catch (error) {
        console.error("Error fetching Agrishops:", error);
      }
    };
    fetchAgrishops();
  }, []);

    // Filter agrishops when search query changes
    useEffect(() => {
      if (searchQuery.trim() === '') {
        setFilteredAgrishops(agrishops);
      } else {
        const lowercasedQuery = searchQuery.toLowerCase();
        const filtered = agrishops.filter(shop => 
          shop.name?.toLowerCase().includes(lowercasedQuery) || 
          shop.location?.toLowerCase().includes(lowercasedQuery)
        );
        setFilteredAgrishops(filtered);
      }
    }, [searchQuery, agrishops]);

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/tea-plantation-2.jpg')} style={styles.backgroundImage}>
        <View style={styles.overlays} />
  
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('MarketPlace')}  style={styles.backArrowContainer}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Agrishops</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or location..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#888"
          />
        </View>

        <FlatList
          data={filteredAgrishops}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.tile} 
              onPress={() => navigation.navigate('AgrishopDetails', { agrishop: item })}
            >
              <Image 
                source={{ uri: item.image_url || 'https://via.placeholder.com/150' }} 
                style={styles.tileImage} 
              />
              <Text style={styles.itemText}>{item.name}</Text>
              <Text>{item.location}</Text>
              <Text>{item.rating}</Text>
            </TouchableOpacity>
          )}
        />
      </ImageBackground>
    </View>
  );
};

export default Agrishops;
