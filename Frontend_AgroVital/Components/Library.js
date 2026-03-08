import React from "react";
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import styles from '../Styles/LibraryStyles';

const TeaDiseaseLibrary = () => {
  const navigation = useNavigation();
  const diseasesByStage = [
    {
      stage: "Seedling Stage",
      icon: "🌱",
      route: "Stage1",
      diseases: {
        Fungus: ["Algal Leaf", "Anthracnose"],
        Insect: ["Helopeltis"],
      },
    },
    {
      stage: "Vegetative Stage",
      icon: "🌿",
      route: "Stage2",
      diseases: {
        Fungus: [
          "Bird Eye Spot",
          "Brown Eye Spot",
          "Brown Blight",
          "Gray Blight",
        ],
      },
    },
    {
      stage: "Flowering Stage",
      icon: "🌸",
      route: "Stage3",
      diseases: {
        Fungus: ["Red Leaf Spot", "White Spot"],
      },
    },
    {
      stage: "Fruiting Stage",
      icon: "🍃",
      route: "Stage4",
      diseases: {
        Fungus: ["Bird Eye Spot", "Brown Eye Spot"],
      },
    },
  ];

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/tea-plantation-2.jpg')}
        style={styles.backgroundImage}
      >
        <View style={styles.overlays} />
      <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrowContainer}>
                <Text style={styles.backButton}>←</Text>
            </TouchableOpacity>
        <Text style={styles.title}>Disease Library</Text>
      </View>

      <ScrollView style={styles.content}>
        {diseasesByStage.map((stage, index) => (
          <View key={index} style={styles.stageContainer}>
            <View style={styles.stageHeader}>
              <Text style={styles.stageIcon}>{stage.icon}</Text>
              <Text style={styles.stageTitle}>{stage.stage}</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate(stage.route)}
                style={styles.button}
              >
                <Text style={styles.seeMore}>See More</Text>
              </TouchableOpacity>
            </View>

            {Object.entries(stage.diseases).map(([category, diseases], i) => (
              <View key={i} style={styles.diseaseCategory}>
                <Text style={styles.categoryTitle}>{category}</Text>
                {diseases.map((disease, j) => (
                  <Text key={j} style={styles.diseaseName}>
                    {j + 1}. {disease}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      </ImageBackground>
    </View>
  );
};

export default TeaDiseaseLibrary;