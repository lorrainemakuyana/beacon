// firebase/config.ts
import { FirebaseApp } from "firebase/app";
import { Auth } from "firebase/auth";
import { Firestore } from "firebase/firestore";
import { FirebaseStorage } from "firebase/storage";
import { Platform } from "react-native";

export const firebaseConfig =
  Platform.OS === "web"
    ? require("./config.web").firebaseConfig
    : require("./config.native").firebaseConfig;

export const getFirebaseServices: () => {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  storage: FirebaseStorage;
} =
  Platform.OS === "web"
    ? require("./config.web").getFirebaseServices
    : require("./config.native").getFirebaseServices;
