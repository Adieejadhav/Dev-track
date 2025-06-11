import React, { useState } from "react";

const TrackedSkillsSection = ({ trackedSkills }) => {
  const [skillProgress, setSkillProgress] = useState(
    trackedSkills.reduce((acc, skill) => {
      acc[skill] = 0; // Initialize all skills with 0% progress
      return acc;
    }, {})
  );

  const handleIncrement = (skill) => {
    setSkillProgress((prev) => ({
      ...prev,
      [skill]: Math.min(prev[skill] + 10, 100),
    }));
  };

  const handleDecrement = (skill) => {
    setSkillProgress((prev) => ({
      ...prev,
      [skill]: Math.max(prev[skill] - 10, 0),
    }));
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
              {skillProgress[skill]}%
            </span>
          </div>

          <div className="w-full h-3 bg-gray-700 rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
              style={{ width: `${skillProgress[skill]}%` }}
            />
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleDecrement(skill)}
              className="px-4 py-1 bg-[#292944] text-white rounded-xl hover:bg-[#34345e] transition"
            >
              −
            </button>
            <button
              onClick={() => handleIncrement(skill)}
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
