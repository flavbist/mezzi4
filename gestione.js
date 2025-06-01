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
        alert("✅ Mezzo aggiunto con successo!");
        document.getElementById("mezzo-form").reset(); // Pulisce il form
    } catch (error) {
        console.error("Errore durante l'aggiunta:", error);
    }
});
