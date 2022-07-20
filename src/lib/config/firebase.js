import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDKiMIn50lhqnLmsWF8wzet_7ZWd_4vVKw",
  authDomain: "fms-tuhita.firebaseapp.com",
  databaseURL:
    "https://fms-tuhita-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fms-tuhita",
  storageBucket: "fms-tuhita.appspot.com",
  messagingSenderId: "297737415919",
  appId: "1:297737415919:web:ec80da110064b1cd7abf1a",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const dataBase = getDatabase(app);
export const storage = getStorage(app)
