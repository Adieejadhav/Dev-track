import React, { useState, useEffect } from "react";
import { useFirebase } from "../Context/fireBaseContext";

const SkillTrackerSection = ({ primarySkills = [], trackedSkills = [] ,onUpdate}) => {
  const firebase = useFirebase();
  const [allSkills, setAllSkills] = useState([]);
  const [tracked, setTracked] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [newlyAddedSkills, setNewlyAddedSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setAllSkills(primarySkills);
    setTracked(trackedSkills);
    setNewlyAddedSkills([]);
  }, [primarySkills, trackedSkills]);

  const toggleSkill = (skill) => {
    setTracked((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const handleAddSkill = () => {
    const skill = newSkill.trim();
    if (!skill) return;
    if (allSkills.includes(skill)) {
      setMessage("❗ Skill already exists.");
      return;
    }

    setAllSkills((prev) => [...prev, skill]);
    setTracked((prev) => [...prev, skill]);
    setNewlyAddedSkills((prev) => [...prev, skill]);
    setNewSkill("");
    setMessage("ℹ️ New skill added. Click save to store it.");
  };

  const saveTrackedSkills = async () => {
    setLoading(true);
    setMessage(null);
    try {
        await firebase.updateTrackedSkills(firebase.user.uid, tracked);
        setMessage(`✅ Saved skills: ${tracked.join(", ")}`);
        setNewlyAddedSkills([]);
        
        if (onUpdate) onUpdate(); // Notify parent to refetch
    } catch (error) {
        console.error(error);
        setMessage("❌ Failed to update tracked skills.");
    } finally {
        setLoading(false);
    }
};


  return (
    <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-xl mx-auto">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Tracked Skills</h2>

      {/* Add Skill Input */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add a new skill"
          className="flex-1 px-3 py-2 border rounded-md text-sm"
        />
        <button
          onClick={handleAddSkill}
          className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700"
        >
          Add Skill
        </button>
      </div>

      {/* Skill Buttons */}
      {allSkills.length > 0 ? (
        <>
          <div className="flex flex-wrap gap-3 mb-6">
            {allSkills.map((skill) => {
              const isNew = newlyAddedSkills.includes(skill);
              const isTracked = tracked.includes(skill);

              return (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1 rounded-full text-sm font-medium border transition
                    ${
                      isNew
                        ? isTracked
                          ? "bg-yellow-400 text-white border-yellow-500"
                          : "bg-yellow-100 text-yellow-800 border-yellow-300"
                        : isTracked
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-200 text-gray-700 border-gray-300"
                    } hover:brightness-90`}
                >
                  {skill}
                </button>
              );
            })}
          </div>

          {/* Centered Save Button */}
          <div className="flex justify-center">
            <button
              onClick={saveTrackedSkills}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Tracked Skills"}
            </button>
          </div>

          {/* Message */}
          {message && (
            <p
              className={`mt-4 text-sm text-center ${
                message.startsWith("✅")
                  ? "text-green-600"
                  : message.startsWith("❌")
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {message}
            </p>
          )}
        </>
      ) : (
        <p className="text-gray-500">No skills found. Add your first skill above.</p>
      )}
    </div>
  );
};

export default SkillTrackerSection;
