import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyA1SDyweRO26f-FttilUouHoWU9GmFO_3g",
  authDomain: "mezzi-82b21.firebaseapp.com",
  projectId: "mezzi-82b21",
  storageBucket: "mezzi-82b21.appspot.com", // 🟢 Corretto!
  messagingSenderId: "502246532238",
  appId: "1:502246532238:web:1d26e5c6be0a89f0df15df"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, collection, getDocs, addDoc, deleteDoc, doc };




