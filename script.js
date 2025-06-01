import { db, collection, getDocs } from "./firebase.js";

document.addEventListener("DOMContentLoaded", async () => {
    const mezziList = document.getElementById("mezzi-list");
    const mezziCollection = collection(db, "mezzi");

    try {
        const snapshot = await getDocs(mezziCollection);
        snapshot.forEach(doc => {
            const data = doc.data();
            const div = document.createElement("div");
            div.classList.add("mezzo");
            div.innerHTML = `
                <h3>${data.nome_mezzo} (${data.anno_prima_immatricolazione})</h3>
                <p><strong>Attrezzatura:</strong> ${data.attrezzatura} (${data.anno_attrezzatura})</p>
                <p><strong>KM percorsi:</strong> ${data.km_percorsi}</p>
                <p><strong>Note:</strong> ${data.note_varie}</p>
                <p><strong>Prezzo:</strong> €${data.prezzo}</p>
            `;
            mezziList.appendChild(div);
        });
    } catch (error) {
        console.error("Errore nel recupero dei dati:", error);
    }
});
