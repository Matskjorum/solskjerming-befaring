let prosjekter = JSON.parse(localStorage.getItem("prosjekter")) || [];
let aktivtProsjektId = localStorage.getItem("aktivtProsjektId");

let vinduer = [];
let styringer = [];

function lagProsjektNummer() {
  const aar = new Date().getFullYear();
  const nummer = prosjekter.length + 1;
  return `SB-${aar}-${String(nummer).padStart(3, "0")}`;
}

function nyttProsjekt() {
  const prosjekt = {
    id: Date.now().toString(),
    prosjektNr: lagProsjektNummer(),
    kundeNavn: "",
    adresse: "",
    poststed: "",
    telefon: "",
    epost: "",
    vinduer: [],
styringer: []
  };

  prosjekter.push(prosjekt);
  aktivtProsjektId = prosjekt.id;

  lagreProsjekter();
  lastAktivtProsjekt();
}

function hentAktivtProsjekt() {
  return prosjekter.find(p => p.id === aktivtProsjektId);
}

function lagreProsjekter() {
  localStorage.setItem("prosjekter", JSON.stringify(prosjekter));
  localStorage.setItem("aktivtProsjektId", aktivtProsjektId || "");
}

function velgProsjekt(id) {
  aktivtProsjektId = id;
  lagreProsjekter();
  lastAktivtProsjekt();
}

function slettValgtProsjekt(id) {
  if (!confirm("Er du sikker på at du vil slette dette prosjektet?")) return;

  prosjekter = prosjekter.filter(p => p.id !== id);

  if (aktivtProsjektId === id) {
    aktivtProsjektId = prosjekter.length ? prosjekter[0].id : "";
  }

  lagreProsjekter();
  lastAktivtProsjekt();
}

const felt = [
  "kundeNavn",
  "adresse",
  "poststed",
  "telefon",
  "epost"
];

felt.forEach(id => {
  const input = document.getElementById(id);

  input.addEventListener("input", () => {
    const prosjekt = hentAktivtProsjekt();
    if (!prosjekt) return;

    prosjekt[id] = input.value;
    lagreProsjekter();
    visOversikt();
    visProsjektListe();
  });
});

function lagreVindu() {
  const plassering = document.getElementById("plassering").value;
  const type = document.getElementById("type").value;
  const motor = document.getElementById("motor").value;
  const bredde = document.getElementById("bredde").value;
  const hoyde = document.getElementById("hoyde").value;
 const kassefarge = document.getElementById("kassefarge").value;
const duk = document.getElementById("duk").value;
const brakett = document.getElementById("brakett").value;
  const kommentar = document.getElementById("kommentar").value;

  if (!plassering || !type || !motor || !bredde || !hoyde) {
  alert("Fyll inn plassering, type, motor, bredde og høyde.");
  return;
}
const prosjekt = hentAktivtProsjekt();

if (!prosjekt) {
  alert("Opprett et prosjekt først.");
  return;
}

const harAndreVinduer = prosjekt.vinduer.length > 0;

if (harAndreVinduer) {
  const annenKassefarge = prosjekt.vinduer.some(v =>
    v.kassefarge && kassefarge && v.kassefarge !== kassefarge
  );

  const annenDuk = prosjekt.vinduer.some(v =>
    v.duk && duk && v.duk !== duk
  );

  if (annenKassefarge || annenDuk) {
    const fortsett = confirm(
      "Dette vinduet har annen kassefarge eller duk enn tidligere vinduer i prosjektet.\n\n" +
      "Er dette riktig?"
    );

    if (!fortsett) {
      return;
    }
  }
}
 const vindu = {
  plassering,
  type,
  motor,
  bredde,
  hoyde,
  kassefarge,
  duk,
  brakett,
  kommentar
};


prosjekt.vinduer.push(vindu);
vinduer = prosjekt.vinduer;

lagreProsjekter();

  tomVinduSkjema();
  visOversikt();
}

