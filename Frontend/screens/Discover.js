import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Navbar from './Navbar';

export default function Discover({ user, isLoggedIn, ...props }) {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:8000/api/discover/${user.user_id}/`)
      .then(res => res.json())
      .then(data => {
        console.log("DISCOVER DATA:", data);
        setUsers(data);
      })
      .catch(err => console.log(err));
  }, [user]);

  return (
    <ScrollView style={styles.container}>
      <Navbar isLoggedIn={isLoggedIn} {...props} currentPage="discover" />

      <Text style={styles.title}>Discover People</Text>

      {!user ? (
        <Text style={styles.noUser}>Login to explore users</Text>
      ) : users.length === 0 ? (
        <Text style={styles.noUser}>No users found</Text>
      ) : (
        <View style={styles.grid}>
          {users.map((u) => (
            <View key={u.user_id} style={styles.card}>

              <Text style={styles.name}>{u.name}</Text>

              <View style={styles.tag}>
                <Text style={styles.tagText}>
                  Teaches: {u.teach.length ? u.teach.join(', ') : 'None'}
                </Text>
              </View>

              <View style={styles.tagAlt}>
                <Text style={styles.tagTextAlt}>
                  Learns: {u.learn.length ? u.learn.join(', ') : 'None'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.connectBtn}
                onPress={() => {
                  if (!isLoggedIn) props.goToLogin();
                  else alert(`View profile of ${u.name}`);
                }}
              >
                <Text style={styles.connectText}>Connect</Text>
              </TouchableOpacity>

            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f0' },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#151a3c',
  },

  noUser: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  card: {
    backgroundColor: '#fff',
    width: 260,
    padding: 20,
    margin: 12,
    borderRadius: 15,
    elevation: 5,
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#151a3c',
    marginBottom: 8,
  },

  tag: {
    backgroundColor: '#151a3c',
    padding: 6,
    borderRadius: 8,
    marginBottom: 6,
  },

  tagAlt: {
    backgroundColor: '#4CAF50',
    padding: 6,
    borderRadius: 8,
    marginBottom: 10,
  },

  tagText: { color: '#fff', fontSize: 12 },
  tagTextAlt: { color: '#fff', fontSize: 12 },

  connectBtn: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  connectText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
