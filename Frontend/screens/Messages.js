import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import Navbar from './Navbar';

export default function Messages({ openChat, user, screen, ...props }){

  const [chats, setChats] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  console.log("USER IN MESSAGES:", user);


  const loadChats = async () => {
    console.log(" loadChats called");
    console.log("USER:", user);

    if (!user || !user.user_id) {
      console.log(" USER NOT READY");
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/chats/${user.user_id}/`
      );

      console.log("STATUS:", res.status);

      const data = await res.json();

      console.log("DATA:", data);

      if (Array.isArray(data)) {

      
        const uniqueChats = [];
        const seen = new Set();

        data.forEach(item => {
          if (!seen.has(item.name)) {
            seen.add(item.name);
            uniqueChats.push(item);
          }
        });

        setChats(uniqueChats);
        setActiveUsers(uniqueChats);
      }

    } catch (err) {
      console.log("ERROR:", err);
    }
  };

  useEffect(() => {
    console.log("👀 MESSAGES SCREEN OPENED");

    if (user && user.user_id) {
      loadChats();
    }

    const interval = setInterval(() => {
      if (user && user.user_id) {
        loadChats();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [screen, user]);   
  
  const searchUsers = async (text) => {
    setSearch(text);

    if (text.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/search-users/`
      );

      const data = await res.json();
      setSearchResults(data);

    } catch (err) {
      console.log(err);
    }
  };

  const renderActiveUser = (user) => (
    <View key={user.room_id} style={styles.activeUser}>
      <View style={styles.storyCircle}>
        <Text style={styles.storyText}>
          {user.name ? user.name.charAt(0) : "?"}
        </Text>
      </View>
      <Text style={styles.activeName}>{user.name}</Text>
    </View>
  );

  const renderChat = ({ item }) => {

    if (!item || !item.room_id) return null;

    return (
      <TouchableOpacity
        style={styles.chatCard}
        onPress={() => {
          console.log("CLICKED:", item);
          openChat && openChat(item.room_id, item.name);
        }}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.name ? item.name.charAt(0) : "?"}
          </Text>
        </View>

        <View style={styles.chatInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.message}>
            {item.last_message || "Start chatting..."}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>

      <Navbar {...props} showMessages={true} />

      <Text style={styles.title}>Messages</Text>

      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search users..."
          style={styles.searchInput}
          value={search}
          onChangeText={searchUsers}
        />
      </View>

      {searchResults.length > 0 && (
        <View style={{ paddingHorizontal: 15 }}>
          {searchResults.map((item) => (
            <View key={item.user_id} style={styles.chatCard}>

              <Text style={styles.name}>{item.name}</Text>

              {item.isAccepted ? (
                <TouchableOpacity
                  onPress={() =>
                    openChat(item.room_id, item.name)
                  }
                >
                  <Text style={{ color: 'green' }}>Start Chat</Text>
                </TouchableOpacity>
              ) : (
                <Text style={{ color: 'red' }}>
                  Request not accepted
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.activeContainer}
      >
        {activeUsers.map(renderActiveUser)}
      </ScrollView>

      <View style={{ flex: 1 }}>
        <FlatList
          data={chats}
          keyExtractor={(item, index) =>
            item.room_id ? item.room_id.toString() : index.toString()
          }
          renderItem={renderChat}
          contentContainerStyle={{ padding: 15 }}

          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No chats found
            </Text>
          }
        />
      </View>

    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f0' },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#151a3c',
    marginLeft: 20,
    marginTop: 10,
  },

  searchBox: {
    backgroundColor: '#e6e9ef',
    margin: 15,
    borderRadius: 10,
    paddingHorizontal: 10,
  },

  searchInput: { height: 40 },

  activeContainer: { paddingLeft: 15 },

  activeUser: {
    alignItems: 'center',
    marginRight: 15,
  },

  storyCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },

  storyText: { color: '#fff', fontWeight: 'bold' },

  activeName: { fontSize: 12, marginTop: 5 },

  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  chatInfo: { flex: 1, marginLeft: 12 },

  name: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#151a3c',
  },

  message: {
    color: '#666',
    marginTop: 3,
  },
});
