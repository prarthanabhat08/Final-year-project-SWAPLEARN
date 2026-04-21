import React from 'react';

import { TouchableOpacity } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Navbar from './Navbar';

export default function About(props) {

  return (
    <ScrollView style={styles.container}>

      <Navbar {...props} currentPage="about" />

      <View style={styles.hero}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => props.goToHome()}
        >
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.heroTitle}>About</Text>
        <Text style={styles.heroHighlight}>SwapLearn</Text>

        <Text style={styles.subtitle}>
          Learn • Teach • Grow Together
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Our Mission</Text>
        <Text style={styles.cardText}>
          Build a student-powered learning community where knowledge is shared freely.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>How It Works</Text>
        <Text style={styles.cardText}>
          • Teach skills & earn credits{"\n"}
          • Use credits to learn new skills{"\n"}
          • Match with like-minded learners{"\n"}
          • Grow together
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Why SwapLearn?</Text>
        <Text style={styles.cardText}>
          No money. No barriers. Just skills exchange.
          Learning becomes accessible, fun, and community-driven.
        </Text>
      </View>

      <View style={styles.featuresRow}>
        <View style={styles.featureBox}>
          <Text style={styles.featureNumber}>100+</Text>
          <Text style={styles.featureText}>Skills</Text>
        </View>

        <View style={styles.featureBox}>
          <Text style={styles.featureNumber}>1K+</Text>
          <Text style={styles.featureText}>Users</Text>
        </View>

        <View style={styles.featureBox}>
          <Text style={styles.featureNumber}>∞</Text>
          <Text style={styles.featureText}>Learning</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © SwapLearn. All rights reserved.
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f0',
  },

  backButton: {
    position: 'absolute',
    top: 10,
    left: 20,

    backgroundColor: '#3fad48',  
    padding: 8,
    borderRadius: 10,

    elevation: 3,
  },

  backText: {
    fontSize: 12,
    color: '#151a3c', 
    fontWeight: 'bold',
  },

  hero: {
    alignItems: 'center',
    paddingVertical: 60,
  },

  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#151a3c',
  },

  heroHighlight: {
    fontSize: 42,
    color: '#4CAF50',
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#555',
    marginTop: 10,
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 20,
    borderRadius: 15,
    elevation: 4,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#151a3c',
    marginBottom: 8,
  },

  cardText: {
    color: '#666',
    lineHeight: 22,
  },

  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 10,
  },

  featureBox: {
    backgroundColor: '#151a3c',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    width: '28%',
  },

  featureNumber: {
    color: '#4CAF50',
    fontSize: 22,
    fontWeight: 'bold',
  },

  featureText: {
    color: '#fff',
    marginTop: 5,
  },

  footer: {
    alignItems: 'center',
    padding: 25,
  },

  footerText: {
    color: '#888',
  },
});
