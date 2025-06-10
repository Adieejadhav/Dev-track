// src/Utils/dailyProgressUtils.jsx
import { doc, getDoc, setDoc, updateDoc, deleteField } from "firebase/firestore";
import { db } from "../Firebase/fireBaseConfig";

// Save today's note
export const saveDailyNote = async (uid, date, note) => {
  const docRef = doc(db, "dailyProgress", uid);

  await setDoc(
    docRef,
    {
      entries: {
        [date]: {
          note,
          timestamp: new Date().toISOString(),
        },
      },
    },
    { merge: true }
  );
};

// Fetch all entries for a user
export const fetchDailyNotes = async (uid) => {
  const docRef = doc(db, "dailyProgress", uid);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return snapshot.data().entries || {};
  }
  return {};
};

// Delete a note by date
export const deleteDailyNote = async (uid, date) => {
  const docRef = doc(db, "dailyProgress", uid);
  await updateDoc(docRef, {
    [`entries.${date}`]: deleteField(),
  });
};

// Update a note by date
export const updateDailyNote = async (uid, date, newNote) => {
  const docRef = doc(db, "dailyProgress", uid);
  await updateDoc(docRef, {
    [`entries.${date}.note`]: newNote,
    [`entries.${date}.timestamp`]: new Date().toISOString(),
  });
};
