import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

// Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWANNVIpbojCSl-kS3OcWBCYF4-6Eolvk",
  authDomain: "examination-system-829b8.firebaseapp.com",
  projectId: "examination-system-829b8",
  storageBucket: "examination-system-829b8.firebasestorage.app",
  messagingSenderId: "1083210379552",
  appId: "1:1083210379552:web:5ee81f69baf6d04cabe745",
  measurementId: "G-33G2CPT88M"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const messaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

export const fetchToken = async () => {
  try {
    const fcmMessaging = await messaging();
    if (fcmMessaging) {
      const token = await getToken(fcmMessaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
      });
      return token;
    }
    return null;
  } catch (err) {
    console.error("An error occurred while fetching the token:", err);
    return null;
  }
};

export { app, messaging };
