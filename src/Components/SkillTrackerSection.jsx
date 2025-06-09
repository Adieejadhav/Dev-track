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

  useEffect(() => {
    const cleanedTracked = trackedSkills.filter(skill => !primarySkills.includes(skill));
    const cleanedAll = [...new Set([...cleanedTracked])];
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
  <div className="bg-gradient-to-tr from-indigo-50 to-purple-100 shadow-2xl rounded-3xl p-8 w-full max-w-xl mx-auto border border-indigo-200">

    <h2 className="text-2xl font-extrabold text-indigo-900 mb-8 text-center">
      🛠️ Skill Tracker
    </h2>

    {/* Add Skill Section */}
    <section className="mb-8 p-4 bg-white rounded-xl shadow-sm border border-indigo-100">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add a new skill"
          className="flex-1 px-4 py-3 border border-indigo-300 rounded-xl text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />
        <button
          onClick={handleAddSkill}
          className="bg-purple-600 text-white px-5 py-3 rounded-xl hover:bg-purple-700 shadow-md transition"
          aria-label="Add new skill"
        >
          Add Skill
        </button>
      </div>
    </section>

    {/* Tracked Skills & Save Section */}
    {allSkills.length > 0 && (
      <section className="mb-8 p-4 bg-white rounded-xl shadow-sm border border-indigo-100">
        <h3 className="text-lg font-semibold mb-3 text-indigo-800 text-center">
          Currently Tracked Skills
        </h3>
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {allSkills.map((skill) => {
            const isNew = newlyAddedSkills.includes(skill);
            const isTracked = tracked.includes(skill);

            const baseClasses = "px-5 py-2 rounded-full text-sm font-semibold border transition cursor-pointer select-none";

            const classes = isNew
              ? isTracked
                ? `bg-yellow-400 text-white border-yellow-500 hover:brightness-110 shadow-lg`
                : `bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200`
              : isTracked
              ? `bg-indigo-600 text-white border-indigo-600 hover:brightness-110 shadow-lg`
              : `bg-indigo-100 text-indigo-800 border-indigo-300 hover:bg-indigo-200`;

            return (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`${baseClasses} ${classes}`}
              >
                {skill}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button
            onClick={saveTrackedSkills}
            disabled={loading}
            className="bg-indigo-700 text-white px-6 py-3 rounded-xl hover:bg-indigo-800 disabled:opacity-50 shadow-md transition"
          >
            {loading ? "Saving..." : "Save Tracked Skills"}
          </button>
        </div>
      </section>
    )}

    {/* Promote to Primary Section */}
    {tracked.length > 0 && (
      <section className="p-4 bg-purple-50 rounded-xl shadow-inner border border-purple-200">
        <h3 className="text-lg font-semibold mb-3 text-purple-800 text-center">
          Promote to Primary Skills
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          {tracked.map(skill => (
            <button
              key={skill}
              onClick={() => promoteSkill(skill)}
              className="bg-purple-200 text-purple-900 px-5 py-2 rounded-full border border-purple-400 hover:bg-purple-300 shadow-sm transition"
            >
              {skill} ➕ Promote
            </button>
          ))}
        </div>
      </section>
    )}

    {/* Message */}
    {message && (
      <p
        className={`mt-6 text-center text-sm ${
          message.startsWith("✅") || message.startsWith("🎉")
            ? "text-green-700"
            : message.startsWith("❌")
            ? "text-red-600"
            : "text-yellow-700"
        }`}
      >
        {message}
      </p>
    )}

    {/* No tracked skills message */}
    {allSkills.length === 0 && (
      <p className="text-indigo-400 text-center italic mt-8">
        No tracked skills yet. Add one above.
      </p>
    )}
  </div>
);

};

export default SkillTrackerSection;
