import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Navbar from './Navbar';

export default function Requests({ user, isLoggedIn, ...props }) {

  const [requests, setRequests] = useState([]);


  const loadRequests = () => {
    if (!user) return;

    fetch(`http://127.0.0.1:8000/api/requests/${user.user_id}/`)
      .then(res => res.json())
      .then(data => setRequests(data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    loadRequests();
  }, [user]);


  const acceptRequest = async (id) => {
    try {
      await fetch("http://127.0.0.1:8000/api/accept-request/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ request_id: id }),
      });

      alert("Accepted ✅");
      loadRequests(); // refresh

    } catch (err) {
      console.log(err);
    }
  };


  const rejectRequest = async (id) => {
    try {
      await fetch("http://127.0.0.1:8000/api/reject-request/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ request_id: id }),
      });

      alert("Rejected ❌");
      loadRequests();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Navbar isLoggedIn={isLoggedIn} {...props} />

      <Text style={styles.title}>Requests</Text>

      {!user ? (
        <Text style={styles.empty}>Login to see requests</Text>
      ) : requests.length === 0 ? (
        <Text style={styles.empty}>No requests</Text>
      ) : (
        requests.map((r) => (
          <View key={r.request_id} style={styles.card}>

            <Text style={styles.name}>{r.sender_name}</Text>
            <Text style={styles.skill}>Skill: {r.skill}</Text>

            <Text style={styles.status}>
              Status: {r.status}
            </Text>

            {r.status === "pending" && (
              <View style={styles.actions}>

                <TouchableOpacity
                  style={styles.acceptBtn}
                  onPress={() => acceptRequest(r.request_id)}
                >
                  <Text style={styles.btnText}>Accept</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.rejectBtn}
                  onPress={() => rejectRequest(r.request_id)}
                >
                  <Text style={styles.btnText}>Reject</Text>
                </TouchableOpacity>

              </View>
            )}

          </View>
        ))
      )}
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
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: 'bold',
    color: '#151a3c',
  },

  empty: {
    textAlign: 'center',
    color: 'gray',
  },

  card: {
    backgroundColor: '#fff',
    margin: 12,
    padding: 20,
    borderRadius: 12,
    elevation: 4,
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  skill: {
    marginTop: 5,
  },

  status: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#4CAF50',
  },

  actions: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },

  acceptBtn: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
  },

  rejectBtn: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 8,
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});