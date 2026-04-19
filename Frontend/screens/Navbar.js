import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Navbar({
  isLoggedIn,
  goToLogin,
  goToRegister,
  goToHome,
  goToAbout,
  goToDiscover,
  goToMatch,
  goToProfile,
  goToMessages,
  goToRequests, 
  currentPage,
}) {
  return (
    <View style={styles.navbar}>

      {/* LOGO */}
      <TouchableOpacity onPress={goToHome}>
        <Text style={styles.logo}>SwapLearn</Text>
      </TouchableOpacity>

      
      <View style={styles.menu}>
        <Text style={styles.link} onPress={goToHome}>Home</Text>
        <Text style={styles.link} onPress={goToAbout}>About</Text>
        <Text style={styles.link} onPress={goToDiscover}>Discover</Text>
        <Text style={styles.link} onPress={goToMatch}>Match</Text>
        
        {isLoggedIn && (
          <Text style={styles.link} onPress={goToMessages}>
            Messages
          </Text>
        )}
    </View>

      {/* RIGHT SIDE */}
      <View style={styles.auth}>
        {!isLoggedIn ? (
          <>
            <TouchableOpacity onPress={goToLogin}>
              <Text style={styles.login}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signupBtn} onPress={goToRegister}>
              <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.rightSection}>

            {currentPage === 'profile' && (
              <TouchableOpacity onPress={goToRequests}>
                <Text style={{ fontSize: 18 }}>🔔</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={goToProfile}>
              <Text style={styles.profile}>Profile</Text>
            </TouchableOpacity>

          </View>
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#151a3c',
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },

  logo: {
    color: '#4CAF50',
    fontSize: 20,
    fontWeight: 'bold',
  },

  menu: {
    flexDirection: 'row',
    gap: 20,
  },

  link: {
    color: 'white',
    fontSize: 14,
  },

  auth: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },

  login: {
    color: 'white',
    fontSize: 14,
  },

  signupBtn: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },

  signupText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  profile: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