function tomVinduSkjema() {
  document.getElementById("plassering").value = "";
  document.getElementById("type").value = "";
  document.getElementById("motor").value = "";
  document.getElementById("bredde").value = "";
  document.getElementById("hoyde").value = "";
  document.getElementById("kassefarge").value = "";
document.getElementById("duk").value = "";
document.getElementById("brakett").value = "";
  document.getElementById("kommentar").value = "";
}

function redigerVindu(index) {
  const prosjekt = hentAktivtProsjekt();
  if (!prosjekt) return;

  const vindu = prosjekt.vinduer[index];
  if (!vindu) return;

  document.getElementById("plassering").value = vindu.plassering || "";
  document.getElementById("type").value = vindu.type || "";
  document.getElementById("motor").value = vindu.motor || "";
  document.getElementById("bredde").value = vindu.bredde || "";
  document.getElementById("hoyde").value = vindu.hoyde || "";
  document.getElementById("kassefarge").value = vindu.kassefarge || "";
  document.getElementById("duk").value = vindu.duk || "";
  document.getElementById("brakett").value = vindu.brakett || "";
  document.getElementById("kommentar").value = vindu.kommentar || "";

  prosjekt.vinduer.splice(index, 1);
  vinduer = prosjekt.vinduer;

  lagreProsjekter();
  visOversikt();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function dupliserVindu(index) {
  const prosjekt = hentAktivtProsjekt();
  if (!prosjekt) return;

  const original = prosjekt.vinduer[index];
  if (!original) return;

  const kopi = {
    ...original,
    plassering: `${original.plassering} kopi`
  };

  prosjekt.vinduer.splice(index + 1, 0, kopi);
  vinduer = prosjekt.vinduer;

  lagreProsjekter();
  visOversikt();
}

function slettVindu(index) {
  const prosjekt = hentAktivtProsjekt();
  if (!prosjekt) return;

  prosjekt.vinduer.splice(index, 1);
  vinduer = prosjekt.vinduer;

  lagreProsjekter();
  visOversikt();
}

function slettProsjekt() {
  const prosjekt = hentAktivtProsjekt();
  if (!prosjekt) return;

  slettValgtProsjekt(prosjekt.id);
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
        <p><strong>Motor:</strong> ${vindu.motor || "-"}</p>
        <p><strong>Mål:</strong> ${vindu.bredde} x ${vindu.hoyde} mm</p>
        <p><strong>Kassefarge:</strong> ${vindu.kassefarge || "-"}</p>
<p><strong>Duk:</strong> ${vindu.duk || "-"}</p>
<p><strong>Brakett:</strong> ${vindu.brakett || "-"}</p>
<p><strong>Kommentar:</strong><br>${vindu.kommentar || "-"}</p>
        <button onclick="redigerVindu(${index})">Rediger</button>
        <button onclick="dupliserVindu(${index})">Dupliser vindu</button>
<button class="danger" onclick="slettVindu(${index})">Slett vindu</button>
      </div>
    `;
  });

  oversikt.innerHTML = html;
}

function eksporterPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "mm", "a4");

  const kundeNavn = document.getElementById("kundeNavn").value || "-";
  const adresse = document.getElementById("adresse").value || "-";
  const poststed = document.getElementById("poststed").value || "-";
  const telefon = document.getElementById("telefon").value || "-";
  const epost = document.getElementById("epost").value || "-";

  const dato = new Date().toLocaleDateString("no-NO");
  const rapportId = new Date().toISOString().slice(0, 10).replaceAll("-", "") + "-001";

  const navy = [0, 38, 84];
  const lightGrey = [230, 230, 230];
  const border = [160, 160, 160];

  function header() {
    doc.setTextColor(...navy);
    doc.setFontSize(24);
    doc.setFont(undefined, "bold");
    doc.text("SOLSKJERMING", 12, 18);

    doc.setTextColor(90, 90, 90);
    doc.setFontSize(14);
    doc.text("BEFARINGSRAPPORT", 12, 27);

    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "normal");
    doc.text(`Dato: ${dato}`, 155, 15);
    doc.text(`Rapport-ID: ${rapportId}`, 155, 22);

    doc.setDrawColor(...navy);
    doc.setLineWidth(0.8);
    doc.line(12, 33, 198, 33);
  }

  function sectionTitle(title, x, y, w) {
    doc.setFillColor(...lightGrey);
    doc.rect(x, y, w, 8, "F");
    doc.setTextColor(...navy);
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text(title, x + 3, y + 5.5);
  }

  function customerTable() {
    sectionTitle("KUNDEINFORMASJON", 12, 42, 90);

    const rows = [
      ["Kunde:", kundeNavn],
      ["Adresse:", adresse],
      ["Postnr / sted:", poststed],
      ["Telefon:", telefon],
      ["E-post:", epost],
    ];

    let y = 50;
    rows.forEach(row => {
      doc.setDrawColor(...border);
      doc.rect(12, y, 90, 8);
      doc.line(47, y, 47, y + 8);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont(undefined, "bold");
      doc.text(row[0], 15, y + 5.2);

      doc.setFont(undefined, "normal");
      doc.text(String(row[1]), 50, y + 5.2);

      y += 8;
    });
  }

  function projectTable() {
    sectionTitle("PROSJEKTINFORMASJON", 108, 42, 90);

    const rows = [
      ["Prosjekt:", "Solskjerming"],
      ["Prosjektadr.:", `${adresse}, ${poststed}`],
      ["Utført av:", "-"],
      ["Kontaktperson:", "-"],
    ];

    let y = 50;
    rows.forEach(row => {
      doc.setDrawColor(...border);
      doc.rect(108, y, 90, 8);
      doc.line(148, y, 148, y + 8);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont(undefined, "bold");
      doc.text(row[0], 111, y + 5.2);

      doc.setFont(undefined, "normal");
      const value = doc.splitTextToSize(String(row[1]), 45);
      doc.text(value[0], 151, y + 5.2);

      y += 8;
    });
  }

  function windowsTable(startY) {
    sectionTitle("REGISTRERTE VINDUER", 12, startY, 186);

    let y = startY + 10;

    const col = {
      nr: 12,
      plassering: 25,
      type: 62,
      mal: 107,
      kommentar: 145,
    };

    doc.setFillColor(...navy);
    doc.rect(12, y, 186, 9, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text("NR.", col.nr + 4, y + 6);
    doc.text("PLASSERING", col.plassering + 2, y + 6);
    doc.text("TYPE", col.type + 2, y + 6);
    doc.text("MÅL (MM)", col.mal + 2, y + 6);
    doc.text("DETALJER", col.kommentar + 2, y + 6);

    y += 9;

    if (vinduer.length === 0) {
      doc.setTextColor(0, 0, 0);
      doc.text("Ingen vinduer registrert.", 15, y + 6);
      return y + 15;
    }

    vinduer.forEach((vindu, index) => {
      if (y > 255) {
        footer();
        doc.addPage();
        header();
        y = 42;
      }

     const detaljerTekst =
  `Kasse: ${vindu.kassefarge || "-"}\n` +
  `Duk: ${vindu.duk || "-"}\n` +
  `Brakett: ${vindu.brakett || "-"}\n` +
  `Kommentar: ${vindu.kommentar || "-"}`;

const kommentar = doc.splitTextToSize(detaljerTekst, 48);
      const rowHeight = Math.max(10, kommentar.length * 5 + 4);

      doc.setDrawColor(...border);
      doc.rect(12, y, 186, rowHeight);
      doc.line(25, y, 25, y + rowHeight);
      doc.line(62, y, 62, y + rowHeight);
      doc.line(107, y, 107, y + rowHeight);
      doc.line(145, y, 145, y + rowHeight);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont(undefined, "bold");
      doc.text(String(index + 1).padStart(2, "0"), 16, y + 6);

      doc.setFont(undefined, "normal");
      doc.text(vindu.plassering || "-", 28, y + 6);
      doc.text(`${vindu.type || "-"} / ${vindu.motor || "-"}`, 65, y + 6);
      doc.text(`${vindu.bredde} x ${vindu.hoyde}`, 110, y + 6);
      doc.text(kommentar, 148, y + 6);

      y += rowHeight;
    });

    return y + 10;
  }
  function steeringBox(y) {
  const prosjekt = hentAktivtProsjekt();
  const styringer = prosjekt?.styringer || [];

  sectionTitle("FJERNKONTROLLER OG STYRING", 12, y, 186);

  y += 10;

  doc.setFillColor(...navy);
  doc.rect(12, y, 186, 9, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont(undefined, "bold");
  doc.text("PRODUKT", 16, y + 6);
  doc.text("ANTALL", 170, y + 6);

  y += 9;

  if (styringer.length === 0) {
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "normal");
    doc.text("Ingen styringer registrert.", 16, y + 7);
    return y + 18;
  }

  styringer.forEach(s => {
    doc.setDrawColor(...border);
    doc.rect(12, y, 186, 9);
    doc.line(160, y, 160, y + 9);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont(undefined, "normal");
    doc.text(s.type || "-", 16, y + 6);
    doc.text(`${s.antall || 1} stk`, 180, y + 6, { align: "center" });

    y += 9;
  });

  return y + 10;
}
  function summaryBox(y) {
    sectionTitle("OPPSUMMERING", 12, y, 90);

    const totalAreal = vinduer.reduce((sum, v) => {
      const b = Number(v.bredde) || 0;
      const h = Number(v.hoyde) || 0;
      return sum + (b * h) / 1000000;
    }, 0);

    const rows = [
      ["Antall vinduer / enheter:", String(vinduer.length)],
      ["Totalt areal estimert:", `${totalAreal.toFixed(2).replace(".", ",")} m²`],
      ["Kommentar:", "-"],
    ];

    y += 8;

    rows.forEach(row => {
      doc.setDrawColor(...border);
      doc.rect(12, y, 90, 10);
      doc.line(68, y, 68, y + 10);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont(undefined, "bold");
      doc.text(row[0], 15, y + 6);

      doc.setFont(undefined, "normal");
      doc.text(row[1], 95, y + 6, { align: "right" });

      y += 10;
    });
  }

  function termsBox(y) {
    sectionTitle("BETINGELSER", 108, y, 90);

    y += 12;
    doc.setDrawColor(...border);
    doc.rect(108, y - 4, 90, 34);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.setFont(undefined, "normal");

    const terms = [
      "Befaring er basert på mål oppgitt på stedet.",
      "Tilbud/bestilling må kontrolleres før produksjon.",
      "Forbehold om skrivefeil.",
      "Eventuelle tillegg avtales skriftlig.",
    ];

    terms.forEach(t => {
      doc.text("•", 112, y);
      doc.text(t, 117, y);
      y += 6;
    });
  }

  function signatureBox(y) {
    sectionTitle("SIGNATUR / GODKJENNING", 12, y, 186);

    y += 8;
    doc.setDrawColor(...border);
    doc.rect(12, y, 186, 36);
    doc.line(105, y, 105, y + 36);

    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "bold");

    doc.text("Utført av:", 16, y + 8);
    doc.text("Kunde godkjent:", 110, y + 8);

    doc.setFont(undefined, "normal");
    doc.text(".........................................................", 16, y + 18);
    doc.text(".........................................................", 110, y + 18);

    doc.setFont(undefined, "bold");
    doc.text("Dato:", 16, y + 28);
    doc.text("Dato:", 110, y + 28);

    doc.setFont(undefined, "normal");
    doc.text("..................................", 30, y + 28);
    doc.text("..................................", 124, y + 28);
  }

  function footer() {
    const page = doc.internal.getCurrentPageInfo().pageNumber;
    const pages = doc.internal.getNumberOfPages();

    doc.setDrawColor(...navy);
    doc.setLineWidth(0.5);
    doc.line(12, 282, 198, 282);

    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    doc.text("Solskjerming - Befaringsrapport", 12, 288);
    doc.text(`Side ${page} av ${pages}`, 180, 288);
  }

  // Side 1
  header();

  doc.setTextColor(...navy);
  doc.setFontSize(22);
  doc.setFont(undefined, "bold");
  doc.text("BEFARINGSRAPPORT", 105, 39, { align: "center" });

  customerTable();
  projectTable();

  const afterWindowsY = windowsTable(92);

  if (afterWindowsY < 245) {
    sectionTitle("MERKNADER", 12, afterWindowsY, 186);
    doc.setDrawColor(...border);
    doc.rect(12, afterWindowsY + 9, 186, 22);
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text("-", 16, afterWindowsY + 18);
  }

  footer();

  // Side 2
  doc.addPage();
  header();

  summaryBox(48);
termsBox(48);

const etterStyring = steeringBox(95);

signatureBox(etterStyring + 5);

  footer();

  const filnavn = `befaring-${kundeNavn.replaceAll(" ", "-")}.pdf`;
  doc.save(filnavn);
}

function visProsjektListe() {
  const container = document.getElementById("prosjektListe");
  if (!container) return;

  if (prosjekter.length === 0) {
    container.innerHTML = `<p class="small">Ingen prosjekter opprettet ennå.</p>`;
    return;
  }

  let html = "";

  prosjekter.forEach(p => {
    const aktiv = p.id === aktivtProsjektId ? "aktivt-prosjekt" : "";

    html += `
      <div class="prosjekt-rad ${aktiv}">
        <div>
          <strong>${p.prosjektNr}</strong><br>
          <span>${p.kundeNavn || "Uten kundenavn"}</span>
        </div>

        <div class="prosjekt-knapper">
          <button onclick="velgProsjekt('${p.id}')">Åpne</button>
          <button class="danger" onclick="slettValgtProsjekt('${p.id}')">Slett</button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function lastAktivtProsjekt() {
  if (prosjekter.length === 0) {
    nyttProsjekt();
    return;
  }

  if (!aktivtProsjektId) {
    aktivtProsjektId = prosjekter[0].id;
  }

  const prosjekt = hentAktivtProsjekt();

  if (!prosjekt) {
    aktivtProsjektId = prosjekter[0].id;
    lastAktivtProsjekt();
    return;
  }

  vinduer = prosjekt.vinduer || [];

  felt.forEach(id => {
    document.getElementById(id).value = prosjekt[id] || "";
  });

  tomVinduSkjema();
  visProsjektListe();
visOversikt();
visStyringer();
}
function leggTilStyring() {
  const prosjekt = hentAktivtProsjekt();
  if (!prosjekt) return;

  const type = document.getElementById("styringType").value;
  const antall = document.getElementById("styringAntall").value;

  if (!type) {
    alert("Velg produkt.");
    return;
  }

  prosjekt.styringer.push({
    type,
    antall
  });

  lagreProsjekter();

  document.getElementById("styringType").value = "";
  document.getElementById("styringAntall").value = 1;

  visStyringer();
}

function slettStyring(index) {
  const prosjekt = hentAktivtProsjekt();
  if (!prosjekt) return;

  prosjekt.styringer.splice(index, 1);

  lagreProsjekter();
  visStyringer();
}

function visStyringer() {
  const container = document.getElementById("styringListe");
  const prosjekt = hentAktivtProsjekt();

  if (!container || !prosjekt) return;

  if (!prosjekt.styringer || prosjekt.styringer.length === 0) {
    container.innerHTML =
      '<p class="small">Ingen styringer registrert.</p>';
    return;
  }

  let html = "<h4>Registrerte produkter</h4>";

  prosjekt.styringer.forEach((s, index) => {
    html += `
      <div class="prosjekt-rad">
        <div>
          <strong>${s.type}</strong><br>
          ${s.antall} stk
        </div>

        <div>
          <button
            class="danger"
            onclick="slettStyring(${index})"
          >
            Slett
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}
function eksporterFabrikkPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("l", "mm", "a4");

  const prosjekt = hentAktivtProsjekt();
  if (!prosjekt) {
    alert("Ingen aktivt prosjekt.");
    return;
  }

  const dato = new Date().toLocaleDateString("no-NO");

  const navy = [0, 38, 84];
  const green = [57, 169, 53];
  const border = [180, 180, 180];

  doc.setTextColor(...navy);
  doc.setFontSize(22);
  doc.setFont(undefined, "bold");
  doc.text("FABRIKKBESTILLING", 14, 18);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont(undefined, "normal");
  doc.text(`Prosjekt: ${prosjekt.prosjektNr || "-"}`, 14, 28);
  doc.text(`Kunde: ${prosjekt.kundeNavn || "-"}`, 14, 34);
  doc.text(`Adresse: ${prosjekt.adresse || "-"}, ${prosjekt.poststed || "-"}`, 14, 40);
  doc.text(`Dato: ${dato}`, 245, 28);

  doc.setDrawColor(...green);
  doc.setLineWidth(1);
  doc.line(14, 46, 283, 46);

  let y = 55;

  const headers = [
    "Nr",
    "Plassering",
    "Type",
    "Motor",
    "Bredde",
    "Høyde",
    "Kasse",
    "Duk",
    "Brakett",
    "Kommentar"
  ];

  const widths = [10, 35, 38, 18, 20, 20, 35, 50, 22, 55];
  let x = 14;

  doc.setFillColor(...navy);
  doc.rect(14, y, 269, 9, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont(undefined, "bold");

  headers.forEach((h, i) => {
    doc.text(h, x + 2, y + 6);
    x += widths[i];
  });

  y += 9;

  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, "normal");

  if (!prosjekt.vinduer || prosjekt.vinduer.length === 0) {
    doc.text("Ingen vinduer registrert.", 14, y + 8);
  } else {
    prosjekt.vinduer.forEach((vindu, index) => {
      if (y > 185) {
        doc.addPage();
        y = 18;
      }

      const row = [
        String(index + 1),
        vindu.plassering || "-",
        vindu.type || "-",
        vindu.motor || "-",
        vindu.bredde || "-",
        vindu.hoyde || "-",
        vindu.kassefarge || "-",
        vindu.duk || "-",
        vindu.brakett || "-",
        vindu.kommentar || "-"
      ];

      const wrapped = row.map((text, i) =>
        doc.splitTextToSize(String(text), widths[i] - 4)
      );

      const rowHeight = Math.max(...wrapped.map(lines => lines.length)) * 4 + 5;

      x = 14;

      doc.setDrawColor(...border);
      doc.rect(14, y, 269, rowHeight);

      row.forEach((text, i) => {
        if (i > 0) {
          const lineX = 14 + widths.slice(0, i).reduce((a, b) => a + b, 0);
          doc.line(lineX, y, lineX, y + rowHeight);
        }

        doc.setFontSize(7.5);
        doc.text(wrapped[i], x + 2, y + 5);
        x += widths[i];
      });

      y += rowHeight;
    });
  }

  y += 10;

  if (y > 170) {
    doc.addPage();
    y = 18;
  }

  doc.setTextColor(...navy);
  doc.setFontSize(13);
  doc.setFont(undefined, "bold");
  doc.text("FJERNKONTROLLER OG STYRING", 14, y);

  y += 6;

  doc.setFillColor(...navy);
  doc.rect(14, y, 100, 8, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text("Produkt", 16, y + 5.5);
  doc.text("Antall", 95, y + 5.5);

  y += 8;

  const styringer = prosjekt.styringer || [];

  if (styringer.length === 0) {
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "normal");
    doc.text("Ingen styringer registrert.", 16, y + 6);
  } else {
    styringer.forEach(s => {
      doc.setDrawColor(...border);
      doc.rect(14, y, 100, 8);
      doc.line(90, y, 90, y + 8);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(8);
      doc.setFont(undefined, "normal");
      doc.text(s.type || "-", 16, y + 5.5);
      doc.text(`${s.antall || 1} stk`, 95, y + 5.5);

      y += 8;
    });
  }

  const pageCount = doc.internal.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Side ${i} av ${pageCount}`, 260, 200);
  }

  const filnavn = `fabrikkbestilling-${prosjekt.prosjektNr || "prosjekt"}.pdf`;
  doc.save(filnavn);
}
lastAktivtProsjekt();
