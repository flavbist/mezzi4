import { db, collection, addDoc, deleteDoc, doc } from "./firebase.js";

function checkPassword() {
    const passwordInput = document.getElementById("password").value;
    if (passwordInput === "171073") {
        document.getElementById("gestione-area").style.display = "block";
    } else {
        alert("Password errata!");
    }
}

document.getElementById("mezzo-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const nuovoMezzo = {
        nome_mezzo: document.getElementById("nome_mezzo").value,
        anno_prima_immatricolazione: parseInt(document.getElementById("anno_prima_immatricolazione").value),
        attrezzatura: document.getElementById("attrezzatura").value,
        anno_attrezzatura: parseInt(document.getElementById("anno_attrezzatura").value),
        km_percorsi: parseInt(document.getElementById("km_percorsi").value),
        note_varie: document.getElementById("note_varie").value,
        prezzo: parseFloat(document.getElementById("prezzo").value)
    };

    try {
        await addDoc(collection(db, "mezzi"), nuovoMezzo);
        alert("Mezzo aggiunto con successo!");
    } catch (error) {
        console.error("Errore durante l'aggiunta:", error);
    }
});

async function eliminaMezzo() {
    const codiceMezzo = document.getElementById("mezzo_codice").value;

    try {
        const mezzoRef = doc(db, "mezzi", codiceMezzo);
        await deleteDoc(mezzoRef);
        alert("Mezzo eliminato con successo!");
    } catch (error) {
        console.error("Errore durante l'eliminazione:", error);
    }
}

window.checkPassword = checkPassword;
window.eliminaMezzo = eliminaMezzo;
