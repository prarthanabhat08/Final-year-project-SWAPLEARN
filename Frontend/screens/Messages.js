import React from 'react';
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

export default function Messages(props) {

  const activeUsers = [
    { id: '1', name: 'Ananya' },
    { id: '2', name: 'Rahul' },
    { id: '3', name: 'Meera' },
    { id: '4', name: 'Kiran' },
    { id: '5', name: 'Asha' },
  ];

  const chats = [
    {
      id: '1',
      name: 'Ananya',
      message: 'Let’s continue Python session tomorrow',
      time: '10:45 AM',
      unread: 2,
      online: true,
    },
    {
      id: '2',
      name: 'Rahul',
      message: 'Thanks for the React help!',
      time: 'Yesterday',
      unread: 0,
      online: false,
    },
    {
      id: '3',
      name: 'Meera',
      message: 'Can we reschedule?',
      time: '2 days ago',
      unread: 1,
      online: true,
    },
  ];

  /* ACTIVE USER BUBBLE */
  const renderActiveUser = (user) => (
    <View key={user.id} style={styles.activeUser}>
      <View style={styles.storyCircle}>
        <Text style={styles.storyText}>{user.name.charAt(0)}</Text>
      </View>
      <Text style={styles.activeName}>{user.name}</Text>
    </View>
  );

  /* CHAT ITEM */
  const renderChat = ({ item }) => (
    <TouchableOpacity style={styles.chatCard}>

      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        {item.online && <View style={styles.onlineDot} />}
      </View>

      <View style={styles.chatInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.message} numberOfLines={1}>
          {item.message}
        </Text>
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.time}>{item.time}</Text>

        {item.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unread}</Text>
          </View>
        )}
      </View>

    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      <Navbar {...props} />

      {/* HEADER */}
      <Text style={styles.title}>Messages</Text>

      {/* SEARCH BAR */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search"
          style={styles.searchInput}
        />
      </View>

      {/* ACTIVE USERS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.activeContainer}
      >
        {activeUsers.map(renderActiveUser)}
      </ScrollView>

      {/* CHAT LIST */}
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderChat}
        contentContainerStyle={{ padding: 15 }}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f0',
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#151a3c',
    marginLeft: 20,
    marginTop: 10,
  },

  /* SEARCH */
  searchBox: {
    backgroundColor: '#e6e9ef',
    margin: 15,
    borderRadius: 10,
    paddingHorizontal: 10,
  },

  searchInput: {
    height: 40,
  },

  /* ACTIVE USERS */
  activeContainer: {
    paddingLeft: 15,
  },

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

  storyText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  activeName: {
    fontSize: 12,
    marginTop: 5,
  },

  /* CHAT */
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
    position: 'relative',
  },

  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'limegreen',
    borderWidth: 2,
    borderColor: '#fff',
  },

  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#151a3c',
  },

  message: {
    color: '#666',
    marginTop: 3,
  },

  rightSection: {
    alignItems: 'flex-end',
  },

  time: {
    fontSize: 12,
    color: '#888',
  },

  unreadBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingHorizontal: 6,
    marginTop: 5,
  },

  unreadText: {
    color: '#fff',
    fontSize: 12,
  },
});