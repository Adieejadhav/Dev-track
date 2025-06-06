
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../Firebase/fireBaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";


const FirebaseContext = createContext();


export const useFirebase = () => useContext(FirebaseContext);


export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  const register = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);


  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);


  const logout = () => signOut(auth);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe(); 
  }, []);

  return (
    <FirebaseContext.Provider
      value={{ user, loading, register, login, logout }}
    >
      {!loading && children}
    </FirebaseContext.Provider>
  );
};
