import { db, collection, addDoc, getDocs } from "./firebase.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";

const storage = getStorage();

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

        // 🔴 1. Ottieni tutti i codici esistenti
        const mezziSnapshot = await getDocs(collection(db, "mezzi"));
        let maxNumero = 0;
        mezziSnapshot.forEach(doc => {
            const codice = doc.data().codice_fb;
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

        // 🔴 2. Calcola il nuovo codice incrementale
        const nuovoCodiceNumero = maxNumero + 1;
        const nuovoCodiceFB = `FB.${String(nuovoCodiceNumero).padStart(5, "0")}`;

        // 🔴 3. Crea il nuovo oggetto mezzo, incluso il codice univoco (e altri campi del form)
        const nuovoMezzo = {
            codice_fb: nuovoCodiceFB,
            nome_mezzo: document.getElementById("nome_mezzo").value,
            anno_prima_immatricolazione: parseInt(document.getElementById("anno_prima_immatricolazione").value),
            attrezzatura: document.getElementById("attrezzatura").value,
            anno_attrezzatura: document.getElementById("anno_attrezzatura").value ? parseInt(document.getElementById("anno_attrezzatura").value) : null,
            km_percorsi: document.getElementById("km_percorsi").value ? parseInt(document.getElementById("km_percorsi").value) : null,
            note_varie: document.getElementById("note_varie").value,
            prezzo: parseFloat(document.getElementById("prezzo").value),
            foto: imageUrls
        };

        await addDoc(collection(db, "mezzi"), nuovoMezzo);

        // Mostra il codice generato nella pagina
        document.getElementById("codice-generato").textContent = "Codice mezzo generato: " + nuovoCodiceFB;

        document.getElementById("mezzo-form").reset();
    });
});
