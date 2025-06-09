import React, { useState, useEffect } from "react";
import { useFirebase } from "../Context/fireBaseContext";

const SkillTrackerSection = ({ primarySkills = [], trackedSkills = [], onUpdate }) => {
  const firebase = useFirebase();

  const [allSkills, setAllSkills] = useState([]);
  const [tracked, setTracked] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [newlyAddedSkills, setNewlyAddedSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Remove primary skills from tracked/allSkills initially
  useEffect(() => {
    const cleanedTracked = trackedSkills.filter(skill => !primarySkills.includes(skill));
    const cleanedAll = [...new Set([...cleanedTracked])]; // Avoid primary duplication

    setAllSkills(cleanedAll);
    setTracked(cleanedTracked);
    setNewlyAddedSkills([]);
  }, [trackedSkills, primarySkills]);

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

    if (allSkills.includes(skill) || primarySkills.includes(skill)) {
      setMessage("❗ Skill already exists.");
      return;
    }

    setAllSkills(prev => [...prev, skill]);
    setTracked(prev => [...prev, skill]);
    setNewlyAddedSkills(prev => [...prev, skill]);
    setNewSkill("");
    setMessage("ℹ️ New skill added to tracked. Click save to store it.");
  };

  const saveTrackedSkills = async () => {
    setLoading(true);
    try {
      await firebase.updateTrackedSkills(firebase.user.uid, tracked);
      setMessage(`✅ Saved tracked skills: ${tracked.join(", ")}`);
      setNewlyAddedSkills([]);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to update tracked skills.");
    } finally {
      setLoading(false);
    }
  };

  const promoteSkill = async (skill) => {
    try {
      const updatedPrimary = [...new Set([...primarySkills, skill])];
      const updatedTracked = tracked.filter(s => s !== skill);
      const updatedAllSkills = allSkills.filter(s => s !== skill);

      await firebase.updatePrimarySkills(firebase.user.uid, updatedPrimary);
      await firebase.updateTrackedSkills(firebase.user.uid, updatedTracked);

      setTracked(updatedTracked);
      setAllSkills(updatedAllSkills);
      setMessage(`🎉 ${skill} has been promoted to your Primary Skills.`);

      if (onUpdate) onUpdate();
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to promote skill.");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-xl mx-auto">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Skill Tracker</h2>

      {/* Input */}
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

      {/* Tracked Skills */}
      {allSkills.length > 0 ? (
        <>
          <h3 className="text-md font-semibold mb-2 text-gray-700">Currently Tracked Skills</h3>
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

          {/* Save Tracked */}
          <div className="flex justify-center mb-6">
            <button
              onClick={saveTrackedSkills}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Tracked Skills"}
            </button>
          </div>

          {/* Promote to Primary */}
          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2 text-purple-700">Promote to Primary Skills</h3>
            <div className="flex flex-wrap gap-3">
              {tracked.map(skill => (
                <button
                  key={skill}
                  onClick={() => promoteSkill(skill)}
                  className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full border border-purple-300 hover:bg-purple-200"
                >
                  {skill} ➕ Promote
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          {message && (
            <p
              className={`mt-4 text-sm text-center ${
                message.startsWith("✅") || message.startsWith("🎉")
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
        <p className="text-gray-500">No tracked skills yet. Add one above.</p>
      )}
    </div>
  );
};

export default SkillTrackerSection;
