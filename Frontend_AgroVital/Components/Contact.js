import React from 'react';
import { View, Text, TouchableOpacity, Image, Linking } from 'react-native';
import {ImageBackground} from 'react-native';
import styles from '../Styles/ContactStyles';

const ContactSocial = ({ navigation }) => {
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
            <Text style={styles.headerTitle}>Contact & Social media</Text>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Social Media</Text>
            <TouchableOpacity style={styles.item} onPress={() => Linking.openURL('https://www.facebook.com/profile.php?id=61573623173725')}>
              <Image source={require('../assets/facebook.png')} style={styles.icon} />
            <Text style={styles.itemText}>facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={() => Linking.openURL('https://www.instagram.com/team_agrovital/')}>
              <Image source={require('../assets/instargram.png')} style={styles.icon} />
            <Text style={styles.itemText}>Instagram</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={() => Linking.openURL('https://www.youtube.com/@AgroVital-p7l ')}>
              <Image source={require('../assets/youtube.png')} style={styles.icon} />
            <Text style={styles.itemText}>Youtube</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={() => Linking.openURL('https://www.linkedin.com/in/agrovital-013391343/')}>
              <Image source={require('../assets/linkedin.png')} style={styles.icon} />
            <Text style={styles.itemText}>LinkedIn</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact</Text>
            <TouchableOpacity style={styles.item} onPress={() => Linking.openURL('https://agrovital.lk/')}>
              <Image source={require('../assets/web.png')} style={styles.icon} />
              <Text style={styles.itemText}>Website</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={() => Linking.openURL('mailto:teamagrovital@gmail.com')}>
              <Image source={require('../assets/email.png')} style={styles.icon} />
              <Text style={styles.itemText}>Send us an e-mail</Text>
            </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
    
  );
};

export default ContactSocial;
