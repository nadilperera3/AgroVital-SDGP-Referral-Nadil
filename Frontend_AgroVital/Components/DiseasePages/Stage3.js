import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  ImageBackground,
  Image,
  FlatList,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import styles from '../../Styles/StageStyles';


const { width } = Dimensions.get('window');

const DiseaseDetails = () => {
  const navigation = useNavigation();
  const [selectedDisease, setSelectedDisease] = useState(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  
  const AnimatedFlatList = useMemo(() => Animated.createAnimatedComponent(FlatList), []);
  

  const diseases = {
    'Red Leaf Spot': {
      type: 'Fungal',
      images: [
        require('../../assets/AlgalLeaf_1.jpg'),
        require('../../assets/AlgalLeaf_1.jpg'),
        require('../../assets/AlgalLeaf_1.jpg'),
        require('../../assets/AlgalLeaf_1.jpg'),
      ],
      description: 'Red Leaf Spot is a fungal disease that causes distinctive reddish-brown lesions on tea leaves during the flowering stage, potentially reducing plant vigor and yield.',
      symptoms: [
        'Circular to oval reddish-brown spots on leaves',
        'Spots may have lighter centers',
        'Potential leaf yellowing and premature leaf drop',
        'Reduced photosynthetic area'
      ],
      causes: [
        'High humidity',
        'Prolonged leaf wetness',
        'Poor air circulation',
        'Inadequate plant nutrition'
      ],
      medications: [
        {
          name: 'Carbendazim-based fungicides',
          application: 'Spray at first detection',
          dosage: '1-1.5 ml per liter of water'
        },
        {
          name: 'Tebuconazole',
          application: 'Apply preventatively and curatively',
          dosage: '1 ml per liter of water'
        }
      ],
      prevention: [
        'Maintain proper plant spacing',
        'Ensure good air circulation',
        'Avoid overhead irrigation',
        'Remove and destroy infected leaves'
      ]
    },
    'White Spot': {
      type: 'Fungal',
      images: [
        require('../../assets/AlgalLeaf_1.jpg'),
        require('../../assets/AlgalLeaf_1.jpg'),
        require('../../assets/AlgalLeaf_1.jpg'),
        require('../../assets/AlgalLeaf_1.jpg'),
      ],
      description: 'White Spot disease is characterized by white, circular lesions on tea leaves, which can significantly impact the plant\'s photosynthetic capacity during the flowering stage.',
      symptoms: [
        'Small, circular white to grayish spots on leaves',
        'Spots may have dark borders',
        'Potential coalescence of spots',
        'Reduced leaf function and plant vigor'
      ],
      causes: [
        'High moisture conditions',
        'Dense canopy',
        'Poor plant nutrition',
        'Lack of sunlight exposure'
      ],
      medications: [
        {
          name: 'Copper-based fungicides',
          application: 'Spray every 10-14 days',
          dosage: '2-3 ml per liter of water'
        },
        {
          name: 'Azoxystrobin',
          application: 'Apply as preventive and curative treatment',
          dosage: '1 ml per liter of water'
        }
      ],
      prevention: [
        'Improve plant spacing',
        'Ensure proper pruning',
        'Maintain balanced fertilization',
        'Remove infected plant material'
      ]
    }
  };

  const ImageCarousel = ({ images }) => {
      const [currentIndex, setCurrentIndex] = useState(0);
      const flatListRef = useRef(null);
      const autoPlayRef = useRef(null);
    
      // Function to move to the next image
      const nextImage = useCallback(() => {
        if (currentIndex < images.length - 1) {
          flatListRef.current?.scrollToIndex({
            index: currentIndex + 1,
            animated: true
          });
          setCurrentIndex(currentIndex + 1);
        } else {
          flatListRef.current?.scrollToIndex({
            index: 0,
            animated: true
          });
          setCurrentIndex(0);
        }
      }, [currentIndex, images.length]);
    
      // Function to move to the previous image
      const prevImage = useCallback(() => {
        if (currentIndex > 0) {
          flatListRef.current?.scrollToIndex({
            index: currentIndex - 1,
            animated: true
          });
          setCurrentIndex(currentIndex - 1);
        }
      }, [currentIndex]);
    
      // Auto-play functionality
      useEffect(() => {
        autoPlayRef.current = setInterval(() => {
          nextImage();
        }, 2800); // Change image every 3 seconds
    
        return () => {
          if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
          }
        };
      }, [nextImage]);
    
      // Handle manual scroll
      const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        {
          useNativeDriver: false,
          listener: (event) => {
            const slideSize = event.nativeEvent.layoutMeasurement.width;
            const index = event.nativeEvent.contentOffset.x / slideSize;
            const roundIndex = Math.round(index);
            setCurrentIndex(roundIndex);
          },
        }
      );
    
      // Reset interval on manual interaction
      const handleScrollBegin = () => {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current);
        }
      };
    
      const handleScrollEnd = () => {
        autoPlayRef.current = setInterval(() => {
          nextImage();
        }, 3000);
      };
    
      return (
        <View style={styles.carouselContainer}>
  
          <AnimatedFlatList
            ref={flatListRef}
            data={images}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            onScroll={handleScroll}
            onScrollBeginDrag={handleScrollBegin}
            onScrollEndDrag={handleScrollEnd}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                <Image 
                  source={item} 
                  style={styles.carouselImage}
                  resizeMode="cover"
                />
              </View>
            )}
          />
    
          <View style={styles.pagination}>
            {images.map((_, index) => {
              const inputRange = [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ];
              
              const scale = scrollX.interpolate({
                inputRange,
                outputRange: [1, 1.5, 1],
                extrapolate: 'clamp',
              });
              
              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.3, 1, 0.3],
                extrapolate: 'clamp',
              });
              
              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.dot,
                    {
                      opacity,
                      transform: [{ scale }]
                    }
                  ]}
                />
              );
            })}
          </View>
        </View>
      );
    };
  
  const renderDiseaseDetails = (diseaseName) => {
    const disease = diseases[diseaseName];
    return (
      <View style={styles.detailContainer}>
        <Text style={styles.diseaseTitle}>{diseaseName}</Text>
        <Text style={styles.diseaseType}>Type: {disease.type}</Text>

        <ImageCarousel images={disease.images} />
        
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.sectionContent}>{disease.description}</Text>
        
        <Text style={styles.sectionTitle}>Symptoms</Text>
        {disease.symptoms.map((symptom, index) => (
          <Text key={index} style={styles.listItem}>• {symptom}</Text>
        ))}
        
        <Text style={styles.sectionTitle}>Causes</Text>
        {disease.causes.map((cause, index) => (
          <Text key={index} style={styles.listItem}>• {cause}</Text>
        ))}
        
        <Text style={styles.sectionTitle}>Medications</Text>
        {disease.medications.map((med, index) => (
          <View key={index} style={styles.medicationItem}>
            <Text style={styles.medicationName}>{med.name}</Text>
            <Text style={styles.medicationDetails}>Application: {med.application}</Text>
            <Text style={styles.medicationDetails}>Dosage: {med.dosage}</Text>
          </View>
        ))}
        
        <Text style={styles.sectionTitle}>Prevention</Text>
        {disease.prevention.map((prev, index) => (
          <Text key={index} style={styles.listItem}>• {prev}</Text>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
        <ImageBackground
        source={require('../../assets/tea-plantation-2.jpg')}
        style={styles.backgroundImage}
      >
        <View style={styles.overlays} />
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrowContainer}>
                <Text style={styles.backButton}>←</Text>
            </TouchableOpacity>
          <Text style={styles.headerTitle}>Flowering Stage Diseases</Text>
        </View>
        <ScrollView>
        {Object.keys(diseases).map((diseaseName, index) => (
          <TouchableOpacity 
            key={index}
            onPress={() => setSelectedDisease(selectedDisease === diseaseName ? null : diseaseName)}
            style={styles.diseaseCard}
          >
            <Text style={styles.diseaseName}>{diseaseName}</Text>
            {selectedDisease === diseaseName && renderDiseaseDetails(diseaseName)}
          </TouchableOpacity>
        ))}
      </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default DiseaseDetails;