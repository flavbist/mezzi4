import { db, collection, addDoc, deleteDoc, doc } from "./firebase.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";

const storage = getStorage();

function checkPassword() {
    const passwordInput = document.getElementById("password").value;
    if (passwordInput === "171073") {
        document.getElementById("gestione-area").style.display = "block";
        document.getElementById("password").style.display = "none"; // Nasconde il campo password
    } else {
        alert("❌ Password errata! Riprova.");
    }
}

document.getElementById("mezzo-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const fileInput = document.getElementById("foto_mezzo");
    const files = fileInput.files;
    let imageUrls = [];

    if (files.length > 5) {
        alert("⚠️ Puoi caricare al massimo 5 immagini!");
        return;
    }

    try {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const storageRef = ref(storage, `mezzi/${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            imageUrls.push(url);
        }

        const nuovoMezzo = {
            nome_mezzo: document.getElementById("nome_mezzo").value,
            anno_prima_immatricolazione: parseInt(document.getElementById("anno_prima_immatricolazione").value),
            attrezzatura: document.getElementById("attrezzatura").value,
            anno_attrezzatura: parseInt(document.getElementById("anno_attrezzatura").value),
            km_percorsi: parseInt(document.getElementById("km_percorsi").value),
            note_varie: document.getElementById("note_varie").value,
            prezzo: parseFloat(document.getElementById("prezzo").value),
            foto: imageUrls
        };

        await addDoc(collection(db, "mezzi"), nuovoMezzo);
        
        alert("✅ Mezzo aggiunto con successo!");
        document.getElementById("mezzo-form").reset(); // Pulisce il modulo di inserimento

    } catch (error) {
        console.error("Errore durante l'aggiunta:", error);
        alert("❌ Errore durante l'aggiunta del mezzo. Riprova.");
    }
});

async function eliminaMezzo() {
    const codiceMezzo = document.getElementById("mezzo_codice").value;

    try {
        const mezzoRef = doc(db, "mezzi", codiceMezzo);
        await deleteDoc(mezzoRef);
        alert("✅ Mezzo eliminato con successo!");
    } catch (error) {
        console.error("Errore durante l'eliminazione:", error);
        alert("❌ Errore durante l'eliminazione del mezzo.");
    }
}

window.checkPassword = checkPassword;
window.eliminaMezzo = eliminaMezzo;
