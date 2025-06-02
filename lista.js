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

        let html = `<table>
            <thead>
                <tr>
                    <th>Codice</th>
                    <th>Nome</th>
                    <th>Anno</th>
                    <th>Attr.</th>
                    <th>KM</th>
                    <th>Prezzo</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
        `;

        querySnapshot.forEach((docSnap) => {
            const mezzo = docSnap.data();
            html += `<tr>
                <td>${mezzo.codice_fb || ''}</td>
                <td>${mezzo.nome_mezzo || ''}</td>
                <td>${mezzo.anno_prima_immatricolazione || ''}</td>
                <td>${mezzo.targa || ''}</td>
                <td>${mezzo.attrezzatura || ''}</td>
                <td>${mezzo.anno_attrezzatura || ''}</td>
                <td>${mezzo.km_percorsi || ''}</td>
                <td>${mezzo.note_varie || ''}</td>
                <td>${mezzo.prezzo ? '€' + mezzo.prezzo.toLocaleString('it-IT') : ''}</td>
                <td>
                  <a class="btn" href="consultazione.html?id=${docSnap.id}" style="padding:5px 12px;font-size:0.95em;">Apri</a>
                </td>
            </tr>`;
        });

        html += `</tbody></table>`;
        listaDiv.innerHTML = html;
    } catch (err) {
        listaDiv.innerHTML = `<div style='color:#d32f2f;text-align:center;'>Errore caricamento dati:<br>${err.message}</div>`;
    }
}

document.addEventListener("DOMContentLoaded", caricaMezzi);
