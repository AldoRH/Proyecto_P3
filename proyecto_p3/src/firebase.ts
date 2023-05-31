import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDuHVvQ0Xbk0ceVcT7LE6wt1qFE_wFTKZg",
  authDomain: "proyectop3-9cb75.firebaseapp.com",
  projectId: "proyectop3-9cb75",
  storageBucket: "proyectop3-9cb75.appspot.com",
  messagingSenderId: "531605249808",
  appId: "1:531605249808:web:2ccf64260a50e65b3ccf95",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
