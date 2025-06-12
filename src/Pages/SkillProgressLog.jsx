import React, { useState } from "react";
import { useParams } from "react-router-dom";

const SkillProgressLog = () => {
  const { skillName } = useParams();
  const [logText, setLogText] = useState("");

  const handleAddLog = () => {
    if (!logText.trim()) return;
    // For now, just log to console
    console.log(`New log for ${skillName}:`, logText);
    setLogText(""); // Clear input
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded-3xl shadow-xl">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
        {skillName} – Progress Log
      </h2>

      <textarea
        className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        rows={4}
        placeholder="Write what you worked on today..."
        value={logText}
        onChange={(e) => setLogText(e.target.value)}
      />

      <button
        onClick={handleAddLog}
        className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
      >
        Add Log
      </button>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Previous Logs:</h3>
        {/* Placeholder for now */}
        <p className="text-gray-500">No logs yet.</p>
      </div>
    </div>
  );
};

export default SkillProgressLog;
