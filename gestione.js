import { db, collection, addDoc, getDocs, deleteDoc, doc, setDoc } from "./firebase.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";

const storage = getStorage();

// Funzione per il controllo password (non serve globale, usiamo event listener)
function checkPassword() {
    const passwordInput = document.getElementById("password").value.trim();
    if (passwordInput === "1710") {
        document.getElementById("gestione-area").style.display = "block";
        document.getElementById("login-area").style.display = "none";
    } else {
        alert("❌ Password errata! Riprova.");
    }
}

document.addEventListener("DOMContentLoaded", () => {

    // Collega il pulsante della password
    const passwordBtn = document.getElementById("password-btn");
    if (passwordBtn) passwordBtn.addEventListener("click", checkPassword);

    // GESTIONE INSERIMENTO NUOVO MEZZO
    const mezzoForm = document.getElementById("mezzo-form");
    if (mezzoForm) {
        mezzoForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            // 1. Trova codice FB progressivo
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
            const nuovoCodiceNumero = maxNumero + 1;
            const nuovoCodiceFB = `FB.${String(nuovoCodiceNumero).padStart(5, "0")}`;

            // 2. Carica foto (se presenti) su Firebase Storage nella cartella del mezzo
            const fileInput = document.getElementById("foto_mezzo");
            const files = fileInput.files;
            let imageUrls = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const storageRef = ref(storage, `mezzi/${nuovoCodiceFB}/foto_${i + 1}_${file.name}`);
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                imageUrls.push(url);
            }

            // 3. Prepara dati del mezzo
            const nuovoMezzo = {
                codice_fb: nuovoCodiceFB,
                nome_mezzo: document.getElementById("nome_mezzo").value,
                anno_prima_immatricolazione: document.getElementById("anno_prima_immatricolazione").value ? parseInt(document.getElementById("anno_prima_immatricolazione").value) : null,
                attrezzatura: document.getElementById("attrezzatura").value,
                anno_attrezzatura: document.getElementById("anno_attrezzatura").value ? parseInt(document.getElementById("anno_attrezzatura").value) : null,
                targa: document.getElementById("targa") ? document.getElementById("targa").value : "",
                km_percorsi: document.getElementById("km_percorsi").value ? parseInt(document.getElementById("km_percorsi").value) : null,
                note_varie: document.getElementById("note_varie").value,
                prezzo: document.getElementById("prezzo").value ? parseFloat(document.getElementById("prezzo").value) : null,
                foto: imageUrls
            };

            // 4. Salva su Firestore
            await addDoc(collection(db, "mezzi"), nuovoMezzo);

            document.getElementById("codice-generato").textContent = "Codice mezzo generato: " + nuovoCodiceFB;
            mezzoForm.reset();
        });
    }

    // GESTIONE ELIMINAZIONE MEZZO
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

    // GESTIONE MODIFICA MEZZO
    const cercaModificaBtn = document.getElementById("cerca-modifica-btn");
    const modificaForm = document.getElementById("modifica-form");
    const modificaResult = document.getElementById("modifica-result");

    let docIdMezzoDaModificare = null;

    if (cercaModificaBtn && modificaForm) {
        cercaModificaBtn.addEventListener("click", async function() {
            modificaResult.textContent = "";
            const codiceFB = document.getElementById("codice_modifica").value.trim();
            if (!codiceFB) {
                modificaResult.textContent = "Inserisci il codice FB.";
                modificaResult.style.color = "#e53935";
                return;
            }

            // Cerca il mezzo
            const querySnapshot = await getDocs(collection(db, "mezzi"));
            let trovato = null, docId = null;
            querySnapshot.forEach((docSnap) => {
                if (docSnap.data().codice_fb === codiceFB) {
                    trovato = docSnap.data();
                    docId = docSnap.id;
                }
            });

            if (!trovato) {
                modificaForm.style.display = "none";
                modificaResult.textContent = "Nessun mezzo trovato con quel codice FB.";
                modificaResult.style.color = "#e53935";
                return;
            }

            // Popola i campi
            docIdMezzoDaModificare = docId;
            modificaForm.style.display = "block";
            document.getElementById("mod_nome_mezzo").value = trovato.nome_mezzo || "";
            document.getElementById("mod_anno_prima_immatricolazione").value = trovato.anno_prima_immatricolazione || "";
            document.getElementById("mod_targa").value = trovato.targa || "";
            document.getElementById("mod_attrezzatura").value = trovato.attrezzatura || "";
            document.getElementById("mod_anno_attrezzatura").value = trovato.anno_attrezzatura || "";
            document.getElementById("mod_km_percorsi").value = trovato.km_percorsi || "";
            document.getElementById("mod_note_varie").value = trovato.note_varie || "";
            document.getElementById("mod_prezzo").value = trovato.prezzo || "";
            document.getElementById("mod_scadenza_assicurazione").value = trovato.scadenza_assicurazione || "";
            document.getElementById("mod_scadenza_revisione").value = trovato.scadenza_revisione || "";
        });

        modificaForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            if (!docIdMezzoDaModificare) return;
            try {
                const dati = {
                    nome_mezzo: document.getElementById("mod_nome_mezzo").value,
                    anno_prima_immatricolazione: parseInt(document.getElementById("mod_anno_prima_immatricolazione").value) || null,
                    targa: document.getElementById("mod_targa").value,
                    attrezzatura: document.getElementById("mod_attrezzatura").value,
                    anno_attrezzatura: parseInt(document.getElementById("mod_anno_attrezzatura").value) || null,
                    km_percorsi: parseInt(document.getElementById("mod_km_percorsi").value) || null,
                    note_varie: document.getElementById("mod_note_varie").value,
                    prezzo: parseFloat(document.getElementById("mod_prezzo").value) || null,
                    scadenza_assicurazione: document.getElementById("mod_scadenza_assicurazione").value || null,
                    scadenza_revisione: document.getElementById("mod_scadenza_revisione").value || null
                };
                await setDoc(doc(db, "mezzi", docIdMezzoDaModificare), {
                    ...dati,
                    codice_fb: document.getElementById("codice_modifica").value.trim()
                }, { merge: true });
                modificaResult.textContent = "Mezzo aggiornato!";
                modificaResult.style.color = "#43a047";
            } catch (err) {
                modificaResult.textContent = "Errore durante la modifica: " + err.message;
                modificaResult.style.color = "#e53935";
            }
        });
    }
});
