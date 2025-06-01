import { db, collection, addDoc } from "./firebase.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";

const storage = getStorage();

// 🟢 Assicura che la funzione `checkPassword` sia disponibile globalmente
window.checkPassword = function () {
    const passwordInput = document.getElementById("password").value.trim();

    if (passwordInput === "171073") {
        console.log("✅ Password corretta! Sblocco gestione.");
        document.getElementById("gestione-area").style.display = "block";
        document.getElementById("elimina-mezzo").style.display = "block"; // 🟢 Ora anche il tasto eliminazione viene mostrato
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

        const nuovoMezzo = {
            nome_mezzo: document.getElementById("nome_mezzo").value,
            anno_prima_immatricolazione: parseInt(document.getElementById("anno_prima_immatricolazione").value),
            attrezzatura: document.getElementById("attrezzatura").value,
            prezzo: parseFloat(document.getElementById("prezzo").value),
            foto: imageUrls
        };

        await addDoc(collection(db, "mezzi"), nuovoMezzo);
        alert("✅ Mezzo aggiunto con successo!");
        document.getElementById("mezzo-form").reset();
    });
});
