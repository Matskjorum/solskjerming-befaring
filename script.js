let vinduer = JSON.parse(localStorage.getItem("vinduer")) || [];

const felt = [
  "kundeNavn",
  "adresse",
  "poststed",
  "telefon",
  "epost"
];

felt.forEach(id => {
  const input = document.getElementById(id);
  input.value = localStorage.getItem(id) || "";

  input.addEventListener("input", () => {
    localStorage.setItem(id, input.value);
    visOversikt();
  });
});

function lagreVindu() {
  const plassering = document.getElementById("plassering").value;
  const type = document.getElementById("type").value;
  const bredde = document.getElementById("bredde").value;
  const hoyde = document.getElementById("hoyde").value;
  const kommentar = document.getElementById("kommentar").value;

  if (!plassering || !type || !bredde || !hoyde) {
    alert("Fyll inn plassering, type, bredde og høyde.");
    return;
  }

  const vindu = {
    plassering,
    type,
    bredde,
    hoyde,
    kommentar
  };

  vinduer.push(vindu);
  localStorage.setItem("vinduer", JSON.stringify(vinduer));

  tomVinduSkjema();
  visOversikt();
}

function tomVinduSkjema() {
  document.getElementById("plassering").value = "";
  document.getElementById("type").value = "";
  document.getElementById("bredde").value = "";
  document.getElementById("hoyde").value = "";
  document.getElementById("kommentar").value = "";
}

function slettVindu(index) {
  vinduer.splice(index, 1);
  localStorage.setItem("vinduer", JSON.stringify(vinduer));
  visOversikt();
}

function slettProsjekt() {
  if (!confirm("Er du sikker på at du vil slette hele prosjektet?")) {
    return;
  }

  localStorage.clear();
  vinduer = [];

  felt.forEach(id => {
    document.getElementById(id).value = "";
  });

  tomVinduSkjema();
  visOversikt();
}

function visOversikt() {
  const oversikt = document.getElementById("oversikt");

  const kundeNavn = document.getElementById("kundeNavn").value;
  const adresse = document.getElementById("adresse").value;
  const poststed = document.getElementById("poststed").value;
  const telefon = document.getElementById("telefon").value;
  const epost = document.getElementById("epost").value;

  let html = `
    <p><strong>Kunde:</strong> ${kundeNavn || "-"}</p>
    <p><strong>Adresse:</strong> ${adresse || "-"}, ${poststed || "-"}</p>
    <p><strong>Telefon:</strong> ${telefon || "-"}</p>
    <p><strong>E-post:</strong> ${epost || "-"}</p>
  `;

  if (vinduer.length === 0) {
    html += `<p class="small">Ingen vinduer lagt inn ennå.</p>`;
  }

  vinduer.forEach((vindu, index) => {
    html += `
      <div class="vindu">
        <h3>Vindu ${index + 1}: ${vindu.plassering}</h3>
        <p><strong>Type:</strong> ${vindu.type}</p>
        <p><strong>Mål:</strong> ${vindu.bredde} x ${vindu.hoyde} mm</p>
        <p><strong>Kommentar:</strong><br>${vindu.kommentar || "-"}</p>
        <button class="danger" onclick="slettVindu(${index})">Slett vindu</button>
      </div>
    `;
  });

  oversikt.innerHTML = html;
}

function eksporterPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const kundeNavn = document.getElementById("kundeNavn").value || "-";
  const adresse = document.getElementById("adresse").value || "-";
  const poststed = document.getElementById("poststed").value || "-";
  const telefon = document.getElementById("telefon").value || "-";
  const epost = document.getElementById("epost").value || "-";

  const dato = new Date().toLocaleDateString("no-NO");

  let y = 15;

  // Topp
  doc.setFillColor(31, 111, 235);
  doc.rect(0, 0, 210, 25, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text("Befaringsrapport - Solskjerming", 15, 16);

  doc.setFontSize(10);
  doc.text(`Dato: ${dato}`, 160, 16);

  // Kundeinfo
  y = 38;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text("Kundeinformasjon", 15, y);

  y += 6;
  doc.setDrawColor(220, 220, 220);
  doc.rect(15, y, 180, 34);

  y += 8;
  doc.setFontSize(11);
  doc.text(`Kunde: ${kundeNavn}`, 20, y);
  y += 6;
  doc.text(`Adresse: ${adresse}`, 20, y);
  y += 6;
  doc.text(`Postnr / sted: ${poststed}`, 20, y);
  y += 6;
  doc.text(`Telefon: ${telefon}`, 20, y);
  y += 6;
  doc.text(`E-post: ${epost}`, 20, y);

  // Vinduer
  y += 16;
  doc.setFontSize(14);
  doc.text("Registrerte vinduer", 15, y);

  y += 8;

  if (vinduer.length === 0) {
    doc.setFontSize(11);
    doc.text("Ingen vinduer registrert.", 15, y);
  }

  vinduer.forEach((vindu, index) => {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    // Kort-boks
    doc.setFillColor(245, 247, 250);
    doc.setDrawColor(220, 220, 220);
    doc.roundedRect(15, y, 180, 42, 3, 3, "FD");

    doc.setTextColor(31, 111, 235);
    doc.setFontSize(13);
    doc.text(`Vindu ${index + 1}: ${vindu.plassering}`, 20, y + 8);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(`Type: ${vindu.type}`, 20, y + 16);
    doc.text(`Mål: ${vindu.bredde} x ${vindu.hoyde} mm`, 20, y + 23);

    const kommentar = doc.splitTextToSize(
      `Kommentar: ${vindu.kommentar || "-"}`,
      165
    );

    doc.text(kommentar, 20, y + 31);

    y += 50;
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(`Side ${i} av ${pageCount}`, 170, 287);
  }

  const filnavn = `befaring-${kundeNavn.replaceAll(" ", "-")}.pdf`;
  doc.save(filnavn);
}
