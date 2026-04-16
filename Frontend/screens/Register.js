import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function Register({ switchToLogin, goBack }) {

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [teachSkills, setTeachSkills] = useState([]);
  const [learnSkills, setLearnSkills] = useState([]);

  const [selectedType, setSelectedType] = useState('');
  const [step, setStep] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  const categories = {
    Programming: ['JavaScript', 'Python', 'Java'],
    Music: ['Guitar', 'Piano', 'Singing'],
    Language: ['English', 'Spanish', 'Hindi']
  };

  const languages = ['English', 'Hindi', 'Kannada'];

  const resetFlow = () => {
    setStep('');
    setSelectedCategory('');
    setSelectedSkill('');
  };


  const addSkill = (lang) => {
    const newSkill = {
      skill: selectedSkill,
      language: lang,
      category: selectedCategory,
    };

    if (selectedType === 'teach') {
      setTeachSkills([...teachSkills, newSkill]);
    } else {
      setLearnSkills([...learnSkills, newSkill]);
    }

    resetFlow();
  };

  const removeSkill = (type, index) => {
    if (type === 'teach') {
      setTeachSkills(teachSkills.filter((_, i) => i !== index));
    } else {
      setLearnSkills(learnSkills.filter((_, i) => i !== index));
    }
  };


  const handleRegister = async () => {
    if (!username || !name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {

      const response = await fetch("http://127.0.0.1:8000/api/add-user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert("User creation failed ❌");
        return;
      }

      const userId = data.id;


      const skillResponse = await fetch("http://127.0.0.1:8000/api/save-skills/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          teach_skills: teachSkills,
          learn_skills: learnSkills,
        }),
      });

      if (skillResponse.ok) {
        alert("Registration Successful ✅");
        switchToLogin();
      } else {
        alert("Skills saving failed ❌");
      }

    } catch (error) {
      console.log(error);
      alert("Server error ❌");
    }
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.closeBtn} onPress={goBack}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Register</Text>

      <View style={styles.form}>

        <TextInput placeholder="Username" style={styles.input} value={username} onChangeText={setUsername} />
        <TextInput placeholder="Full Name" style={styles.input} value={name} onChangeText={setName} />
        <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
        <TextInput placeholder="Password" style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />

        {/* TEACH */}
        <Text style={styles.skillHeading}>Skills you Teach</Text>
        <View style={styles.skillBar}>
          {teachSkills.map((item, index) => (
            <TouchableOpacity key={index} style={styles.chip} onPress={() => removeSkill('teach', index)}>
              <Text>{item.skill} ({item.language}) ✕</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={() => {
            setSelectedType('teach');
            setStep('category');
          }}>
            <Text style={styles.addText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* LEARN */}
        <Text style={styles.skillHeading}>Skills you Want to Learn</Text>
        <View style={styles.skillBar}>
          {learnSkills.map((item, index) => (
            <TouchableOpacity key={index} style={styles.chip} onPress={() => removeSkill('learn', index)}>
              <Text>{item.skill} ({item.language}) ✕</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={() => {
            setSelectedType('learn');
            setStep('category');
          }}>
            <Text style={styles.addText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* FLOW */}
        {step === 'category' && Object.keys(categories).map((cat) => (
          <TouchableOpacity key={cat} style={styles.option} onPress={() => {
            setSelectedCategory(cat);
            setStep('skill');
          }}>
            <Text>{cat}</Text>
          </TouchableOpacity>
        ))}

        {step === 'skill' && categories[selectedCategory].map((skill) => (
          <TouchableOpacity key={skill} style={styles.option} onPress={() => {
            setSelectedSkill(skill);
            setStep('language');
          }}>
            <Text>{skill}</Text>
          </TouchableOpacity>
        ))}

        {step === 'language' && languages.map((lang) => (
          <TouchableOpacity key={lang} style={styles.option} onPress={() => addSkill(lang)}>
            <Text>{lang}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={switchToLogin}>
          <Text style={styles.loginText}>
            Already a user? <Text style={styles.loginLink}>Login</Text>
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
    width: '55%',
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

  skillHeading: {
    fontWeight: 'bold',
    marginTop: 10,
  },

  skillBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#e6f4ea',
    padding: 8,
    borderRadius: 12,
    marginVertical: 5,
  },

  chip: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    margin: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    margin: 4,
  },

  addText: {
    color: 'white',
    fontWeight: 'bold',
  },

  stepTitle: {
    marginTop: 10,
    fontWeight: 'bold',
  },

  option: {
    backgroundColor: '#eee',
    padding: 10,
    marginTop: 5,
    borderRadius: 8,
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