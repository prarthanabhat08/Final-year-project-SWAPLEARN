import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

export default function ChatScreen({ roomId, user, name, goBack }) {

  console.log("ROOM ID:", roomId); 

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const loadMessages = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/messages/${roomId}/`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!roomId) return;

    loadMessages();

    const interval = setInterval(() => {
      loadMessages();
    }, 2000);

    return () => clearInterval(interval);
  }, [roomId]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    const msg = text;
    setText("");

    setMessages(prev => [
      ...prev,
      { sender: user.user_id, text: msg }
    ]);

    try {
      await fetch(`http://127.0.0.1:8000/api/send-message/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sender_id: user.user_id,
          room_id: roomId,
          text: msg
        })
      });

      loadMessages();
    } catch (err) {
      console.log(err);
    }
  };

const renderMessage = ({ item }) => {
  const isMe = String(item.sender) === String(user.user_id);

  return (
    <View
      style={{
        alignItems: isMe ? "flex-end" : "flex-start",
        marginVertical: 5,
      }}
    >
      <View
        style={{
          backgroundColor: isMe ? "#4CAF50" : "#ddd",
          padding: 10,
          borderRadius: 10,
          maxWidth: "70%",
        }}
      >
        <Text style={{ color: isMe ? "#fff" : "#000" }}>
          {item.text}
        </Text>
      </View>
    </View>
  );
};

  return (
    <View style={{ flex: 1, backgroundColor: "#f0f4f0" }}>

      <View style={{ backgroundColor: "#151a3c", padding: 15 }}>
        <TouchableOpacity onPress={goBack}>
          <Text style={{ color: "#fff" }}>← Back</Text>
        </TouchableOpacity>

        <Text style={{ color: "#fff", fontSize: 18 }}>
          {name}
        </Text>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ padding: 10, backgroundColor: "#f0f4f0" }}
      />

      <View style={{ flexDirection: "row", padding: 10 }}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type message..."
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10
          }}
        />

        <TouchableOpacity onPress={sendMessage}>
          <Text style={{ padding: 10 }}>Send</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}
