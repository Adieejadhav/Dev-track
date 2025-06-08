// components/SkillTrackerSection.jsx
import React, { useEffect, useState } from "react";
import { useFirebase } from "../Context/fireBaseContext";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const SkillTrackerSection = () => {
  const firebase = useFirebase();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const userRef = doc(db, "users", firebase.user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const skillString = userSnap.data().primarySkills;
          const extractedSkills = skillString
            ?.split(",")
            .map(skill => skill.trim())
            .filter(skill => skill.length > 0);

          setSkills(extractedSkills || []);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    };

    if (firebase.user?.uid) {
      fetchSkills();
    }
  }, [firebase.user]);

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-xl mx-auto">
      <h2 className="text-xl font-semibold text-slate-800 mb-3">Tracked Skills</h2>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading skills...</p>
      ) : skills.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No skills found.</p>
      )}
    </div>
  );
};

export default SkillTrackerSection;
