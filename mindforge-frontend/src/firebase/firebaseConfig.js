// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTTQ16amJUvF_ty75p78H-3Je8BKRTNkc",
  authDomain: "mind-forge-f4e05.firebaseapp.com",
  projectId: "mind-forge-f4e05",
  storageBucket: "mind-forge-f4e05.firebasestorage.app",
  messagingSenderId: "623983967797",
  appId: "1:623983967797:web:3892d2b331438ee204fb7c",
  measurementId: "G-8Q6TYSN6QP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);

export { app, auth };
