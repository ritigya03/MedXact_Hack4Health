// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // For login
import { getFirestore } from "firebase/firestore"; // For database
import { getStorage } from "firebase/storage"; // For file uploads

const firebaseConfig = {
  apiKey: "AIzaSyCqvzTCMDRtqmhtxLV9LquEhuycbxArGrw",
  authDomain: "medxact-new.firebaseapp.com",
  projectId: "medxact-new",
  storageBucket: "medxact-new.appspot.com",
  messagingSenderId: "1061732675340",
  appId: "1:1061732675340:web:f5ded369baebf053436329"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
