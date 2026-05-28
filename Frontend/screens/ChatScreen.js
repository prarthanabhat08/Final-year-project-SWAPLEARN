import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Linking,
  Alert
} from 'react-native';

export default function ChatScreen({ roomId, user, name, goBack, otherUserId, role }) {

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [incomingCall, setIncomingCall] = useState(null);

const loadMessages = async () => {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/messages/${roomId}/`);
    const data = await res.json();

    setMessages(data);

    // 🔥 CHECK FOR INCOMING CALL HERE
    const call = data.find(
      m => m.type === "call_request" && m.status === "pending"
    );

    if (call && call.sender !== user.user_id) {
      setIncomingCall(call);
    }

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

const startVideoCall = async () => {
  const meetingRoom = `swaplearn_${roomId}`;
  const url = `https://meet.jit.si/${meetingRoom}`;

  await fetch("http://127.0.0.1:8000/api/send-message/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sender_id: user.user_id,
      room_id: roomId,
      text: url,
      type: "call_request"
    })
  });
};

    // optional: open call after sending
  

  const endSession = async () => {
    try {
      let teacher_id, learner_id;

      if (role === "teacher") {
        teacher_id = user.user_id;
        learner_id = otherUserId;
      } else {
        teacher_id = otherUserId;
        learner_id = user.user_id;
      }

      const res = await fetch("http://127.0.0.1:8000/end_session/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacher_id: teacher_id,
          learner_id: learner_id,
        }),
      });

      const data = await res.json();
      console.log("Credits Updated:", data);

      Alert.alert("Session Ended", "Credits updated successfully");

    } catch (err) {
      console.log("Error:", err);
    }
  };


  const handleBack = async () => {
    await endSession();  // 
    goBack();
  };

 const renderMessage = ({ item }) => {
  const isMe = String(item.sender) === String(user.user_id);

  return (
    <View style={{ alignItems: isMe ? "flex-end" : "flex-start", marginVertical: 5 }}>
      <View style={{
        backgroundColor: isMe ? "#4CAF50" : "#ddd",
        padding: 10,
        borderRadius: 10,
        maxWidth: "70%"
      }}>

        {/* 🔥 THIS IS THE IMPORTANT CHANGE */}
       {item.type === "video_call" || item.text?.includes("meet.jit.si") ? (
          <TouchableOpacity onPress={() => Linking.openURL(item.text)}>
            <Text style={{ color: "blue", fontWeight: "bold" }}>
              📹 Join Video Call
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={{ color: isMe ? "#fff" : "#000" }}>
            {item.text}
          </Text>
        )}

      </View>
    </View>
  );
};
        

  return (
    <View style={{ flex: 1, backgroundColor: "#f0f4f0" }}>

      {/* HEADER */}
      <View
        style={{
          backgroundColor: "#151a3c",
          padding: 15,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >

        <View>
          <TouchableOpacity onPress={handleBack}>
            <Text style={{ color: "#fff" }}>← Back</Text>
          </TouchableOpacity>

          <Text style={{ color: "#fff", fontSize: 18, marginTop: 5 }}>
            {name}
          </Text>
        </View>

        {/* 🎥 VIDEO CALL BUTTON */}
        <TouchableOpacity
          onPress={startVideoCall}
          style={{
            backgroundColor: "#4CAF50",
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 10
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            📹 Call
          </Text>
        </TouchableOpacity>

      </View>

      {/* CHAT LIST */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          padding: 10,
          backgroundColor: "#f0f4f0"
        }}
      />

      {/* MESSAGE INPUT */}
      <View style={{ flexDirection: "row", padding: 10 }}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type message..."
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            borderRadius: 10
          }}
        />

        <TouchableOpacity onPress={sendMessage}>
          <Text style={{ padding: 10, fontWeight: "bold" }}>
            Send
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}
