// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

// Configurazione Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAQcE3-MInQ0cqfrEaAZc6ZlPYkidPijog",
    authDomain: "mezziusati-7f3af.firebaseapp.com",
    projectId: "mezziusati-7f3af",
    storageBucket: "mezziusati-7f3af.appspot.com",
    messagingSenderId: "250616706905",
    appId: "1:250616706905:web:98669a6bc4e6a1a4cffe48"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Esporta le funzioni necessarie
export { db, collection, getDocs, addDoc, deleteDoc, doc };
