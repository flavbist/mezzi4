import { db, doc, getDoc, collection, getDocs, query, where } from "./firebase.js";

function getMezzoIdentifierFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function mostraCodiceMezzo(codice) {
    const codiceDiv = document.getElementById("codice-mezzo");
    codiceDiv.textContent = codice || "Codice mezzo non disponibile";
    codiceDiv.style.display = "block";
}

async function mostraSchedaMezzo() {
    const identifier = getMezzoIdentifierFromUrl();
    const schedaDiv = document.getElementById("scheda-mezzo");

    if (!identifier) {
        mostraCodiceMezzo("");
        schedaDiv.innerHTML = "<div style='text-align:center;color:#d32f2f;font-weight:bold;'>ID o codice mezzo non specificato nell'URL.<br>Devi aprire la pagina come <code>consultazione.html?id=IDMEZZO</code> oppure <code>consultazione.html?id=FB.00003</code></div>";
        return;
    }

    let docSnap = null;

    try {
        // Se sembra un ID Firestore (lungo e senza punti)
        if (/^[a-zA-Z0-9]{15,}$/.test(identifier)) {
            const docRef = doc(db, "mezzi", identifier);
            docSnap = await getDoc(docRef);
            if (!docSnap.exists()) docSnap = null;
        }

        // Se non trovato, cerca per codice_fb
        if (!docSnap) {
            const q = query(collection(db, "mezzi"), where("codice_fb", "==", identifier));
            const qSnap = await getDocs(q);
            if (!qSnap.empty) docSnap = qSnap.docs[0];
        }

        if (!docSnap) {
            mostraCodiceMezzo("");
            schedaDiv.innerHTML = "<div style='text-align:center;color:#d32f2f;font-weight:bold;'>Mezzo non trovato!</div>";
            return;
        }

        const mezzo = docSnap.data();
        mostraCodiceMezzo(mezzo.codice_fb);

        schedaDiv.innerHTML = `
            <h2 style="text-align:center;margin-bottom:18px;">${mezzo.nome_mezzo || ""}</h2>
            <p><strong>Anno prima immatricolazione:</strong> ${mezzo.anno_prima_immatricolazione || ""}</p>
            <p><strong>Attrezzatura:</strong> ${mezzo.attrezzatura || ""}</p>
            <p><strong>Anno attrezzatura:</strong> ${mezzo.anno_attrezzatura || ""}</p>
            <p><strong>KM percorsi:</strong> ${mezzo.km_percorsi || ""}</p>
            <p><strong>Note:</strong> ${mezzo.note_varie || ""}</p>
            <p><strong>Prezzo:</strong> €${mezzo.prezzo ? mezzo.prezzo.toLocaleString('it-IT') : ""}</p>
            ${mezzo.foto && mezzo.foto.length > 0 ? mezzo.foto.map(url => `<img src="${url}" style="max-width:100%;margin:18px 0;border-radius:7px;box-shadow:0 2px 8px #0001;">`).join("") : ""}
        `;
    } catch (err) {
        mostraCodiceMezzo("");
        schedaDiv.innerHTML = "<div style='text-align:center;color:#d32f2f;font-weight:bold;'>Errore durante il caricamento dei dati.<br/>" + err.message + "</div>";
    }
}

document.addEventListener("DOMContentLoaded", mostraSchedaMezzo);
