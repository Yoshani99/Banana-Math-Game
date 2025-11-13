
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCs2WCkTd-PH5XLRzHubquXXKKTEohyo-M",
  authDomain: "banana-math-game-9cfe1.firebaseapp.com",
  projectId: "banana-math-game-9cfe1",
  storageBucket: "banana-math-game-9cfe1.firebasestorage.app",
  messagingSenderId: "1077183373741",
  appId: "1:1077183373741:web:38b751b3c87737929a0124"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);