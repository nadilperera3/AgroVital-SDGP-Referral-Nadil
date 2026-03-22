import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, ImageBackground } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import styles from '../../Styles/MarketPlaceStyles'; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MarketPlace = ({ navigation }) => {
  const [agrishops, setAgrishops] = useState([]);
  const [fertilizers, setFertilizers] = useState([]);
  const [medications, setMedications] = useState([]);
  const [equipments, setEquipments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const agrishopSnap = await getDocs(collection(db, "agrishops"));
        setAgrishops(agrishopSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const fertilizerSnap = await getDocs(collection(db, "fertilizer"));
        setFertilizers(fertilizerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const medicationSnap = await getDocs(collection(db, "medications"));
        setMedications(medicationSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const equipmentSnap = await getDocs(collection(db, "equipments"));
        setEquipments(equipmentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to render category tiles
  const renderCategoryItems = (title, data, navigateTo, icon, category) => (
    <View style={styles.section}>
      <View style={styles.headerContainer}>
        <Image source={icon} style={styles.SectionHeaderIcon} />
        <Text style={styles.sectionHeader}>{title}</Text>
        <TouchableOpacity onPress={() => navigation.navigate(navigateTo)} >  
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal style={styles.categoryContainer}>
        {data.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.tile}
            onPress={() => {
              // Navigate to the appropriate details page based on category
              if (category === "agrishops") {
                navigation.navigate('AgrishopDetails', { agrishop: item });
              } else if (category === "fertilizer") {
                navigation.navigate('FertilizerDetails', { fertilizer: item });
              } else if (category === "medications") {
                navigation.navigate('MedicationDetails', { medication: item });
              } else if (category === "equipments") {
                navigation.navigate('EquipmentDetails', { equipment: item });
              }
            }}
          >
            <Image source={{ uri: item.image_url }} style={styles.tileImage} />
            <Text style={styles.itemName}>{item.name}</Text>
  
            {/* Conditionally display attributes based on the category */}
            {category === "agrishops" && (
              <>
                <Text> {item.location}</Text>
                <Text> {item.rating}</Text>
              </>
            )}
            
            {category === "fertilizer" && (
              <>
                <Text> {item.weight}</Text>
                <Text> {item.price}</Text>
              </>
            )}
  
            {category === "medications" && (
              <>
                <Text> {item.weight}</Text>
                <Text> {item.price}</Text>
              </>
            )}
  
            {category === "equipments" && (
              <>
                <Text>{item.price}</Text>
              </>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
  

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/tea-plantation-2.jpg')} style={styles.backgroundImage}>
        <View style={styles.overlays} />
  
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}  style={styles.backArrowContainer}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Market Place</Text>
        </View>
  
        {/* Content */}
        <ScrollView style={styles.shopContainer}>
          {renderCategoryItems("Agrishops", agrishops, "Agrishops", require('../../assets/AgriShop.png'), "agrishops")}
          {renderCategoryItems("Fertilizers", fertilizers, "Fertilizers", require('../../assets/Feritilizer.png'), "fertilizer")}
          {renderCategoryItems("Medications", medications, "Medications", require('../../assets/Medication.png'), "medications")}
          {renderCategoryItems("Equipments", equipments, "Equipments", require('../../assets/Equipment.png'), "equipments")}
        </ScrollView>


        {/* Bottom Navigation Bar */}
        <View style={styles.bottomNavBar}>
          <TouchableOpacity style={[styles.navItem]} onPress={() => navigation.navigate('Home')}>
            <Icon name="sprout" size={24} color="#444" />
            <Text style={styles.navText}>Crop</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('MainCommunityScreen')}>
            <Icon name="account-group" size={24} color="#444" />
            <Text style={styles.navText}>Community</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.navItem, styles.activeNavItem]} onPress={() => navigation.navigate('MarketPlace')}>
            <Icon name="store" size={24} color="rgb(1, 77, 29)" />
            <Text style={[styles.navText]}>Shop</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ProfileSave')}>
            <Icon name="account" size={24} color="#444" />
            <Text style={styles.navText}>You</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
  
};

export default MarketPlace;
