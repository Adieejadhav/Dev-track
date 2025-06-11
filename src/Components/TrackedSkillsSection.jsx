import React, { useEffect, useState } from "react";
import { db } from "../Firebase/fireBaseConfig";
import { useFirebase } from "../Context/fireBaseContext";
import { doc, updateDoc, getDoc } from "firebase/firestore";

const TrackedSkillsSection = ({ trackedSkills }) => {
  const { user } = useFirebase();
  const [skillProgress, setSkillProgress] = useState({});

  // Fetch progress on mount
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user?.uid) return;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const data = userSnap.data();
      setSkillProgress(data?.trackedProgress || {});
    };
    fetchProgress();
  }, [user?.uid]);

  const updateProgress = async (skill, value) => {
    const newProgress = Math.max(0, Math.min(100, (skillProgress[skill] || 0) + value));
    const updated = {
      ...skillProgress,
      [skill]: newProgress,
    };
    setSkillProgress(updated);

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();

    // Prepare update payload
    const updatePayload = {
      trackedProgress: updated,
    };

    // If no initialTrackedProgress entry for this skill, set it
    if (!userData?.initialTrackedProgress?.[skill]) {
      updatePayload[`initialTrackedProgress.${skill}`] = skillProgress[skill] || 0;
    }

    // If trackingStartedAt not set, add it
    if (!userData?.trackingStartedAt) {
      updatePayload.trackingStartedAt = new Date().toISOString(); // or use serverTimestamp()
    }

    await updateDoc(userRef, updatePayload);
  };


  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-center mb-6 text-white">
        📈 Tracked Skills Progress
      </h2>

      {trackedSkills.map((skill) => (
        <div
          key={skill}
          className="bg-[#1f1f2e] rounded-2xl shadow-md p-5 mb-6"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-medium text-lg">{skill}</span>
            <span className="text-gray-300 text-sm">
              {skillProgress[skill] || 0}%
            </span>
          </div>

          <div className="w-full h-3 bg-gray-700 rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
              style={{ width: `${skillProgress[skill] || 0}%` }}
            />
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => updateProgress(skill, -10)}
              className="px-4 py-1 bg-[#292944] text-white rounded-xl hover:bg-[#34345e] transition"
            >
              −
            </button>
            <button
              onClick={() => updateProgress(skill, +10)}
              className="px-4 py-1 bg-[#292944] text-white rounded-xl hover:bg-[#34345e] transition"
            >
              +
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackedSkillsSection;
