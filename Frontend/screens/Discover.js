import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Navbar from './Navbar';

export default function Discover(props) {

  const users = [
    { username: 'Rahul', teaches: 'Python', learns: 'UI Design' },
    { username: 'Anjali', teaches: 'Dance', learns: 'Video Editing' },
    { username: 'Kiran', teaches: 'Marketing', learns: 'Coding' },
    { username: 'Sneha', teaches: 'Photography', learns: 'Content Creation' },
    { username: 'Arjun', teaches: 'Java', learns: 'AI' },
    { username: 'Meera', teaches: 'Music', learns: 'Editing' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Navbar {...props} />

      <Text style={styles.title}>Discover People</Text>

      <View style={styles.grid}>
        {users.map((user, index) => (
          <View key={index} style={styles.card}>

            <Text style={styles.username}>{user.username}</Text>

            <Text style={styles.skill}>Teaches: {user.teaches}</Text>
            <Text style={styles.skill}>Learns: {user.learns}</Text>

            <TouchableOpacity
              style={styles.connectBtn}
              onPress={() => {
                if (!props.isLoggedIn) props.goToLogin();
                else alert('Connected!');
              }}
            >
              <Text style={styles.connectText}>Connect</Text>
            </TouchableOpacity>

          </View>
        ))}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f0',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    margin: 20,
    color: '#151a3c',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // 🔥 important
    paddingHorizontal: 10,
  },

  card: {
    width: '30%', // 🔥 THIS MAKES 3 PER ROW
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    elevation: 3,
  },

  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#151a3c',
    marginBottom: 8,
  },

  skill: {
    fontSize: 13,
    color: '#555',
  },

  connectBtn: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },

  connectText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});