import { useState } from "react";
import { useFirebase } from "../Context/fireBaseContext";
import { saveDailyNote } from "../Context/dailyProgressUtils";


const DailyProgressSection = () => {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const firebase = useFirebase();
  const today = new Date().toISOString().slice(0, 10); // yyyy-mm-dd format


  const handleSaveNote = async () => {
    if (!note.trim()) return;
    setLoading(true);

    try {
      const user = firebase.user;
      if (!user) throw new Error("User not authenticated");

      await saveDailyNote(user.uid, today, note.trim());

      alert("Note saved!");
      setNote("");
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to save note.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-red-100 rounded-2xl p-6 shadow-lg max-w-xl mx-auto">
      {/* Header */}
      <h2 className="flex items-center text-2xl font-bold text-purple-700 mb-6 select-none">
        <span className="mr-2 animate-pulse">📅</span> Daily Progress Log
      </h2>

      {/* Input Box */}
      <div className="mb-5">
        <label htmlFor="daily-note" className="block mb-1 font-semibold text-purple-800">
          Note for <span className="font-mono">{today}</span>:
        </label>
        <textarea
          id="daily-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write about what you did or learned today..."
          rows={5}
          maxLength={500}
          className="w-full rounded-lg border border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 resize-none p-3 text-gray-800 placeholder-purple-400 transition"
        />
        <p className="text-sm text-right text-purple-600 mt-1">
          {note.length} / 500 characters
        </p>
      </div>

      {/* Save Button */}
      <button
        type="button"
        onClick={handleSaveNote}
        disabled={!note.trim() || loading}
        className={`w-full py-3 rounded-lg font-semibold text-white transition ${
          note.trim() && !loading
            ? "bg-purple-600 hover:bg-purple-700 active:bg-purple-800"
            : "bg-purple-300 cursor-not-allowed"
        }`}
      >
        {loading ? "Saving..." : "Save Today's Note"}
      </button>


      {/* Past Entries - Placeholder */}
      <div className="mt-8 max-h-64 overflow-y-auto bg-white rounded-lg shadow-inner p-4">
        <h3 className="text-lg font-semibold text-purple-700 mb-3">Past Entries</h3>
        <p className="text-sm text-purple-600 italic text-center">No entries yet.</p>
      </div>

      {/* Stats Section - Placeholder */}
      <div className="mt-6 flex justify-around text-purple-700 font-semibold text-center">
        <div>
          <p className="text-2xl">0</p>
          <p className="text-sm">Current Streak</p>
        </div>
        <div>
          <p className="text-2xl">0</p>
          <p className="text-sm">Total Entries</p>
        </div>
      </div>
    </div>
  );
};

export default DailyProgressSection;
