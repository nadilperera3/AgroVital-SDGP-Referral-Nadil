import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ImageBackground, TextInput } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import styles from '../../Styles/EquipmentsStyles';

const Equipments = ({ navigation }) => {
  const [equipments, setEquipments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEquipments, setFilteredEquipments] = useState([]);

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const equipmentSnap = await getDocs(collection(db, "equipments"));
        const equipmentData = equipmentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEquipments(equipmentData);
        setFilteredEquipments(equipmentData);
      } catch (error) {
        console.error("Error fetching Equipments:", error);
      }
    };
    fetchEquipments();
  }, []);

  // Filter equipments when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEquipments(equipments);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = equipments.filter(equip => 
        equip.name?.toLowerCase().includes(lowercasedQuery) || 
        equip.category?.toLowerCase().includes(lowercasedQuery) ||
        equip.description?.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredEquipments(filtered);
    }
  }, [searchQuery, equipments]);

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/tea-plantation-2.jpg')} style={styles.backgroundImage}>
        <View style={styles.overlays} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('MarketPlace')} style={styles.backArrowContainer}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Equipments</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search equipment..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#888"
          />
        </View>

        <FlatList
          data={filteredEquipments}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.tile} 
              onPress={() => navigation.navigate('EquipmentDetails', { equipment: item })}
            >
              <Image 
                source={{ uri: item.image_url || 'https://via.placeholder.com/150' }} 
                style={styles.tileImage} 
              />
              <Text style={styles.itemText}>{item.name}</Text>
              <Text> {item.price}</Text>
            </TouchableOpacity>
          )}
        />
      </ImageBackground>
    </View>
  );
};

export default Equipments;