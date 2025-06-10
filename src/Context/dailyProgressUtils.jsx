import { collection, query, where, getDocs, addDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "./fireBaseConfig";

// Save or update today's note
export const saveDailyNote = async (uid, note) => {
  const today = new Date().toISOString().slice(0, 10);
  const progressRef = collection(db, "users", uid, "dailyProgress");

  const q = query(progressRef, where("date", "==", today));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const docRef = snapshot.docs[0].ref;
    await updateDoc(docRef, {
      note,
      timestamp: Timestamp.now(),
    });
  } else {
    await addDoc(progressRef, {
      note,
      date: today,
      timestamp: Timestamp.now(),
    });
  }
};
