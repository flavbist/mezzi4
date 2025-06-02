import { db, collection, addDoc, getDocs, deleteDoc, doc } from "./firebase.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";

const storage = getStorage();

// Funzione GLOBALE per la password (necessario con type="module")
window.checkPassword = function () {
    const passwordInput = document.getElementById("password").value.trim();
    if (passwordInput === "171073") {
        document.getElementById("gestione-area").style.display = "block";
        document.getElementById("login-area").style.display = "none";
    } else {
        alert("❌ Password errata! Riprova.");
    }
};

// Gestione inserimento nuovo mezzo
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
                const storageRef = ref(storage, `mezzi/${Date.now()}_${file.name}`);
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
            const nuovoCodiceFB = `FB.${String(nuovoCodiceNumero).padStart(5, "0")}`;

            // 3. Crea oggetto mezzo
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

            document.getElementById("codice-generato").textContent = "Codice mezzo generato: " + nuovoCodiceFB;
            mezzoForm.reset();
        });
    }

    // Gestione eliminazione mezzo
    const eliminaForm = document.getElementById("elimina-form");
    const eliminaResult = document.getElementById("elimina-result");
    if (eliminaForm) {
        eliminaForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            eliminaResult.textContent = "";

            const codiceFB = document.getElementById("codice_elimina").value.trim();

            if (!codiceFB) {
                eliminaResult.textContent = "Inserisci il codice FB.";
                eliminaResult.style.color = "#e53935";
                return;
            }

            if (!confirm(`Sei sicuro di voler eliminare il mezzo con codice FB: "${codiceFB}"?\nQuesta operazione è irreversibile.`)) {
                return;
            }

            try {
                // Cerca il documento con quel codice FB
                const querySnapshot = await getDocs(collection(db, "mezzi"));
                let docId = null;
                querySnapshot.forEach((docSnap) => {
                    if (docSnap.data().codice_fb === codiceFB) {
                        docId = docSnap.id;
                    }
                });

                if (!docId) {
                    eliminaResult.textContent = "Nessun mezzo trovato con quel codice FB.";
                    eliminaResult.style.color = "#e53935";
                    return;
                }

                // Elimina il documento
                await deleteDoc(doc(db, "mezzi", docId));
                eliminaResult.textContent = "Mezzo eliminato con successo!";
                eliminaResult.style.color = "#43a047";
                eliminaForm.reset();
            } catch (err) {
                eliminaResult.textContent = "Errore durante l'eliminazione: " + err.message;
                eliminaResult.style.color = "#e53935";
            }
        });
    }
});
