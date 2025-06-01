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

// 🟢 Evento per l'inserimento del mezzo con codice univoco
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
        foto: imageUrls
    };

    await addDoc(collection(db, "mezzi"), nuovoMezzo);
    alert(`✅ Mezzo aggiunto con successo! Codice assegnato: ${nuovoCodice}`);
    document.getElementById("mezzo-form").reset();
});
