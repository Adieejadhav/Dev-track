import { useState, useEffect } from "react";
import { useFirebase } from "../Context/fireBaseContext";
import {
  saveDailyNote,
  fetchDailyNotes,
  updateDailyNote,
  deleteDailyNote,
} from "../Context/dailyProgressUtils";

const DailyProgressSection = () => {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState({});
  const [editingDate, setEditingDate] = useState(null);
  const [editingNote, setEditingNote] = useState("");
  const [totalEntries, setTotalEntries] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const firebase = useFirebase();
  const today = new Date().toISOString().slice(0, 10); // yyyy-mm-dd format

  const handleSaveNote = async () => {
    if (!note.trim()) return;
    setLoading(true);

    try {
      const user = firebase.user;
      if (!user) throw new Error("User not authenticated");

      await saveDailyNote(user.uid, today, note.trim());

      setEntries((prev) => ({
        ...prev,
        [today]: {
          note: note.trim(),
          timestamp: new Date().toISOString(),
        },
      }));

      setNote("");


    } catch (err) {
      console.error("Error:", err);
      alert("Failed to save note.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const user = firebase.user;
        if (!user) return;

        const data = await fetchDailyNotes(user.uid);
        setEntries(data);
        const allDates = Object.keys(data);
        setTotalEntries(allDates.length);
        setCurrentStreak(calculateStreak(allDates));

      } catch (err) {
        console.error("Failed to load notes:", err);
      }
    };

    loadEntries();
  }, [firebase.user]);


  const handleSaveEdit = async (date) => {
    try {
      const user = firebase.user;
      if (!user) return;

      await updateDailyNote(user.uid, date, editingNote.trim());

      // Update local state
      setEntries((prev) => ({
        ...prev,
        [date]: {
          ...prev[date],
          note: editingNote.trim(),
          timestamp: new Date().toISOString(),
        },
      }));

      setEditingDate(null);
      setEditingNote("");
    } catch (err) {
      console.error("Error updating note:", err);
      alert("Failed to update note.");
    }
  };


  const handleDelete = async (date) => {
    const confirm = window.confirm("Are you sure you want to delete this entry?");
    if (!confirm) return;

    try {
      const user = firebase.user;
      if (!user) return;

      await deleteDailyNote(user.uid, date);

      // Remove from UI
      setEntries((prev) => {
        const updated = { ...prev };
        delete updated[date];
        return updated;
      });
    } catch (err) {
      console.error("Error deleting note:", err);
      alert("Failed to delete note.");
    }
  };


  const calculateStreak = (dates) => {
    const sorted = dates
    .map((d) => new Date(d))
    .sort((a, b) => b - a); // descending

    let streak = 0;
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let date of sorted) {
    const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0 || diffDays === streak) {
    streak++;
    } else {
    break;
    }
    today.setDate(today.getDate() - 1);
    }

    return streak;
    };



  const handleEdit = (date, note) => {
    setEditingDate(date);
    setEditingNote(note);
  };

  return (
    <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-red-100 rounded-2xl p-6 shadow-lg max-w-xl mx-auto">
      {/* Header */}
      <h2 className="flex items-center text-2xl font-bold text-purple-700 mb-6 select-none">
        <span className="mr-2 animate-pulse">📅</span> Daily Progress Log
      </h2>

      {/* Input Box */}
      <div className="mb-5">
        <label
          htmlFor="daily-note"
          className="block mb-1 font-semibold text-purple-800"
        >
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
        <h3 className="text-lg font-semibold text-purple-700 mb-3">
          Past Entries
        </h3>
        {Object.keys(entries).length === 0 ? (
          <p className="text-sm text-purple-600 italic text-center">
            No entries yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {Object.entries(entries)
              .sort(
                (a, b) => new Date(b[1].timestamp) - new Date(a[1].timestamp)
              )
              .map(([date, entry]) => (
                <li key={date} className="bg-purple-50 rounded-lg p-3 shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-mono text-purple-700 mb-1">
                        {date}
                      </p>
                      {editingDate === date ? (
                        <>
                          <textarea
                            value={editingNote}
                            onChange={(e) => setEditingNote(e.target.value)}
                            rows={3}
                            className="w-full mt-1 rounded border border-purple-300 p-2 text-sm"
                          />
                          <div className="flex gap-2 mt-1">
                            <button
                              onClick={() => handleSaveEdit(date)}
                              className="text-xs text-green-700 font-semibold"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingDate(null);
                                setEditingNote("");
                              }}
                              className="text-xs text-gray-500"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-800 text-sm whitespace-pre-line">
                          {entry.note}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(date, entry.note)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(date)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* Stats Section - Placeholder */}
      <div className="mt-6 flex justify-around text-purple-700 font-semibold text-center">
        <div>
          <p className="text-2xl">{currentStreak}</p>
          <p className="text-sm">Current Streak</p>
        </div>
        <div>
          <p className="text-2xl">{totalEntries}</p>
          <p className="text-sm">Total Entries</p>
        </div>
      </div>
    </div>
  );
};

export default DailyProgressSection;
