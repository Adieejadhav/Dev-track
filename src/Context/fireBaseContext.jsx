import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../Firebase/fireBaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// 1️⃣ Create context
const FirebaseContext = createContext();

// 2️⃣ Custom hook
export const useFirebase = () => useContext(FirebaseContext);

// 3️⃣ Provider component
export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Register
  const register = async (email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log("✅ Registered user:", res.user);
      return res;
    } catch (error) {
      console.error("❌ Error during registration:", error.message);
      throw error;
    }
  };

  // 🔓 Login
  const login = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Logged in user:", res.user);
      return res;
    } catch (error) {
      console.error("❌ Error during login:", error.message);
      throw error;
    }
  };

  // 🔒 Logout
  const logout = async () => {
    try {
      await signOut(auth);
      console.log("👋 User logged out");
    } catch (error) {
      console.error("❌ Error during logout:", error.message);
      throw error;
    }
  };

  // 👀 Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // console.log("👀 Auth state changed. Current user:", currentUser);
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🧠 Debug current state
  useEffect(() => {
    // console.log("🧠 Firebase Context Updated →", {
    //   user,
    //   loading,
    // });
  }, [user, loading]);

  return (
    <FirebaseContext.Provider
      value={{ user, loading, register, login, logout }}
    >
      {!loading && children}
    </FirebaseContext.Provider>
  );
};
