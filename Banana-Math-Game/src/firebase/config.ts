import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Correct Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCs2WCkTd-PH5XLRzHubquXXKKTEohyo-M",
  authDomain: "banana-math-game-9cfe1.firebaseapp.com",
  projectId: "banana-math-game-9cfe1",

  // ✅ FIXED STORAGE BUCKET
  storageBucket: "banana-math-game-9cfe1.appspot.com",

  messagingSenderId: "1077183373741",
  appId: "1:1077183373741:web:38b751b3c87737929a0124",
  databaseURL: "https://banana-math-game-9cfe1-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
