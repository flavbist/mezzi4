import { db, collection, getDocs } from "./firebase.js";

const listaDiv = document.getElementById("mezzi-lista");
const filtroInput = document.getElementById("filtro-mezzi");

let mezziArray = []; // Salva tutti i mezzi caricati

async function caricaMezzi() {
    listaDiv.innerHTML = "Caricamento...";

    try {
        const querySnapshot = await getDocs(collection(db, "mezzi"));
        if (querySnapshot.empty) {
            listaDiv.innerHTML = "<div style='color:#d32f2f;text-align:center;'>Nessun mezzo trovato.</div>";
            mezziArray = [];
            return;
        }

        // Salva tutti i mezzi in un array per il filtro successivo
        mezziArray = [];
        querySnapshot.forEach(docSnap => {
            const mezzo = docSnap.data();
            mezzo._id = docSnap.id; // Salva anche l'id per il link
            mezziArray.push(mezzo);
        });

        renderMezzi(mezziArray);
    } catch (err) {
        listaDiv.innerHTML = `<div style='color:#d32f2f;text-align:center;'>Errore caricamento dati:<br>${err.message}</div>`;
    }
}

// Funzione per mostrare i mezzi (può essere filtrata)
function renderMezzi(lista) {
    if (!lista.length) {
        listaDiv.innerHTML = "<div style='color:#d32f2f;text-align:center;'>Nessun mezzo trovato.</div>";
        return;
    }
    let html = "<ul style='list-style:none;padding:0;'>";
    lista.forEach(mezzo => {
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
                <a class="btn" href="consultazione.html?id=${mezzo._id}" style="padding:5px 12px;font-size:0.95em;">Apri</a>
              </div>
            </div>
        </li>
        `;
    });
    html += "</ul>";
    listaDiv.innerHTML = html;
}

// Gestione filtro live
if (filtroInput) {
    filtroInput.addEventListener("input", function() {
        const val = this.value.toLowerCase().trim();
        // Filtra per codice, nome, targa
        const filtrati = mezziArray.filter(mezzo =>
            (mezzo.codice_fb && mezzo.codice_fb.toLowerCase().includes(val)) ||
            (mezzo.nome_mezzo && mezzo.nome_mezzo.toLowerCase().includes(val)) ||
            (mezzo.targa && mezzo.targa.toLowerCase().includes(val))
        );
        renderMezzi(filtrati);
    });
}

document.addEventListener("DOMContentLoaded", caricaMezzi);
