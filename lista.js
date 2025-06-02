import { db, collection, getDocs } from "./firebase.js";

const listaDiv = document.getElementById("mezzi-lista");

async function caricaMezzi() {
    listaDiv.innerHTML = "Caricamento...";

    try {
        const querySnapshot = await getDocs(collection(db, "mezzi"));
        if (querySnapshot.empty) {
            listaDiv.innerHTML = "<div style='color:#d32f2f;text-align:center;'>Nessun mezzo trovato.</div>";
            return;
        }

        let html = "<ul style='list-style:none;padding:0;'>";
        querySnapshot.forEach(docSnap => {
            const mezzo = docSnap.data();
            html += `
            <li style="margin-bottom:24px; padding:14px 8px; border-bottom:1px solid #e0e0e0;">
                <div style="font-weight:bold; font-size:1.2em; color:#1976d2;">
                  ${mezzo.codice_fb || "(senza codice)"}
                </div>
                <div>
                  ${mezzo.nome_mezzo ? `<div><strong>Nome:</strong> ${mezzo.nome_mezzo}</div>` : ""}
                  ${mezzo.anno_prima_immatricolazione ? `<div><strong>Anno immatricolazione:</strong> ${mezzo.anno_prima_immatricolazione}</div>` : ""}
                  ${mezzo.targa ? `<div><strong>Targa:</strong> ${mezzo.targa}</div>` : ""}
                  ${mezzo.attrezzatura ? `<div><strong>Attrezzatura:</strong> ${mezzo.attrezzatura}</div>` : ""}
                  ${mezzo.anno_attrezzatura ? `<div><strong>Anno attrezzatura:</strong> ${mezzo.anno_attrezzatura}</div>` : ""}
                  ${mezzo.km_percorsi ? `<div><strong>Km percorsi:</strong> ${mezzo.km_percorsi}</div>` : ""}
                  ${mezzo.note_varie ? `<div><strong>Note:</strong> ${mezzo.note_varie}</div>` : ""}
                  ${mezzo.prezzo ? `<div><strong>Prezzo:</strong> €${mezzo.prezzo.toLocaleString('it-IT')}</div>` : ""}
                  <div style="margin-top:8px;">
                    <a class="btn" href="consultazione.html?id=${docSnap.id}" style="padding:5px 12px;font-size:0.95em;">Apri</a>
                  </div>
                </div>
            </li>
            `;
        });
        html += "</ul>";
        listaDiv.innerHTML = html;
    } catch (err) {
        listaDiv.innerHTML = `<div style='color:#d32f2f;text-align:center;'>Errore caricamento dati:<br>${err.message}</div>`;
    }
}

document.addEventListener("DOMContentLoaded", caricaMezzi);
