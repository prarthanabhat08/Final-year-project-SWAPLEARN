import React, { useState } from "react";

export default function EditProfile({ user, onSave, onCancel }) {

  const [name, setName] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");

  const [teachSkills, setTeachSkills] = useState([]);
  const [learnSkills, setLearnSkills] = useState([]);

  const [selectedType, setSelectedType] = useState("");
  const [step, setStep] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");

  const categories = {
    Programming: ['JavaScript', 'Python', 'Java'],
    Music: ['Guitar', 'Piano', 'Singing'],
    Language: ['English', 'Spanish', 'Hindi']
  };

  const languages = ['English', 'Hindi', 'Kannada'];

  const resetFlow = () => {
    setStep("");
    setSelectedCategory("");
    setSelectedSkill("");
  };

  const addSkill = (lang) => {
    const newSkill = {
      skill: selectedSkill,
      language: lang,
      category: selectedCategory,
    };

    if (selectedType === "teach") {
      setTeachSkills([...teachSkills, newSkill]);
    } else {
      setLearnSkills([...learnSkills, newSkill]);
    }

    resetFlow();
  };

  const removeSkill = (type, index) => {
    if (type === "teach") {
      setTeachSkills(teachSkills.filter((_, i) => i !== index));
    } else {
      setLearnSkills(learnSkills.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/update-profile/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.user_id,
          name,
          email,
          teachSkills,
          learnSkills,
        }),
      });

      if (res.ok) {
        onSave({ name, email, teachSkills, learnSkills });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2 style={styles.heading}>Edit Profile</h2>

        <label style={styles.label}>Username</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <h3 style={styles.subHeading}>Teach Skills</h3>
        <div style={styles.skillBar}>
          {teachSkills.map((item, index) => (
            <div key={index} style={styles.chip}>
              {item.skill} ({item.language})
              <span onClick={() => removeSkill("teach", index)} style={styles.remove}>×</span>
            </div>
          ))}
          <button style={styles.addBtn} onClick={() => {
            setSelectedType("teach");
            setStep("category");
          }}>+ Add</button>
        </div>

        <h3 style={styles.subHeading}>Learn Skills</h3>
        <div style={styles.skillBar}>
          {learnSkills.map((item, index) => (
            <div key={index} style={styles.chip}>
              {item.skill} ({item.language})
              <span onClick={() => removeSkill("learn", index)} style={styles.remove}>×</span>
            </div>
          ))}
          <button style={styles.addBtn} onClick={() => {
            setSelectedType("learn");
            setStep("category");
          }}>+ Add</button>
        </div>

        {step === "category" && Object.keys(categories).map((cat) => (
          <div key={cat} style={styles.option} onClick={() => {
            setSelectedCategory(cat);
            setStep("skill");
          }}>{cat}</div>
        ))}

        {step === "skill" && categories[selectedCategory].map((skill) => (
          <div key={skill} style={styles.option} onClick={() => {
            setSelectedSkill(skill);
            setStep("language");
          }}>{skill}</div>
        ))}

        {step === "language" && languages.map((lang) => (
          <div key={lang} style={styles.option} onClick={() => addSkill(lang)}>
            {lang}
          </div>
        ))}

        <div style={styles.btnRow}>
          <button onClick={handleSave} style={styles.saveBtn}>Save Changes</button>
          <button onClick={onCancel} style={styles.cancelBtn}>Cancel</button>
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#eef2f3",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  card: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "15px",
    width: "450px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
  },

  heading: {
    marginBottom: "20px"
  },

  label: {
    fontSize: "14px",
    marginTop: "10px"
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },

  subHeading: {
    marginTop: "15px"
  },

  skillBar: {
    display: "flex",
    flexWrap: "wrap",
    gap: "5px",
    backgroundColor: "#e6f4ea",
    padding: "8px",
    borderRadius: "10px"
  },

  chip: {
    backgroundColor: "white",
    padding: "5px 10px",
    borderRadius: "15px",
    border: "1px solid #ddd"
  },

  remove: {
    marginLeft: "8px",
    cursor: "pointer",
    color: "red"
  },

  addBtn: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "10px",
    cursor: "pointer"
  },

  option: {
    backgroundColor: "#eee",
    padding: "10px",
    marginTop: "5px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  btnRow: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between"
  },

  saveBtn: {
    backgroundColor: "#151a3c",
    color: "white",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    width: "60%"
  },

  cancelBtn: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    width: "35%"
  }
};
