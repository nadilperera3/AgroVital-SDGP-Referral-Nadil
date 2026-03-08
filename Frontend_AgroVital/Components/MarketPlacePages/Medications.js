import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ImageBackground, TextInput } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import styles from '../../Styles/MedicationsStyles';

const Medications = ({ navigation }) => {
  const [medications, setMedications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMedications, setFilteredMedications] = useState([]);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const medicationSnap = await getDocs(collection(db, "medications"));
        const medicationData = medicationSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMedications(medicationData);
        setFilteredMedications(medicationData);
      } catch (error) {
        console.error("Error fetching Medications:", error);
      }
    };
    fetchMedications();
  }, []);

  // Filter medications when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMedications(medications);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = medications.filter(med => 
        med.name?.toLowerCase().includes(lowercasedQuery) || 
        med.type?.toLowerCase().includes(lowercasedQuery) ||
        med.description?.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredMedications(filtered);
    }
  }, [searchQuery, medications]);

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/tea-plantation-2.jpg')} style={styles.backgroundImage}>
        <View style={styles.overlays} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('MarketPlace')} style={styles.backArrowContainer}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Medications</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search medications..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#888"
          />
        </View>

        <FlatList
          data={filteredMedications}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.tile} 
              onPress={() => navigation.navigate('MedicationDetails', { medication: item })}
            >
              <Image 
                source={{ uri: item.image_url || 'https://via.placeholder.com/150' }} 
                style={styles.tileImage} 
              />
              <Text style={styles.itemText}>{item.name}</Text>
              <Text>{item.weight}</Text>
              <Text> {item.price}</Text>
            </TouchableOpacity>
          )}
        />
      </ImageBackground>
    </View>
  );
};

export default Medications;