import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Navbar from './Navbar';
export default function Home({
  isLoggedIn,
  goToLogin,
  goToRegister,
  goToHome,
  goToAbout,
  goToDiscover,
  goToMatch,
  goToMessages,
  goToProfile,
  goToRequests, 
  
}) {
  return (


    <ScrollView style={styles.container}>

      {/* NAVBAR */}
     <Navbar
  isLoggedIn={isLoggedIn}
  goToLogin={goToLogin}
  goToRegister={goToRegister}
  goToHome={goToHome}
  goToAbout={goToAbout}
  goToDiscover={goToDiscover}
  goToMatch={goToMatch}
  goToMessages={goToMessages} 
  goToProfile={goToProfile}
  
/>

      {/* HERO SECTION */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Teach, Learn,</Text>
        <Text style={styles.heroHighlight}>Grow Together</Text>

        <Text style={styles.subtitle}>
          Share your knowledge and learn from peers
        </Text>

        <View style={styles.heroButtons}>
  <TouchableOpacity style={styles.primaryBtn} onPress={goToDiscover}>
    <Text style={styles.primaryText}>Discover</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.secondaryBtn} onPress={goToMatch}>
    <Text style={styles.secondaryText}>Match</Text>
  </TouchableOpacity>
</View>
      </View>

      {/* FEATURES */}
      <View style={styles.features}>
        {['Become a Teacher', 'Learn from Peers', 'Diverse Skills'].map(
          (item, i) => (
            <View key={i} style={styles.card}>
              <Text style={styles.cardTitle}>{item}</Text>
              <Text style={styles.cardText}>
                Share and grow knowledge with learners.
              </Text>
            </View>
          )
        )}
      </View>

      {/* LESSONS */}
 {/* LESSONS */}
<Text style={styles.sectionTitle}>Available Lessons</Text>

<View style={styles.lessons}>
  {[
    { title: 'Python' },
    { title: 'Dance' },
    { title: 'Video Editing' },
    {title: 'Digital marketing' },
    {title: 'Content creation' },
  ].map((item, index) => (
    <View key={index} style={styles.lessonCard}>
      <Text style={styles.lessonTitle}>{item.title}</Text>
      <Text style={styles.lessonText}>
        Learn something new and improve your skills.
      </Text>

      <TouchableOpacity
  style={styles.lessonBtn}
  onPress={() => {
    if (!isLoggedIn) {
      goToLogin();   
    } else {
      alert('Request Sent!'); 
    }
  }}
>
  <Text style={styles.lessonBtnText}>
    {isLoggedIn ? 'Request' : 'Get Started'}
  </Text>
</TouchableOpacity>
    </View>
  ))}
</View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ©swapLearn. All rights reserved.
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

  /* HERO */
  hero: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },

  heroTitle: {
    fontSize: 40,
    color: '#151a3c', 
    fontWeight: '300',
  },

  heroHighlight: {
    fontSize: 44,
    color: '#4CAF50', 
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#555',
    textAlign: 'center',
    marginTop: 15,
    maxWidth: 500,
  },

  heroButtons: {
    flexDirection: 'row',
    marginTop: 25,
    gap: 15,
  },

  primaryBtn: {
    backgroundColor: '#151a3c', 
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },

  primaryText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  secondaryBtn: {
    backgroundColor: '#4CAF50', // ✅ green
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },

  secondaryText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  /* FEATURES */
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 30,
  },

  card: {
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 12,
    width: '28%',
    alignItems: 'center',
    elevation: 3,
  },

  cardTitle: {
    color: '#151a3c',
    fontSize: 18,
    fontWeight: 'bold',
  },

  cardText: {
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },

  /* LESSONS */
  sectionTitle: {
    color: '#151a3c',
    fontSize: 30,
    textAlign: 'center',
    marginTop: 30,
    fontWeight: 'bold',
  },

lessons: {
  flexDirection: 'row',
  flexWrap: 'wrap', // 🔥 important for mobile
  justifyContent: 'center',
  padding: 20,
},

lessonCard: {
  backgroundColor: '#ffffff',
  padding: 20,
  borderRadius: 12,
  width: 250, // 🔥 fixed width (better than %)
  margin: 10,
  elevation: 3,
},

  lessonTitle: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
  },

  lessonText: {
    color: '#666',
    marginVertical: 10,
  },

  lessonBtn: {
    backgroundColor: '#151a3c',
    padding: 10,
    borderRadius: 8,
  },

  lessonBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  /* FOOTER */
  footer: {
    alignItems: 'center',
    padding: 20,
  },

  footerText: {
    color: '#888',
  },
});