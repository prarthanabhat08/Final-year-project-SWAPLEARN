import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Navbar from './Navbar';

export default function Match({ user, isLoggedIn, ...props }) {

  const [matches, setMatches] = useState([]);

  useEffect(() => {
    if (!user) return;

    fetch(`http://127.0.0.1:8000/api/match/${user.user_id}/`)
      .then(res => res.json())
      .then(data => setMatches(data))
      .catch(err => console.log(err));
  }, [user]);

  const sendRequest = async (m) => {
    if (!isLoggedIn) {
      props.goToLogin();
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/send-request/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_id: user.user_id,
          receiver_id: m.user_id,
          skill: m.skill,
          language: m.language,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Request Sent 🚀");
      } else {
        alert(data.error);
      }

    } catch (err) {
      console.log(err);
      alert("Server error ❌");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Navbar isLoggedIn={isLoggedIn} {...props} />

      <Text style={styles.title}>Best Matches</Text>

      {!user ? (
        <Text style={styles.noMatch}>Login to see matches</Text>
      ) : matches.length === 0 ? (
        <Text style={styles.noMatch}>No matches found</Text>
      ) : (
        <View style={styles.grid}>
          {matches.map((m, i) => (
            <View key={i} style={styles.card}>

              <Text style={styles.username}>{m.name}</Text>

              <Text style={styles.tag}>Teaches: {m.skill}</Text>
              <Text style={styles.tagAlt}>Language: {m.language}</Text>

              <TouchableOpacity
                style={styles.connectBtn}
                onPress={() => sendRequest(m)}
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
  title: { fontSize: 28, textAlign: 'center', margin: 20 },
  noMatch: { textAlign: 'center', color: 'gray' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  card: { backgroundColor: '#fff', padding: 20, margin: 10, borderRadius: 10 },
  username: { fontWeight: 'bold', fontSize: 18 },
  tag: { marginTop: 5 },
  tagAlt: { marginBottom: 10 },
  connectBtn: { backgroundColor: '#151a3c', padding: 10, borderRadius: 10 },
  connectText: { color: '#fff', textAlign: 'center' },
});