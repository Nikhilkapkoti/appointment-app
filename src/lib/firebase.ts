import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD9y1mDmys2hQ04JvXIdXD940Dncty0x4M",
  authDomain: "quick-bite-48206.firebaseapp.com",
  projectId: "quick-bite-48206",
  storageBucket: "quick-bite-48206.appspot.com",
  messagingSenderId: "445304718589",
  appId: "1:445304718589:web:05cd8a39bb4d622e432a94",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);