import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../Firebase/fireBaseConfig";
import { db } from "../Firebase/fireBaseConfig";
import { doc,setDoc } from "firebase/firestore";
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

      const addUserData = async (uid,userData) => {
          const userRef = doc(db,"users",uid)
          await setDoc(userRef,userData)
      }


      const register = async (email, password,userData) => {
        try {
          const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
          const uid = userCredentials.user.uid
          await addUserData(uid,userData)
          console.log("✅ Registered user:", userCredentials.user);
          return userCredentials;
        } catch (error) {
          console.error("❌ Error during registration:", error.message);
          throw error;
        }
      };


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


      const logout = async () => {
        try {
          await signOut(auth);
          console.log("👋 User logged out");
        } catch (error) {
          console.error("❌ Error during logout:", error.message);
          throw error;
        }
      };


      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          
          setUser(currentUser);
          setLoading(false);
        });

        return () => unsubscribe();
      }, []);


      useEffect(() => {
      }, [user, loading]);

      return (
        <FirebaseContext.Provider
          value={{ user, loading, register, login, logout }}
        >
          {!loading && children}
        </FirebaseContext.Provider>
      );
  };
