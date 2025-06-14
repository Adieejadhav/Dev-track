import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
    apiKey: "AIzaSyBdyjHFWvhumQ3Ff1UDZQKF2c_LNcidqSA",
    authDomain: "dev-track-4b077.firebaseapp.com",
    projectId: "dev-track-4b077",
    storageBucket: "dev-track-4b077.firebasestorage.app",
    messagingSenderId: "393073038339",
    appId: "1:393073038339:web:52beb19a584352c632ea36"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
