// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnWQfHVNvsIKlG65v9x4bP-def2BkZ4lI",
  authDomain: "manabudget-42b17.firebaseapp.com",
  projectId: "manabudget-42b17",
  storageBucket: "manabudget-42b17.firebasestorage.app",
  messagingSenderId: "297541501193",
  appId: "1:297541501193:web:3dd8402e491407942553d8",
  measurementId: "G-SN0D6TK0LX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { db, auth };
