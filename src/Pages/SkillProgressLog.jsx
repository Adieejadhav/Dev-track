import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../Firebase/fireBaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useFirebase } from "../Context/fireBaseContext";

const SkillProgressLog = () => {
  const { skillName } = useParams();
  const { user } = useFirebase();
  const [logText, setLogText] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLogId, setEditingLogId] = useState(null);
  const [editText, setEditText] = useState("");

  const logsRef = collection(
    db,
    "users",
    user.uid,
    "trackedSkills",
    skillName,
    "logs"
  );

  const fetchLogs = async () => {
    setLoading(true);
    const q = query(logsRef, orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setLogs(data);
    setLoading(false);
  };

  const handleAddLog = async () => {
    if (!logText.trim()) return;

    await addDoc(logsRef, {
      text: logText,
      date: new Date().toISOString(),
    });

    setLogText("");
    fetchLogs();
  };

  const handleSaveEdit = async (logId) => {
    if (!editText.trim()) return;

    const logDocRef = doc(
      db,
      "users",
      user.uid,
      "trackedSkills",
      skillName,
      "logs",
      logId
    );
    await updateDoc(logDocRef, {
      text: editText,
    });
    setEditingLogId(null);
    setEditText("");
    fetchLogs();
  };

  const handleDeleteLog = async (logId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this log?");
    if (!confirmDelete) return;

    const logDocRef = doc(
      db,
      "users",
      user.uid,
      "trackedSkills",
      skillName,
      "logs",
      logId
    );
    await deleteDoc(logDocRef);
    fetchLogs();
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    if (user?.uid) fetchLogs();
  }, [user]);

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 py-16 px-4">
      <div className="w-full max-w-4xl bg-white/90 border border-gray-200 rounded-3xl backdrop-blur-md shadow-2xl p-10">
        <h2 className="text-4xl font-bold text-center text-indigo-700 mb-8">
          🛠️ {skillName} – Progress Log
        </h2>

        <textarea
          className="w-full p-5 text-base border border-gray-300 rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none transition"
          rows={5}
          placeholder="What did you learn or practice today?"
          value={logText}
          onChange={(e) => setLogText(e.target.value)}
        />

        <div className="text-right mt-4">
          <button
            onClick={handleAddLog}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:brightness-110 transition shadow-md"
          >
            ➕ Save Progress
          </button>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            📚 Your Logs
          </h3>

          {loading ? (
            <p className="text-gray-500 italic">Loading logs...</p>
          ) : logs.length === 0 ? (
            <p className="text-gray-500 italic">No logs yet. Start by adding your first entry.</p>
          ) : (
            <ul className="space-y-4">
              {logs.map((log) => (
                <li
                  key={log.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-400">{formatDate(log.date)}</span>
                    <div className="space-x-3">
                      <button
                        onClick={() => {
                          setEditingLogId(log.id);
                          setEditText(log.text);
                        }}
                        className="text-indigo-500 text-sm"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        className="text-red-500 text-sm"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>

                  {editingLogId === log.id ? (
                    <>
                      <textarea
                        className="w-full border border-gray-300 p-2 rounded-lg mb-2"
                        rows={3}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleSaveEdit(log.id)}
                          className="text-green-600 font-semibold"
                        >
                          ✅ Save
                        </button>
                        <button
                          onClick={() => setEditingLogId(null)}
                          className="text-gray-500"
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-800">{log.text}</div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillProgressLog;
