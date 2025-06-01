import { db, collection, addDoc, getDocs, query, orderBy, limit } from "./firebase.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";

const storage = getStorage();

// 🟢 Funzione per ottenere l'ultimo codice e generarne uno nuovo
async function generaCodiceUnivoco() {
    const mezziRef = collection(db, "mezzi");
    const q = query(mezziRef, orderBy("codice_mezzo", "desc"), limit(1));

    try {
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
            return "FB-0001"; // 🟢 Primo codice se il database è vuoto
        }

        const ultimoMezzo = snapshot.docs[0].data();
        const ultimoCodice = ultimoMezzo.codice_mezzo;
        
        const numero = parseInt(ultimoCodice.split("-")[1]) + 1; // 🟢 Incremento numero
        return `FB-${numero.toString().padStart(4, "0")}`; // 🟢 Formattazione esatta
    } catch (error) {
        console.error("❌ Errore nella generazione del codice:", error);
        return null;
    }
}

// 🟢 Assicura che la funzione `checkPassword` sia disponibile globalmente
window.checkPassword = function () {
    const passwordInput = document.getElementById("password").value.trim();

    if (passwordInput === "171073") {
        console.log("✅ Password corretta! Sblocco gestione.");
        document.getElementById("gestione-area").style.display = "block";
        document.getElementById("password").style.display = "none";
        document.getElementById("password-btn").style.display = "none";
    } else {
        console.log("❌ Password errata!");
        alert("❌ Password errata! Riprova.");
    }
};

// 🟢 Sblocca il modulo gestione solo se il DOM è pronto
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("mezzo-form").addEventListener("submit", async (event) => {
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

        const nuovoCodice = await generaCodiceUnivoco();
        if (!nuovoCodice) {
            alert("❌ Errore nella generazione del codice! Riprova.");
            return;
        }

        const nuovoMezzo = {
            codice_mezzo: nuovoCodice, // 🟢 Codice univoco generato automaticamente
            nome_mezzo: document.getElementById("nome_mezzo").value,
            anno_prima_immatricolazione: parseInt(document.getElementById("anno_prima_immatricolazione").value),
            attrezzatura: document.getElementById("attrezzatura").value,
            prezzo: parseFloat(document.getElementById("prezzo").value),
            foto: imageUrls.length > 0 ? imageUrls : null // 🟢 Mezzo salvato anche senza immagini
        };

        await addDoc(collection(db, "mezzi"), nuovoMezzo);
        alert(`✅ Mezzo aggiunto con successo! Codice assegnato: ${nuovoCodice}`);
        document.getElementById("mezzo-form").reset();
    });
import { db, collection, doc, deleteDoc, getDocs, query, where } from "./firebase.js";

// 🟢 Funzione per eliminare un mezzo dato il codice FB
window.eliminaMezzo = async function () {
    const codiceFB = document.getElementById("codice_elimina").value.trim();

    if (!codiceFB) {
        alert("❌ Inserisci un codice FB valido!");
        return;
    }

    const conferma = confirm(`⚠️ Sei sicuro di voler eliminare il mezzo con codice ${codiceFB}? Questa operazione è irreversibile.`);
    if (!conferma) return;

    try {
        const mezziRef = collection(db, "mezzi");
        const q = query(mezziRef, where("codice_mezzo", "==", codiceFB));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            alert("❌ Nessun mezzo trovato con questo codice FB.");
            return;
        }

        const mezzoId = snapshot.docs[0].id; // 🟢 Ottieni l'ID del documento nel database
        await deleteDoc(doc(db, "mezzi", mezzoId));

        alert("✅ Mezzo eliminato con successo!");
        document.getElementById("codice_elimina").value = ""; // 🟢 Reset campo input
    } catch (error) {
        console.error("❌ Errore nella cancellazione del mezzo:", error);
        alert("❌ Errore durante l'eliminazione. Controlla la connessione con Firebase.");
    }
};

    
});
