import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getAuth,
  Auth,
  connectAuthEmulator,
  initializeAuth,
} from "firebase/auth";
import {
  getFirestore,
  Firestore,
  connectFirestoreEmulator,
} from "firebase/firestore";
import {
  getStorage,
  FirebaseStorage,
  connectStorageEmulator,
} from "firebase/storage";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase configuration interface
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// Environment-specific configurations
const configs: Record<string, FirebaseConfig> = {
  development: {
    apiKey: process.env.FIREBASE_API_KEY || "demo-api-key",
    authDomain:
      process.env.FIREBASE_AUTH_DOMAIN ||
      "beacon-core-platform-dev.firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "beacon-core-platform-dev",
    storageBucket:
      process.env.FIREBASE_STORAGE_BUCKET ||
      "beacon-core-platform-dev.appspot.com",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: process.env.FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  },
  staging: {
    apiKey: process.env.FIREBASE_API_KEY || "",
    authDomain:
      process.env.FIREBASE_AUTH_DOMAIN ||
      "beacon-core-platform-staging.firebaseapp.com",
    projectId:
      process.env.FIREBASE_PROJECT_ID || "beacon-core-platform-staging",
    storageBucket:
      process.env.FIREBASE_STORAGE_BUCKET ||
      "beacon-core-platform-staging.appspot.com",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.FIREBASE_APP_ID || "",
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  },
  production: {
    apiKey: process.env.FIREBASE_API_KEY || "",
    authDomain:
      process.env.FIREBASE_AUTH_DOMAIN ||
      "beacon-core-platform-prod.firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "beacon-core-platform-prod",
    storageBucket:
      process.env.FIREBASE_STORAGE_BUCKET ||
      "beacon-core-platform-prod.appspot.com",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.FIREBASE_APP_ID || "",
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  },
};

// Get current environment
const getEnvironment = (): string => {
  return process.env.NODE_ENV === "production"
    ? "production"
    : process.env.NODE_ENV === "staging"
      ? "staging"
      : "development";
};

// Get Firebase configuration for current environment
export const getFirebaseConfig = (): FirebaseConfig => {
  const env = getEnvironment();
  return configs[env];
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
    const config = getFirebaseConfig();
    app = initializeApp(config);
  } else {
    app = getApps()[0];
  }

  // Initialize services
  auth = getAuth(app);

  firestore = getFirestore(app);
  storage = getStorage(app);

  // Connect to emulators in development
  const env = getEnvironment();
  if (env === "development" && !auth.emulatorConfig) {
    try {
      connectAuthEmulator(auth, "http://localhost:9099");
      connectFirestoreEmulator(firestore, "localhost", 8080);
      connectStorageEmulator(storage, "localhost", 9199);
    } catch (error) {
      console.warn("Failed to connect to Firebase emulators:", error);
    }
  }

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
