import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAQcE3-MInQ0cqfrEaAZc6ZlPYkidPijog",
  authDomain: "mezziusati-7f3af.firebaseapp.com",
  projectId: "mezziusati-7f3af",
  storageBucket: "mezziusati-7f3af.appspot.com", // 🟢 Corretto
  messagingSenderId: "250616706905",
  appId: "1:250616706905:web:98669a6bc4e6a1a4cffe48"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, collection, getDocs, addDoc, deleteDoc, doc };
