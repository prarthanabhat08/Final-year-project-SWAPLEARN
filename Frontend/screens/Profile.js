import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Navbar from './Navbar';
import EditProfile from "./EditProfile";

export default function ProfilePage({ user, goToRequests, handleLogout, ...props }) {

  const [activeTab, setActiveTab] = useState('skills');
  const [skills, setSkills] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const [availability, setAvailability] = useState({});

  const userData = currentUser
    ? {
        name: currentUser.username || "User",
        bio: "",
        credits: 0,
        learnt: 0,
        taught: 0,
      }
    : {
        name: "Guest",
        bio: "",
        credits: 0,
        learnt: 0,
        taught: 0,
      };

  // ✅ FETCH SKILLS
  useEffect(() => {
    if (!currentUser?.user_id) return;

    fetch(`http://127.0.0.1:8000/api/user-skills/${currentUser.user_id}/`)
      .then(res => res.json())
      .then(data => setSkills(data))
      .catch(err => console.log(err));
  }, [currentUser]);

  // ✅ FETCH UPDATED USER (VERY IMPORTANT)
  useEffect(() => {
    if (!user?.user_id) return;

    fetch(`http://127.0.0.1:8000/api/get-user/${user.user_id}/`)
      .then(res => res.json())
      .then(data => {
        setCurrentUser(data);
      })
      .catch(err => console.log(err));
  }, []);
  useEffect(() => {
    if (!currentUser) return;
      const username = currentUser?.username?.replace(/\s/g, '') || '';

      fetch(`http://127.0.0.1:8000/api/get_calendar_slots/?username=${username}`)
      .then(res => res.json())
      .then(data => {
        let mapped = {};

        data.forEach(item => {
          if (!mapped[item.day]) {
            mapped[item.day] = [];
          }
          mapped[item.day].push(item.time);
        });

        setAvailability(mapped);
      })
      .catch(err => console.log(err));
  }, [currentUser]);

  return (
    <>
      {isEditing ? (

        <EditProfile
          user={currentUser}   // ✅ PASS currentUser
          onSave={(updatedUser) => {

            setCurrentUser({
              ...currentUser,
              username: updatedUser.name,
              email: updatedUser.email
            });

            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />

      ) : (

        <ScrollView style={styles.container}>

          <Navbar {...props} currentPage="profile" goToRequests={goToRequests} />

          {/* HEADER */}
          <View style={styles.headerCard}>

            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => props.setScreen(props.previousScreen)}
            >
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👤</Text>
            </View>

            <Text style={styles.name}>{userData.name}</Text>
            <Text style={styles.bio}>{userData.bio}</Text>

            <View style={styles.stats}>
              <Stat number={userData.credits} label="Credits" />
              <Stat number={userData.learnt} label="Learnt" />
              <Stat number={userData.taught} label="Taught" />
            </View>

            {/* ACTION BUTTONS */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareBtn}>
                <Text style={styles.shareText}>Share</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

          </View>

          {/* TABS */}
          <View style={styles.tabs}>
            <Tab title="Skills" active={activeTab === 'skills'} onPress={() => setActiveTab('skills')} />
            <Tab title="Teaching" active={activeTab === 'teaching'} onPress={() => setActiveTab('teaching')} />
            <Tab title="Learning" active={activeTab === 'learning'} onPress={() => setActiveTab('learning')} />
            <Tab title="Feedback" active={activeTab === 'feedback'} onPress={() => setActiveTab('feedback')} />
          </View>

          {/* CONTENT */}
          <View style={styles.section}>
            {activeTab === 'skills' && <SkillsSection skills={skills} />}
            {activeTab === 'teaching' && <Empty title="Teaching Sessions" />}
            {activeTab === 'learning' && <Empty title="Learning Sessions" />}
            {activeTab === 'feedback' && <Empty title="Feedback" />}
          </View>
          <View style={{ padding: 20 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
              Your Availability
            </Text>

            {Object.keys(availability).length === 0 ? (
              <Text>No availability set</Text>
            ) : (
              Object.keys(availability).map(day => (
                <View key={day} style={{ marginBottom: 5 }}>
                  <Text style={{ fontWeight: 'bold' }}>{day}</Text>
                  <Text>{availability[day].join(', ')}</Text>
                </View>
              ))
            )}
          </View>
          <TouchableOpacity
            style={styles.availabilityBtn}
            onPress={() => props.setScreen('availability')}
          >
            <Text style={styles.availabilityText}>Set Availability</Text>
          </TouchableOpacity>
        </ScrollView>

      )}
    </>
  );
}

/* COMPONENTS SAME AS YOUR CODE (NO CHANGE) */

const Stat = ({ number, label }) => (
  <View style={styles.stat}>
    <Text style={styles.statNumber}>{number}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const Tab = ({ title, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.tab, active && styles.activeTab]}
  >
    <Text style={[styles.tabText, active && styles.activeTabText]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const SkillsSection = ({ skills }) => {
  const learn = skills.filter(s => s.type === "learn");
  const teach = skills.filter(s => s.type === "teach");

  return (
    <View>

      <Text style={styles.sectionTitle}>I want to learn</Text>
      <View style={styles.grid}>
        {learn.length === 0 ? (
          <Text>No learning skills</Text>
        ) : (
          learn.map((item, i) => (
            <SkillCard key={i} skill={item.skill_name} level={item.language} />
          ))
        )}
      </View>

      <Text style={styles.sectionTitle}>I can teach</Text>
      <View style={styles.grid}>
        {teach.length === 0 ? (
          <Text>No teaching skills</Text>
        ) : (
          teach.map((item, i) => (
            <SkillCard key={i} skill={item.skill_name} level={item.language} />
          ))
        )}
      </View>

    </View>
  );
};

const SkillCard = ({ skill, level }) => (
  <View style={styles.skillCard}>
    <Text style={styles.skill}>{skill}</Text>
    <Text style={styles.level}>{level}</Text>
  </View>
);

const Empty = ({ title }) => (
  <View>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.emptyBox}>
      <Text style={{ color: '#aaa' }}>Nothing here yet</Text>
    </View>
  </View>
);


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f0' },

  headerCard: { 
    backgroundColor: '#151a3c', 
    padding: 25, 
    alignItems: 'center',
  },

  backButton: {
    position: 'absolute',
    top: 15,
    left: 30,
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
  },

  backText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  availabilityBtn: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: '#151a3c',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center'
  },

  availabilityText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  logoutText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: 'bold',
  },

  avatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'
  },

  avatarText: { fontSize: 30 },

  name: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginTop: 10 },

  bio: { color: '#ccc', marginTop: 5 },

  stats: { flexDirection: 'row', gap: 30, marginTop: 15 },

  stat: { alignItems: 'center' },

  statNumber: { color: '#4CAF50', fontWeight: 'bold', fontSize: 15 },

  statLabel: { color: '#ccc', fontSize: 15 },

  actions: { flexDirection: 'row', gap: 15, marginTop: 15 },

  editBtn: { backgroundColor: '#4CAF50', paddingHorizontal: 75, paddingVertical: 10, borderRadius: 20 },

  shareBtn: { borderWidth: 1, borderColor: '#4CAF50', paddingHorizontal: 75, paddingVertical: 10, borderRadius: 20 },

  editText: { color: '#fff', fontWeight: 'bold' },

  shareText: { color: '#4CAF50', fontWeight: 'bold' },

  tabs: { flexDirection: 'row', justifyContent: 'center', marginTop: 15, gap: 10 },

  tab: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#e0e0e0' },

  activeTab: { backgroundColor: '#4CAF50' },

  tabText: { color: '#555' },

  activeTabText: { color: '#fff' },

  section: { padding: 20 },

  sectionTitle: { fontWeight: 'bold', fontSize: 16, marginVertical: 10, color: '#151a3c' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },

  skillCard: {
    backgroundColor: '#fff', width: '30%', padding: 15,
    borderRadius: 12, marginBottom: 10, elevation: 3
  },

  skill: { fontWeight: 'bold', color: '#151a3c' },

  level: { color: '#4CAF50', marginTop: 5 },

  emptyBox: {
    backgroundColor: '#fff', padding: 20,
    borderRadius: 10, alignItems: 'center'
  },
});
