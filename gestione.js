import { db, collection, addDoc, getDocs, deleteDoc, doc } from "./firebase.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";

const storage = getStorage();

// 🟢 Funzione globale per sbloccare l'area gestione
window.checkPassword = function () {
    const passwordInput = document.getElementById("password").value.trim();

    if (passwordInput === "171073") {
        document.getElementById("gestione-area").style.display = "block";
        document.getElementById("login-area").style.display = "none";
    } else {
        alert("❌ Password errata! Riprova.");
    }
};

// 🟢 Gestione inserimento nuovo mezzo
document.addEventListener("DOMContentLoaded", () => {
    // Inserisci mezzo
    const mezzoForm = document.getElementById("mezzo-form");
    if (mezzoForm) {
        mezzoForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const fileInput = document.getElementById("foto_mezzo");
            const files = fileInput.files;
            let imageUrls = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const storageRef = ref(storage, `mezzi/${file.name}`);
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                imageUrls.push(url);
            }

            // 1. Ottieni tutti i codici esistenti
            const mezziSnapshot = await getDocs(collection(db, "mezzi"));
            let maxNumero = 0;
            mezziSnapshot.forEach(docSnap => {
                const codice = docSnap.data().codice_fb;
                if (codice) {
                    const match = codice.match(/^FB\.(\d{5})$/);
                    if (match) {
                        const numero = parseInt(match[1]);
                        if (!isNaN(numero) && numero > maxNumero) {
                            maxNumero = numero;
                        }
                    }
                }
            });

            // 2. Calcola il nuovo codice incrementale
            const nuovoCodiceNumero = maxNumero + 1;
            const nuovoCodiceFB = `
