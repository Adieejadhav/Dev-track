import React, { useEffect, useState } from "react";
import { db } from "../Firebase/fireBaseConfig";
import { useFirebase } from "../Context/fireBaseContext";
import { doc, updateDoc, getDoc, collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const TrackedSkillsSection = ({ trackedSkills }) => {
  const { user } = useFirebase();
  const [skillProgress, setSkillProgress] = useState({});
  const [recentLogs, setRecentLogs] = useState({});
  const navigate = useNavigate();

  // Fetch progress on mount
  useEffect(() => {
    const fetchProgressAndLogs = async () => {
      if (!user?.uid) return;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const data = userSnap.data();
      setSkillProgress(data?.trackedProgress || {});

      // Fetch logs for each tracked skill
      const logsObj = {};
      for (const skill of trackedSkills) {
        const logsRef = collection(db, "users", user.uid, "skill-progress-log", skill, "entries");
        const q = query(logsRef, orderBy("timestamp", "desc"), limit(2));
        const snapshot = await getDocs(q);
        logsObj[skill] = snapshot.docs.map(doc => doc.data());
      }
      setRecentLogs(logsObj);
    };
    fetchProgressAndLogs();
  }, [user?.uid, trackedSkills]);

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

    const updatePayload = {
      trackedProgress: updated,
    };

    if (!userData?.initialTrackedProgress?.[skill]) {
      updatePayload[`initialTrackedProgress.${skill}`] = skillProgress[skill] || 0;
    }

    if (!userData?.trackingStartedAt) {
      updatePayload.trackingStartedAt = new Date().toISOString();
    }

    await updateDoc(userRef, updatePayload);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
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

          {/* Log Preview */}
          {recentLogs[skill]?.length > 0 && (
            <div className="mb-3 text-sm text-gray-300">
              <p className="italic text-xs mb-1">Recent Logs:</p>
              <ul className="list-disc ml-5 space-y-1">
                {recentLogs[skill].map((log, index) => (
                  <li key={index}>{log.note || "(No note)"} - {new Date(log.timestamp?.toDate?.()).toLocaleDateString()}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => navigate(`/skill/${skill}`)}
            className="text-cyan-400 hover:underline text-sm mb-3 block text-right"
          >
            View Full Log →
          </button>

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
