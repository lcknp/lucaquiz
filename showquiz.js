function qs(sel) { return document.querySelector(sel); }

const STORE_KEY = "lucaquiz_showquiz_state_v2_hints_plus_chain";

function loadState() {
  try { const raw = localStorage.getItem(STORE_KEY); return raw ? JSON.parse(raw) : null; }
  catch { return null; }
}
function saveState(s) { localStorage.setItem(STORE_KEY, JSON.stringify(s)); }
function resetState() { localStorage.removeItem(STORE_KEY); }

function norm(str) {
  return (str || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.,;:!?()"']/g, "");
}

// ---------------------- RUNDE 1 (Schnellrunde) ----------------------
const ROUND1 = [
  { q:"WELCHES LAND HAT DIE HAUPTSTADT 'BRATISLAVA'?", a:["SLOWAKEI","SLOWENIEN","KROATIEN","LETTLAND"], c:0 },
  { q:"WELCHER FLUSS FLIESST DURCH ROM?", a:["PO","TIBER","ARNO","EBRO"], c:1 },
  { q:"WELCHES ELEMENT HAT DAS SYMBOL 'Sn'?", a:["SILBER","ZINN","SCHWEFEL","NICKEL"], c:1 },
  { q:"WELCHER PORT IST TYPISCH HTTPS?", a:["25","80","443","53"], c:2 },
  { q:"WIE VIELE DIAGONALEN HAT EIN FÜNFECK?", a:["3","5","7","10"], c:1 },
  { q:"WELCHER BEGRIFF PASST ZU 'WENN…DANN…'?", a:["UND","ODER","IMPLIKATION","NEGATION"], c:2 },
  { q:"WAS IST 12,5% VON 320?", a:["30","35","40","45"], c:2 },
  { q:"WELCHES LAND HAT DIE HAUPTSTADT 'WELLINGTON'?", a:["AUSTRALIEN","NEUSEELAND","KANADA","IRLAND"], c:1 },
  { q:"WELCHES IST EIN PALINDROM?", a:["LAGER","ANNA","KATZE","BAUM"], c:1 },
  { q:"WELCHES GAS IST AM HÄUFIGSTEN IN DER LUFT?", a:["O2","N2","CO2","H2"], c:1 },
];

// ---------------------- RUNDE 2 (Hinweis-Runde – MEHR & SCHWERER) ----------------------
// Tipp: solution kann mehrere Schreibweisen erlauben -> akzeptiere auch Varianten über aliases
const HINTS = [
  {
    solution: "MONT BLANC",
    aliases: ["MONTBLANC"],
    hints: [
      "ICH LIEGE IN EUROPA.",
      "ICH BIN EIN BERG.",
      "ICH LIEGE IN DEN ALPEN.",
      "ICH WERDE OFT MIT FRANKREICH UND ITALIEN IN VERBINDUNG GEBRACHT.",
      "ICH BIN DER HÖCHSTE BERG DER ALPEN."
    ]
  },
  {
    solution: "PHOTOSYNTHESE",
    aliases: ["PHOTOSYNTHese"],
    hints: [
      "ICH BIN EIN BIOLOGISCHER PROZESS.",
      "ICH PASSIERE IN PFLANZEN.",
      "ICH BRAUCHE LICHT.",
      "ICH NUTZE CO2 UND WASSER.",
      "ICH PRODUZIERE SAUERSTOFF."
    ]
  },
  {
    solution: "PYTHAGORAS",
    aliases: ["PYTHAGORAS-SATZ", "PYTHAGORASSATZ"],
    hints: [
      "ICH BIN MIT MATHE VERBUNDEN.",
      "ICH HATTE MIT DREIECKEN ZU TUN.",
      "MEIN NAME IST AUCH EIN SATZ.",
      "ICH VERBINDE QUADRATE VON SEITENLÄNGEN.",
      "ICH STAMME AUS DER ANTIKE."
    ]
  },
  {
    solution: "SUEZKANAL",
    aliases: ["SUEZ KANAL"],
    hints: [
      "ICH BIN EIN BAUWERK DER GEOGRAFIE.",
      "ICH BIN EIN KANAL.",
      "ICH VERBINDE ZWEI MEERE.",
      "ICH LIEGE IN ÄGYPTEN.",
      "ICH VERBINDE MITTELMEER UND ROTES MEER."
    ]
  },
  {
    solution: "TIBER",
    aliases: ["TEVERE"],
    hints: [
      "ICH BIN EIN FLUSS.",
      "ICH LIEGE IN EUROPA.",
      "ICH FLIESSE DURCH EINE HAUPTSTADT.",
      "DIE HAUPTSTADT HEISST ROM.",
      "ICH HEISSE AUF ITALIENISCH 'TEVERE'."
    ]
  },
  {
    solution: "STRASSBURG",
    aliases: ["STRASBOURG"],
    hints: [
      "ICH BIN EINE STADT.",
      "ICH LIEGE IN FRANKREICH.",
      "ICH BIN WICHTIG FÜR EUROPA.",
      "ICH BIN SITZ DES EUROPÄISCHEN PARLAMENTS (PLENAR).",
      "ICH LIEGE NAH AN DER DEUTSCHEN GRENZE."
    ]
  },
  {
    solution: "MITOCHONDRIEN",
    aliases: ["MITOCHONDRIUM", "MITOCHONDRIEN"],
    hints: [
      "ICH GEHÖRE ZU ZELLEN.",
      "ICH BIN EIN ORGANELL.",
      "ICH HATTE MIT ENERGIE ZU TUN.",
      "MAN NENNT MICH OFT 'KRAFTWERK DER ZELLE'.",
      "ICH PRODUZIERE ATP (VEREINFACHT)."
    ]
  },
  {
    solution: "OKTETTREGEL",
    aliases: ["OKTET REGEL", "OKTETT REGEL"],
    hints: [
      "ICH GEHÖRE ZUR CHEMIE.",
      "ICH HATTE MIT ELEKTRONEN ZU TUN.",
      "ICH ERKLÄRE, WARUM ATOME BINDUNGEN EINGEHEN.",
      "ICH HATTE MIT EDELGASKONFIGURATION ZU TUN.",
      "ICH HEISSE MIT EINEM WORT WIE '8'."
    ]
  },
  {
    solution: "ANTARKTIS",
    aliases: ["ANTARKTIKA"],
    hints: [
      "ICH BIN EIN KONTINENT.",
      "ICH BIN SEHR KALT.",
      "ICH LIEGE AM SÜDLICHEN ENDE DER ERDE.",
      "ICH BIN GRÖSSTENTEILS VON EIS BEDECKT.",
      "PENGUINE SIND HIER SEHR BEKANNT."
    ]
  },
  {
    solution: "HABEAS CORPUS",
    aliases: ["HABEASCORPUS"],
    hints: [
      "ICH BIN EIN LATEINISCHER BEGRIFF.",
      "ICH HATTE MIT RECHT ZU TUN.",
      "ICH SCHÜTZE VOR WILLKÜRLICHER HAFT (PRINZIP).",
      "ICH BIN MIT ENGLAND/ANGLO-AMERIKANISCHEM RECHT VERBUNDEN.",
      "ICH BEGINNE MIT 'HABEAS'."
    ]
  },
  {
    solution: "EINSTEIN",
    aliases: ["ALBERT EINSTEIN"],
    hints: [
      "ICH BIN EINE PERSON.",
      "ICH BIN BERÜHMT IN DER PHYSIK.",
      "ICH HATTE MIT RELATIVITÄT ZU TUN.",
      "ICH VERBINDE MASSEN UND ENERGIE.",
      "E = mc² IST MIT MIR VERBUNDEN."
    ]
  },
  {
    solution: "ODYSSEE",
    aliases: ["DIE ODYSSEE"],
    hints: [
      "ICH BIN EIN WERK DER LITERATUR.",
      "ICH BIN SEHR ALT.",
      "ICH BIN EIN EPOS.",
      "ICH BIN MIT HOMER VERBUNDEN.",
      "ICH HANDELE VON ODYSSEUS."
    ]
  },
];

// Punkte der Hinweisrunde: je mehr Hinweise du brauchst, desto weniger Punkte
function hintPoints(revealed) {
  // 0->800, 1->700, 2->600, 3->400, 4->250, 5->100 (wenn alles offen)
  const table = [800, 700, 600, 400, 250, 100];
  return table[Math.min(revealed, table.length - 1)];
}

// ---------------------- RUNDE 3 (NEU): KETTENRUNDE ----------------------
// 5 Schritte – jeder Schritt hat eine Frage, die zum nächsten Begriff führt
// Punkte steigen: 100/200/300/400/500
const CHAIN_ROUNDS = [
  {
    title: "Kette: EUROPA",
    steps: [
      { q:"HAUPTSTADT VON PORTUGAL?", a:["LISSABON","PORTO","BRAGA","FARO"], c:0 },
      { q:"WELCHER FLUSS FLIESST DURCH PARIS?", a:["SEINE","RHEIN","THEMSE","DONAU"], c:0 },
      { q:"WELCHES GEBIRGE TRENNT SPANIEN UND FRANKREICH?", a:["ALPEN","PYRENÄEN","KARPATEN","URAL"], c:1 },
      { q:"WELCHE STADT IST REGIERUNGSSITZ DER NIEDERLANDE?", a:["ROTTERDAM","AMSTERDAM","DEN HAAG","UTRECHT"], c:2 },
      { q:"WELCHES LAND HAT DIE HAUPTSTADT 'HELSINKI'?", a:["SCHWEDEN","NORWEGEN","FINNLAND","DÄNEMARK"], c:2 },
    ]
  },
  {
    title: "Kette: WISSEN & TECH",
    steps: [
      { q:"WOFÜR STEHT 'CPU'?", a:["CENTRAL PROCESSING UNIT","CONTROL POWER UNIT","CORE PROGRAM USER","CENTRAL PRINT UNIT"], c:0 },
      { q:"WELCHER PORT IST TYPISCH FÜR DNS?", a:["53","25","443","110"], c:0 },
      { q:"WAS IST 'PHISHING'?", a:["BACKUP","BETRUG ÜBER FAKE-SEITEN/NACHRICHTEN","DATEI FORMAT","WLAN STANDARD"], c:1 },
      { q:"WAS MACHT DNS?", a:["VERSCHLÜSSELN","NAMEN IN IP AUFLÖSEN","VIREN LÖSCHEN","DOWNLOADS BESCHLEUNIGEN"], c:1 },
      { q:"WOFÜR STEHT 'RAM'?", a:["RANDOM ACCESS MEMORY","READ AUTO MODE","REMOTE APP MANAGER","RUNTIME ACCESS MAP"], c:0 },
    ]
  }
];

// Kettenpunkte pro Schritt
const CHAIN_POINTS = [100, 200, 300, 400, 500];

// ---------------------- STATE ----------------------
let state = loadState();
if (!state) {
  state = {
    scores: { A: 0, B: 0 },
    active: "A",

    r1: { idx: 0, done: false, timeLeft: 60, started: false },

    r2: { idx: 0, revealed: 0, done: false },

    r3: { set: 0, step: 0, done: false }
  };
  saveState(state);
}

// ---------------------- UI ----------------------
const scoreEl = qs("#showScore");
const statusEl = qs("#showStatus");
const resetBtn = qs("#showReset");

const teamA = qs("#teamA");
const teamB = qs("#teamB");

const tab1 = qs("#tab1");
const tab2 = qs("#tab2");
const tab3 = qs("#tab3");

const p1 = qs("#round1");
const p2 = qs("#round2");
const p3 = qs("#round3");

// Runde 1
const r1TimeEl = qs("#r1Time");
const r1Card = qs("#r1Card");
const r1Start = qs("#r1Start");
const r1Next = qs("#r1Next");

// Runde 2
const hintPtsEl = qs("#hintPts");
const hintList = qs("#hintList");
const revealHintBtn = qs("#revealHint");
const solveHintBtn = qs("#solveHint");
const hintAnswerArea = qs("#hintAnswerArea");
const hintInput = qs("#hintInput");
const hintSubmit = qs("#hintSubmit");
const hintCancel = qs("#hintCancel");
const hintFeedback = qs("#hintFeedback");
const r2Next = qs("#r2Next");

// Runde 3 (wir nutzen vorhandene Finale-Box in deinem HTML als Container)
const finalWager = qs("#finalWager");
const finalStart = qs("#finalStart");
const finalQuestionBox = qs("#finalQuestionBox");
const finalQ = qs("#finalQ");
const finalInput = qs("#finalInput");
const finalSubmit = qs("#finalSubmit");
const finalFeedback = qs("#finalFeedback");

let r1Timer = null;

function renderScore() {
  scoreEl.textContent = `TEAM A: ${state.scores.A} | TEAM B: ${state.scores.B} | AKTIV: ${state.active}`;
  teamA.style.outline = state.active === "A" ? "2px solid rgba(255,255,255,.35)" : "none";
  teamB.style.outline = state.active === "B" ? "2px solid rgba(255,255,255,.35)" : "none";
}

function switchPanel(which) {
  p1.style.display = which === 1 ? "block" : "none";
  p2.style.display = which === 2 ? "block" : "none";
  p3.style.display = which === 3 ? "block" : "none";

  tab1.classList.toggle("activeTab", which === 1);
  tab2.classList.toggle("activeTab", which === 2);
  tab3.classList.toggle("activeTab", which === 3);
}

tab1.addEventListener("click", () => switchPanel(1));
tab2.addEventListener("click", () => switchPanel(2));
tab3.addEventListener("click", () => switchPanel(3));

teamA.addEventListener("click", () => { state.active = "A"; saveState(state); renderScore(); });
teamB.addEventListener("click", () => { state.active = "B"; saveState(state); renderScore(); });

resetBtn.addEventListener("click", () => {
  if (r1Timer) clearInterval(r1Timer);
  resetState();
  state = {
    scores: { A: 0, B: 0 },
    active: "A",
    r1: { idx: 0, done: false, timeLeft: 60, started: false },
    r2: { idx: 0, revealed: 0, done: false },
    r3: { set: 0, step: 0, done: false }
  };
  saveState(state);
  statusEl.textContent = "Reset: Neues Spiel gestartet.";
  renderAll();
});

function award(points, text) {
  const t = state.active;
  state.scores[t] += points;
  saveState(state);
  renderScore();
  statusEl.innerHTML = text;
}

// ---------------------- RUNDE 1 ----------------------
function r1Render() {
  r1TimeEl.textContent = state.r1.timeLeft;

  if (state.r1.done) {
    r1Card.innerHTML = `<div class="bigCenter">✅ Runde 1 beendet.</div>`;
    r1Start.disabled = true;
    r1Next.disabled = true;
    return;
  }

  const qObj = ROUND1[state.r1.idx];
  if (!qObj) {
    state.r1.done = true;
    saveState(state);
    r1Render();
    return;
  }

  const disabled = !state.r1.started;

  r1Card.innerHTML = `
    <div class="showQ">${qObj.q}</div>
    <div class="showChoices">
      ${qObj.a.map((x, i) => `
        <button class="choiceBtn" type="button" ${disabled ? "disabled" : ""} data-i="${i}">${x}</button>
      `).join("")}
    </div>
    <div class="muted">Regel: Richtig +150, Falsch -75</div>
  `;

  r1Card.querySelectorAll(".choiceBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.i);
      const ok = i === qObj.c;
      if (ok) award(+150, `✅ Runde 1: Richtig (+150) – Team ${state.active}`);
      else award(-75, `❌ Runde 1: Falsch (-75) – richtig: <b>${qObj.a[qObj.c]}</b>`);

      state.r1.idx += 1;
      saveState(state);
      r1Next.disabled = false;
      r1Render();
    });
  });

  r1Start.disabled = state.r1.started;
  r1Next.disabled = true;
}

