import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Firebase web configuration for the MindForge project.
const firebaseConfig = {
  apiKey: "AIzaSyBTTQ16amJUvF_ty75p78H-3Je8BKRTNkc",
  authDomain: "mind-forge-f4e05.firebaseapp.com",
  projectId: "mind-forge-f4e05",
  storageBucket: "mind-forge-f4e05.firebasestorage.app",
  messagingSenderId: "623983967797",
  appId: "1:623983967797:web:3892d2b331438ee204fb7c",
  measurementId: "G-8Q6TYSN6QP",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

// Analytics is optional. It must never prevent authentication from initializing
// in browsers/environments where Firebase Analytics is unsupported.
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) getAnalytics(app);
    })
    .catch((error) => {
      console.warn("Firebase Analytics is unavailable; authentication can continue.", error);
    });
}

export { app, auth };
