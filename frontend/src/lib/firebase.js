// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjvUq_15-uaUhBRCu_JcQptLVePE_Mvaw",
  authDomain: "graduationprojectnotifications.firebaseapp.com",
  projectId: "graduationprojectnotifications",
  storageBucket: "graduationprojectnotifications.firebasestorage.app",
  messagingSenderId: "949293973103",
  appId: "1:949293973103:web:5bd3c486931981aeeb179a",
  measurementId: "G-LRJN7JXYXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);