function r1StartTimer() {
  if (r1Timer) clearInterval(r1Timer);

  state.r1.started = true;
  saveState(state);
  r1Render();

  r1Timer = setInterval(() => {
    state.r1.timeLeft -= 1;
    if (state.r1.timeLeft <= 0) {
      state.r1.timeLeft = 0;
      state.r1.done = true;
      clearInterval(r1Timer);
      r1Timer = null;
      statusEl.innerHTML = "⏱️ Runde 1: Zeit vorbei!";
    }
    saveState(state);
    r1Render();
  }, 1000);
}

r1Start.addEventListener("click", () => {
  statusEl.textContent = "Runde 1 läuft. Viel Erfolg!";
  r1StartTimer();
});
r1Next.addEventListener("click", () => {
  state.r1.idx += 1;
  saveState(state);
  r1Render();
});

// ---------------------- RUNDE 2 ----------------------
function r2Render() {
  hintFeedback.textContent = "";
  hintAnswerArea.hidden = true;

  if (state.r2.done) {
    hintList.innerHTML = `<div class="bigCenter">✅ Runde 2 beendet.</div>`;
    revealHintBtn.disabled = true;
    solveHintBtn.disabled = true;
    r2Next.disabled = true;
    hintPtsEl.textContent = "0";
    return;
  }

  const obj = HINTS[state.r2.idx];
  if (!obj) {
    state.r2.done = true;
    saveState(state);
    r2Render();
    return;
  }

  const pts = hintPoints(state.r2.revealed);
  hintPtsEl.textContent = String(pts);

  hintList.innerHTML = obj.hints.map((h, idx) => {
    const shown = idx < state.r2.revealed;
    return `<div class="hintItem ${shown ? "shownHint" : ""}">${shown ? h : "••••••••••"}</div>`;
  }).join("");

  revealHintBtn.disabled = state.r2.revealed >= obj.hints.length;
}

