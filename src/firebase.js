// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDlvS22fhLOTwH_l9ZXN9q2kqfxE1RdMn8",
  authDomain: "super-mall-6b3a1.firebaseapp.com",
  projectId: "super-mall-6b3a1",
  storageBucket: "super-mall-6b3a1.firebasestorage.app",
  messagingSenderId: "1021885048229",
  appId: "1:1021885048229:web:98d7e8bc9ac0c83dd0b44c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app); // Authentication
const db = getFirestore(app); // Firestore Database
export { auth, signInWithEmailAndPassword, signOut, db };
