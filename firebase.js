
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAX7IwBXOUAkOtgfNDetHpJ9aJXzG6aZiQ",
  authDomain: "markdown-notes-fd19a.firebaseapp.com",
  projectId: "markdown-notes-fd19a",
  storageBucket: "markdown-notes-fd19a.appspot.com",
  messagingSenderId: "563537394241",
  appId: "1:563537394241:web:85d5391d49ffc3090be4c0",
  measurementId: "G-2JX5S01KQ8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const notesCollection = collection(db, "notes");
export const analytics = getAnalytics(app);