revealHintBtn.addEventListener("click", () => {
  const obj = HINTS[state.r2.idx];
  if (!obj) return;
  if (state.r2.revealed < obj.hints.length) {
    state.r2.revealed += 1;
    saveState(state);
    r2Render();
  }
});

solveHintBtn.addEventListener("click", () => {
  hintAnswerArea.hidden = false;
  hintInput.value = "";
  hintInput.focus();
});

hintCancel.addEventListener("click", () => {
  hintAnswerArea.hidden = true;
});

hintSubmit.addEventListener("click", () => {
  const obj = HINTS[state.r2.idx];
  if (!obj) return;

  const guess = norm(hintInput.value);
  const sol = norm(obj.solution);
  const aliases = (obj.aliases || []).map(norm);

  const pts = hintPoints(state.r2.revealed);

  const ok = guess && (guess === sol || aliases.includes(guess));

  if (ok) {
    award(+pts, `✅ Hinweis-Runde: Richtig (+${pts}) – Lösung: <b>${obj.solution}</b>`);
    hintFeedback.innerHTML = `✅ Richtig! Lösung: <b>${obj.solution}</b>`;
  } else {
    award(-200, `❌ Hinweis-Runde: Falsch (-200) – Lösung: <b>${obj.solution}</b>`);
    hintFeedback.innerHTML = `❌ Falsch. Lösung wäre: <b>${obj.solution}</b>`;
  }

  state.r2.idx += 1;
  state.r2.revealed = 0;
  saveState(state);
  r2Render();
});

