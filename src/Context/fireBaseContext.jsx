import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../Firebase/fireBaseConfig";
import { db } from "../Firebase/fireBaseConfig";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";

const FirebaseContext = createContext();

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add user data to Firestore on registration
  const addUserData = async (uid, userData) => {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, userData);
  };

  // Register with email, password and userData
  const register = async (email, password, userData) => {
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredentials.user.uid;
      await addUserData(uid, userData);
      console.log("✅ Registered user:", userCredentials.user);
      return userCredentials;
    } catch (error) {
      console.error("❌ Error during registration:", error.message);
      throw error;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Logged in user:", userCredentials.user);
      return userCredentials;
    } catch (error) {
      console.error("❌ Error during login:", error.message);
      throw error;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await signOut(auth);
      console.log("👋 User logged out");
    } catch (error) {
      console.error("❌ Error during logout:", error.message);
      throw error;
    }
  };

  const updatePrimarySkills = async (uid, primarySkills) => {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      primarySkills,
    });
  };


  // In FirebaseProvider, add this function:
  const updateTrackedSkills = async (uid, trackedSkills) => {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { trackedSkills });
  };


  // Fetch full user profile data from Firestore
  const getUserData = async (uid) => {
    if (!uid) return null;
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  };

  // Initialize trackedSkills field if missing
  const initializeTrackedSkills = async (uid, primarySkills = []) => {
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (!data.trackedSkills) {
        await updateDoc(userRef, {
          trackedSkills: primarySkills,
        });
        console.log("Tracked skills initialized.");
      } else {
        console.log("Tracked skills already initialized.");
      }
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <FirebaseContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        getUserData,
        initializeTrackedSkills,
        updateTrackedSkills,
        updatePrimarySkills
      }}
    >
      {!loading && children}
    </FirebaseContext.Provider>
  );
};
