import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Navbar from './Navbar';

export default function Discover({ user, isLoggedIn, ...props }) {

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [connections, setConnections] = useState({});

  useEffect(() => {

    fetch(`http://localhost:8000/api/discover/${user?.user_id || 0}/`)
      .then(res => res.json())
      .then(data => {
        console.log("DISCOVER DATA:", data);
        setUsers(data);
      })
      .catch(err => console.log(err));
  }, [user]);


  const toggleConnect = async (u) => {
    if (!isLoggedIn) {
      props.goToLogin();
      return;
    }

    if (connections[u.user_id]) {
      setConnections(prev => {
        const updated = { ...prev };
        delete updated[u.user_id];
        return updated;
      });

      alert("Request Cancelled ");

      return;
    }

    try {
      await fetch("http://localhost:8000/api/send-request/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_id: user.user_id,
          receiver_id: u.user_id,
          skill: u.teach?.[0] || "General",
          language: "English",
        }),
      });

      setConnections(prev => ({
        ...prev,
        [u.user_id]: true
      }));

      alert("Request Sent ");

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      
      <ScrollView style={styles.container}>
  
        <Navbar isLoggedIn={isLoggedIn} {...props} currentPage="discover" />

        <View style={styles.hero}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => props.goToHome()}
          >
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Discover People</Text>

        {users.length === 0 ? (
          <Text style={styles.noUser}>No users found</Text>
        ) : (
          <View style={styles.grid}>
            {users.map((u) => (
              <View key={u.user_id} style={styles.card}>

                <Text style={styles.name}>{u.name}</Text>

                <Text style={styles.credits}>
                  Credits: {u.credits || 0}
                </Text>

                <Text style={styles.info}>
                  Teaches: {u.teach?.join(', ') || 'None'}
                </Text>

                <Text style={styles.info}>
                  Learns: {u.learn?.join(', ') || 'None'}
                </Text>

                <TouchableOpacity
                  style={styles.viewBtn}
                  onPress={() => setSelectedUser(u)}
                >
                  <Text style={styles.btnText}>View Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.connectBtn}
                  onPress={() => {
                    if (!isLoggedIn) {
                      alert("Please login to connect");
                      props.goToLogin();
                      return;
                    }
                    toggleConnect(u);
                  }}
                >
                  <Text style={styles.btnText}>
                    {connections[u.user_id] ? 'Cancel Request' : 'Connect'}
                  </Text>
                </TouchableOpacity>

              </View>
            ))}
          </View>
        )}

      </ScrollView> 

      <Modal visible={!!selectedUser} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          {selectedUser && (
            <View style={styles.modalCard}>

              <View style={styles.topRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {selectedUser.name?.charAt(0).toUpperCase()}
                  </Text>
                </View>

                <View>
                  <Text style={styles.modalName}>
                    {selectedUser.name}
                  </Text>
                  <Text style={styles.username}>
                    @{selectedUser.name?.toLowerCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>
                    {selectedUser.credits || 0}
                  </Text>
                  <Text style={styles.statLabel}>Credits</Text>
                </View>

                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>
                    {selectedUser.teach?.length || 0}
                  </Text>
                  <Text style={styles.statLabel}>Taught</Text>
                </View>

                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>
                    {selectedUser.learn?.length || 0}
                  </Text>
                  <Text style={styles.statLabel}>Learned</Text>
                </View>
              </View>

              <Text style={styles.section}>Email</Text>
              <Text style={styles.detail}>
                {selectedUser.email || 'No email'}
              </Text>

              <Text style={styles.section}>Skills They Teach</Text>
              <Text style={styles.detail}>
                {selectedUser.teach?.join(', ') || 'None'}
              </Text>

              <Text style={styles.section}>Skills They Learn</Text>
              <Text style={styles.detail}>
                {selectedUser.learn?.join(', ') || 'None'}
              </Text>

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setSelectedUser(null)}
              >
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>

            </View>
          )}
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f0' },
  hero: { height: 50, justifyContent: 'center' },

  requestText: {
    marginTop: 5,
    color: '#22c55e',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCard: {
    width: '75%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
  },

  topRow: { flexDirection: 'row', marginBottom: 20, alignItems: 'center' },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#5b5ce2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  avatarText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },

  modalName: { fontSize: 22, fontWeight: 'bold' },

  username: { fontSize: 13, color: '#6b7280' },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  statBox: {
    width: '30%',
    backgroundColor: '#f3f4f6',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  statNumber: { fontSize: 18, fontWeight: 'bold' },

  statLabel: { fontSize: 12, color: '#6b7280' },

  section: { fontSize: 14, fontWeight: 'bold', marginTop: 10 },

  detail: { fontSize: 13, color: '#374151', marginBottom: 8 },

  closeBtn: { marginTop: 10, alignItems: 'center' },

  closeText: { color: 'red', fontWeight: 'bold' },

  backButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    backgroundColor: '#3fad48',
    padding: 8,
    borderRadius: 10,
  },

  backText: { fontSize: 12, color: '#151a3c', fontWeight: 'bold' },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#151a3c',
  },

  noUser: { textAlign: 'center', marginTop: 20, color: 'gray' },

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

  name: { fontSize: 20, fontWeight: 'bold', color: '#111827' },

  credits: { fontSize: 13, color: '#6b7280', marginBottom: 6 },

  info: { fontSize: 13, color: '#374151', marginBottom: 5 },

  viewBtn: {
    backgroundColor: '#151a3c',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },

  connectBtn: {
    marginTop: 8,
    borderRadius: 10,
    backgroundColor: '#25843b',
    padding: 10,
    alignItems: 'center',
  },

  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
});
