import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function Login({ switchToRegister, onLoginSuccess, goBack }) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = async () => {
  if (!username || !password) {
    alert('Please fill all fields');
    return;
  }

  try {
    const response = await fetch('http://localhost:8000/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const data = await response.json();

    if (data.status === "success") {
      alert("Login Successful ✅");
      console.log("User:", data);
      onLoginSuccess(data);   // ✅ only now login happens
    } else {
      alert("Invalid Username or Password ❌");
    }

  } catch (error) {
    console.error(error);
    alert("Server Error ❌");
  }
};

  return (
    <View style={styles.container}>

     
      <TouchableOpacity style={styles.closeBtn} onPress={goBack}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Login</Text>

      <View style={styles.form}>

        <TextInput
          placeholder="Username"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={switchToRegister}>
          <Text style={styles.loginText}>
            New User? <Text style={styles.loginLink}>Register</Text>
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#151a3c',
  },

  form: {
    width: '45%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
  },

  input: {
    backgroundColor: '#ccd2dc',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },

  button: {
    backgroundColor: '#151a3c',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },

  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },

  loginText: {
    marginTop: 20,
    textAlign: 'center',
    color: 'gray',
  },

  loginLink: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },

  closeBtn: {
    position: 'absolute',
    top: 40,
    right: 30,
    zIndex: 10,
  },

  closeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#151a3c',
  },
});
