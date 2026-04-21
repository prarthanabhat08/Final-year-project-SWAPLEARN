import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const API = "http://127.0.0.1:8000/api";

export default function Availability({ user, goBack }) {

  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  const timeSlots = [
    '6 AM','7 AM','8 AM','9 AM','10 AM','11 AM',
    '12 PM','1 PM','2 PM','3 PM','4 PM','5 PM',
    '6 PM','7 PM','8 PM','9 PM'
  ];

  const [selected, setSelected] = useState({});

  const getUsername = () => {
    return (user?.username || user?.name || "")
      .replace(/\s/g, "")
      .toLowerCase();
  };

  const toggleSlot = (day, time) => {
    const daySlots = selected[day] || [];

    const updated = daySlots.includes(time)
      ? daySlots.filter(t => t !== time)
      : [...daySlots, time];

    setSelected({
      ...selected,
      [day]: updated
    });
  };

  const save = async () => {
    let payload = [];

    Object.keys(selected).forEach(day => {
      selected[day].forEach(time => {
        payload.push({ day, time });
      });
    });

    try {
      const res = await fetch(`${API}/save_calendar_slots/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: getUsername(),   
          slots: payload
        })
      });

      const data = await res.json();
      console.log("SAVE RESPONSE:", data);
      alert("Saved Successfully");
      goBack?.();

    } catch (err) {
      console.log("SAVE ERROR:", err);
      alert("Error saving availability");
    }
  };

  const fetchAvailability = async () => {
    try {
      const username = getUsername();  

      console.log("FETCH USERNAME:", username);

      const res = await fetch(
        `${API}/get_calendar_slots/?username=${username}`
      );

      const data = await res.json();

      console.log("RAW:", data);

      let mapped = {};

      data.forEach(item => {
        const day = item.day;
        const time = item.time;  
        if (!mapped[day]) {
          mapped[day] = [];
        }

        mapped[day].push(time);
      });

      console.log("MAPPED FINAL:", mapped);

      setSelected(mapped);

    } catch (err) {
      console.log("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>📅 Set Your Availability</Text>

      <View style={styles.grid}>
        {days.map(day => (
          <View key={day} style={styles.column}>
            <Text style={styles.dayHeader}>{day}</Text>

            {timeSlots.map(time => {
              const isSelected = selected[day]?.includes(time);

              return (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.slot,
                    isSelected && styles.activeSlot
                  ]}
                  onPress={() => toggleSlot(day, time)}
                >
                  <Text style={[
                    styles.slotText,
                    isSelected && styles.activeText
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={save}>
        <Text style={styles.saveText}>Save Availability</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f4f6fb' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },

  grid: { flexDirection: 'row', justifyContent: 'space-between' },
  column: { flex: 1, alignItems: 'center' },

  dayHeader: { fontWeight: 'bold', marginBottom: 8 },

  slot: {
    backgroundColor: '#fff',
    padding: 6,
    marginBottom: 5,
    borderRadius: 6,
    width: '90%',
    alignItems: 'center'
  },

  activeSlot: {
    backgroundColor: '#151a3c'
  },

  slotText: { fontSize: 10 },
  activeText: { color: '#fff' },

  saveBtn: {
    marginTop: 20,
    backgroundColor: '#151a3c',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },

  saveText: { color: '#fff', fontWeight: 'bold' }
});