r2Next.addEventListener("click", () => {
  state.r2.idx += 1;
  state.r2.revealed = 0;
  saveState(state);
  r2Render();
});

// ---------------------- RUNDE 3 (NEU): KETTENRUNDE ----------------------
// Wir missbrauchen die vorhandene Finale-UI als Container (damit du kein HTML ändern musst).
function r3Render() {
  // Wir verstecken Einsatz-Zeug und nutzen den Bereich anders
  finalWager.style.display = "none";
  finalStart.style.display = "none";

  const setObj = CHAIN_ROUNDS[state.r3.set];
  if (!setObj) {
    finalQuestionBox.hidden = true;
    finalFeedback.innerHTML = "Keine Kettenrunde vorhanden.";
    return;
  }

  const steps = setObj.steps;
  const step = state.r3.step;

  if (state.r3.done || step >= steps.length) {
    finalQuestionBox.hidden = false;
    finalQ.textContent = `${setObj.title}`;
    finalFeedback.innerHTML = `✅ Kettenrunde beendet!`;
    finalInput.style.display = "none";
    finalSubmit.style.display = "none";
    return;
  }

  finalQuestionBox.hidden = false;
  finalInput.style.display = "none";
  finalSubmit.style.display = "none";

  const qObj = steps[step];
  const pts = CHAIN_POINTS[step];

  // Card bauen
  finalQ.innerHTML = `<div style="font-weight:900; text-transform:uppercase;">${setObj.title}</div>
  <div style="margin-top:10px;">SCHRITT ${step + 1}/5 • PUNKTE: <b>${pts}</b></div>
  <div style="margin-top:12px; font-weight:900; text-transform:uppercase;">${qObj.q}</div>`;

  // Antworten als Buttons
  finalFeedback.innerHTML = `
    <div class="showChoices" style="margin-top:12px;">
      ${qObj.a.map((x,i)=>`<button class="choiceBtn" type="button" data-i="${i}">${x}</button>`).join("")}
    </div>
    <div class="muted">Richtig: +${pts} • Falsch: -${Math.floor(pts/2)} (und weiter geht’s trotzdem)</div>
    <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:12px;">
      <button id="chainNext" class="bigBtn" type="button" disabled>NÄCHSTER SCHRITT</button>
      <button id="chainSwitch" class="hudBtn" type="button">ANDERE KETTE</button>
    </div>
  `;

  let answered = false;

  finalFeedback.querySelectorAll(".choiceBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (answered) return;
      answered = true;

      const i = Number(btn.dataset.i);
      const ok = i === qObj.c;

      if (ok) {
        award(+pts, `✅ Kettenrunde: Richtig (+${pts}) – Team ${state.active}`);
      } else {
        award(-Math.floor(pts/2), `❌ Kettenrunde: Falsch (-${Math.floor(pts/2)}) – richtig: <b>${qObj.a[qObj.c]}</b>`);
      }

      finalFeedback.querySelectorAll(".choiceBtn").forEach(b => b.disabled = true);
      const nextBtn = qs("#chainNext");
      nextBtn.disabled = false;
    });
  });

  qs("#chainNext").addEventListener("click", () => {
    state.r3.step += 1;
    if (state.r3.step >= 5) state.r3.done = true;
    saveState(state);
    r3Render();
  });

  qs("#chainSwitch").addEventListener("click", () => {
    state.r3.set = (state.r3.set + 1) % CHAIN_ROUNDS.length;
    state.r3.step = 0;
    state.r3.done = false;
    saveState(state);
    statusEl.textContent = "Kettenrunde gewechselt.";
    r3Render();
  });
}

// ---------------------- RENDER ALL ----------------------
function renderAll() {
  renderScore();

  if (!state.r1.done) switchPanel(1);
  else if (!state.r2.done) switchPanel(2);
  else switchPanel(3);

  r1Render();
  r2Render();
  r3Render();
}

renderAll();