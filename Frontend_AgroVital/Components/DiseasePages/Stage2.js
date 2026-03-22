import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
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
    'Bird Eye Spot': {
      type: 'Fungal',
      images: [
        require('../../assets/AlgalLeaf_1.jpg'),
        require('../../assets/AlgalLeaf_1.jpg'),
        require('../../assets/AlgalLeaf_1.jpg'),
        require('../../assets/AlgalLeaf_1.jpg'),
      ],
      description: 'Bird Eye Spot is a common fungal disease in tea plantations, characterized by distinctive circular spots resembling bird eyes on tea leaves.',
      symptoms: [
        'Small circular spots with gray centers and dark brown margins',
        'Spots typically 2-3 mm in diameter',
        'Leaves may appear scorched',
        'Potential leaf yellowing and premature defoliation'
      ],
      causes: [
        'High humidity',
        'Poor air circulation',
        'Dense canopy',
        'Prolonged leaf wetness'
      ],
      medications: [
        {
          name: 'Carbendazim-based fungicides',
          application: 'Spray at first sign of infection',
          dosage: '1-1.5 ml per liter of water'
        },
        {
          name: 'Copper oxychloride',
          application: 'Apply preventatively',
          dosage: '2-3 grams per liter of water'
        }
      ],
      prevention: [
        'Maintain proper plant spacing',
        'Prune for better air circulation',
        'Avoid overhead irrigation',
        'Use resistant tea varieties'
      ]
    },
    'Brown Eye Spot': {
      type: 'Fungal',
      images: [
        require('../../assets/AlgalLeaf_1.jpg'),
        require('../../assets/AlgalLeaf_1.jpg'),
        require('../../assets/AlgalLeaf_1.jpg'),
        require('../../assets/AlgalLeaf_1.jpg'),
      ],
      description: 'Brown Eye Spot is a destructive fungal disease causing significant damage to tea leaves, creating distinctive brown lesions.',
      symptoms: [
        'Circular to oval brown spots with lighter centers',
        'Spots surrounded by yellow halos',
        'Potential leaf necrosis',
        'Reduced photosynthetic area'
      ],
      causes: [
        'High moisture environments',
        'Poor soil drainage',
        'Overcrowded tea plants',
        'Infected plant material'
      ],
      medications: [
        {
          name: 'Tebuconazole',
          application: 'Spray during early disease stages',
          dosage: '1 ml per liter of water'
        },
        {
          name: 'Propiconazole',
          application: 'Apply as a preventive measure',
          dosage: '1.5 ml per liter of water'
        }
      ],
      prevention: [
        'Practice crop rotation',
        'Remove infected plant debris',
        'Maintain proper plant nutrition',
        'Use disease-resistant cultivars'
      ]
    },
    'Brown Blight': {
      type: 'Fungal',
      images: [
        require('../../assets/AlgalLeaf_1.jpg'),
        require('../../assets/AlgalLeaf_1.jpg'),
        require('../../assets/AlgalLeaf_1.jpg'),
        require('../../assets/AlgalLeaf_1.jpg'),
      ],
      description: 'Brown Blight is a severe fungal disease causing extensive damage to tea leaves, characterized by brown lesions and rapid leaf deterioration.',
      symptoms: [
        'Large brown lesions on leaves',
        'Rapid leaf decay',
        'Reduced plant vigor',
        'Potential complete defoliation'
      ],
      causes: [
        'High rainfall and humidity',
        'Poor canopy management',
        'Inadequate plant nutrition',
        'Continuous moisture on leaves'
      ],
      medications: [
        {
          name: 'Azoxystrobin',
          application: 'Spray at early disease detection',
          dosage: '1-1.5 ml per liter of water'
        },
        {
          name: 'Mancozeb',
          application: 'Apply as a protective fungicide',
          dosage: '2.5 grams per liter of water'
        }
      ],
      prevention: [
        'Improve drainage',
        'Maintain proper plant spacing',
        'Regular pruning',
        'Use balanced fertilization'
      ]
    },
    'Gray Blight': {
      type: 'Fungal',
      images: [
        require('../../assets/AlgalLeaf_1.jpg'),
        require('../../assets/AlgalLeaf_1.jpg'),
        require('../../assets/AlgalLeaf_1.jpg'),
        require('../../assets/AlgalLeaf_1.jpg'),
      ],
      description: 'Gray Blight is a persistent fungal disease causing gray-colored lesions on tea leaves, leading to significant yield reduction.',
      symptoms: [
        'Gray to silvery circular spots on leaves',
        'Dark margins around lesions',
        'Potential leaf yellowing',
        'Extensive leaf damage'
      ],
      causes: [
        'High humidity',
        'Poor air circulation',
        'Extended leaf wetness',
        'Infected plant debris'
      ],
      medications: [
        {
          name: 'Hexaconazole',
          application: 'Spray during initial infection stages',
          dosage: '1 ml per liter of water'
        },
        {
          name: 'Chlorothalonil',
          application: 'Apply as a broad-spectrum fungicide',
          dosage: '2 ml per liter of water'
        }
      ],
      prevention: [
        'Implement proper pruning techniques',
        'Ensure adequate plant spacing',
        'Remove diseased plant material',
        'Use fungicide-resistant cultivars'
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
          <Text style={styles.headerTitle}>Vegetative Stage Diseases</Text>
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