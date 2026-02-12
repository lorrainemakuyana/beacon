import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
// @ts-ignore
import { getAuth, Auth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
// Uses environment variables if available, otherwise falls back to hardcoded values
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase app
let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: FirebaseStorage;

export const initializeFirebase = (): {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  storage: FirebaseStorage;
} => {
  // Only initialize once
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    
    // Initialize Auth with React Native Local persistence
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    })

  } else {
    app = getApps()[0];
    auth = getAuth(app);
  }

  // Initialize services
  firestore = getFirestore(app);
  storage = getStorage(app);

  return { app, auth, firestore, storage };
};

// Export initialized services
export const getFirebaseServices = () => {
  if (!app) {
    return initializeFirebase();
  }
  return { app, auth, firestore, storage };
};

// Export individual services for convenience
export { app, auth, firestore, storage };
