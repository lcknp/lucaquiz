function qs(sel) { return document.querySelector(sel); }

const STORE_KEY = "lucaquiz_showquiz_state_v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function saveState(s) {
  localStorage.setItem(STORE_KEY, JSON.stringify(s));
}
function resetState() {
  localStorage.removeItem(STORE_KEY);
}

function norm(str) {
  return (str || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.,;:!?()"']/g, "");
}

// ---------------------- FRAGEN ----------------------
const ROUND1 = [
  { q:"WELCHES LAND HAT DIE HAUPTSTADT 'BRATISLAVA'?", a:["SLOWAKEI","SLOWENIEN","KROATIEN","LETTLAND"], c:0 },
  { q:"WELCHER WERT IST AM GRÖSSTEN?", a:["3/5","0,58","5/9","0,6"], c:3 }, // 0.6
  { q:"WOFÜR STEHT 'RAM'?", a:["RANDOM ACCESS MEMORY","READ AND MODIFY","REMOTE APP MODULE","REAL AUDIO MODE"], c:0 },
  { q:"WELCHER FLUSS FLIESST DURCH ROM?", a:["PO","TIBER","ARNO","EBRO"], c:1 },
  { q:"WELCHES ELEMENT HAT DAS SYMBOL 'Sn'?", a:["SILBER","ZINN","SCHWEFEL","NICKEL"], c:1 },
  { q:"WELCHES IST EIN PALINDROM?", a:["LAGER","ANNA","KATZE","BAUM"], c:1 },
  { q:"WIE VIELE DIAGONALEN HAT EIN FÜNFECK?", a:["3","5","7","10"], c:1 }, // 5*2/2=5
  { q:"WELCHER BEGRIFF PASST ZU 'WENN…DANN…' IN DER LOGIK?", a:["UND","ODER","IMPLIKATION","NEGATION"], c:2 },
  { q:"WELCHE STADT IST SITZ DER EU-KOMMISSION (BEKANNT)?", a:["STRASSBURG","BRÜSSEL","LUXEMBURG","FRANKFURT"], c:1 },
  { q:"WAS IST 15% VON 260?", a:["35","39","42","45"], c:1 }, // 39
];

const HINTS = [
  {
    solution: "MONT BLANC",
    hints: [
      "ICH LIEGE IN EUROPA.",
      "ICH BIN EIN BERG.",
      "ICH LIEGE IN DEN ALPEN.",
      "ICH WERDE OFT MIT FRANKREICH/ITALIEN VERBUNDEN.",
      "ICH BIN DER HÖCHSTE BERG DER ALPEN."
    ]
  },
  {
    solution: "PHOTOSYNTHESE",
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
    hints: [
      "ICH BIN EINE PERSON AUS DER ANTIKE.",
      "ICH BIN MIT MATHE VERBUNDEN.",
      "ICH BIN BERÜHMT FÜR EINEN SATZ IM DREIECK.",
      "MEIN SATZ NUTZT QUADRATE VON SEITENLÄNGEN.",
      "ICH HATTE EINE SCHULE/LEHRE."
    ]
  },
  {
    solution: "STRAUSS",
    hints: [
      "ICH BIN EIN VOGEL.",
      "ICH KANN NICHT FLIEGEN.",
      "ICH BIN SEHR SCHNELL ZU FUSS.",
      "ICH LEBE OFT IN AFRIKA.",
      "ICH LEGE SEHR GROSSE EIER."
    ]
  },
];

const FINAL = [
  { q:"WELCHE ZAHL IST DIE KLEINSTE PRIMZAHL, DIE GRÖSSER ALS 200 IST?", a:"211" },
  { q:"WIE HEISST DAS MEER ZWISCHEN SAUDI-ARABIEN UND AFRIKA (ÄGYPTEN/SUDAN/ERITREA)?", a:"ROTES MEER" },
  { q:"WELCHER FLUSS MÜNDET IN DIE NORDSEE UND FLIESST DURCH BASEL, STRASSBURG UND KÖLN?", a:"RHEIN" },
  { q:"WIE HEISST DER CHEMISCHE BEGRIFF FÜR 'WASSERSTOFFIONEN-KONZENTRATION' (SKALA)?", a:"PH WERT" },
];

// ---------------------- STATE ----------------------
let state = loadState();
if (!state) {
  state = {
    scores: { A: 0, B: 0 },
    active: "A",
    r1: { idx: 0, done: false, timeLeft: 60, started: false },
    r2: { idx: 0, revealed: 0, done: false },
    r3: { done: false, qIndex: 0, wager: 0, started: false }
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

// Finale
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
    r3: { done: false, qIndex: 0, wager: 0, started: false }
  };
  saveState(state);
  statusEl.textContent = "Reset: Neues Spiel gestartet.";
  renderAll();
});

function award(points, text) {
  const t = state.active;
 const before = state.scores[t];
  state.scores[t] = before + points;
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
    <div class="muted">Regel: Richtig +100, Falsch -50 (Zeitdruck!)</div>
  `;

  r1Card.querySelectorAll(".choiceBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.i);
      const ok = i === qObj.c;
      if (ok) award(+100, `✅ Runde 1: Richtig (+100) – Team ${state.active}`);
      else award(-50, `❌ Runde 1: Falsch (-50) – richtig: <b>${qObj.a[qObj.c]}</b>`);

      // Nächste Frage
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
function r2PointsForRevealed(revealed) {
  // 0 Hinweise -> 500, 1 -> 400, 2 -> 300, 3 -> 200, 4 -> 100
  const table = [500, 400, 300, 200, 100];
  return table[Math.min(revealed, 4)];
}

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

  const pts = r2PointsForRevealed(state.r2.revealed);
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

  const pts = r2PointsForRevealed(state.r2.revealed);

  if (guess && guess === sol) {
    award(+pts, `✅ Hinweis-Runde: Richtig (+${pts}) – Lösung: <b>${obj.solution}</b>`);
    hintFeedback.innerHTML = `✅ Richtig! Lösung: <b>${obj.solution}</b>`;
  } else {
    award(-100, `❌ Hinweis-Runde: Falsch (-100) – Lösung: <b>${obj.solution}</b>`);
    hintFeedback.innerHTML = `❌ Falsch. Lösung wäre: <b>${obj.solution}</b>`;
  }

  // nächstes Rätsel
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

// ---------------------- FINALE ----------------------
function r3Render() {
  finalFeedback.textContent = "";
  finalQuestionBox.hidden = !state.r3.started;

  if (state.r3.done) {
    finalFeedback.innerHTML = "✅ Finale beendet.";
    return;
  }

  const q = FINAL[state.r3.qIndex % FINAL.length];
  finalQ.textContent = q.q;
}

finalStart.addEventListener("click", () => {
  const team = state.active;
  const max = Math.max(0, state.scores[team]);
  let wager = Number(finalWager.value);

  if (!Number.isFinite(wager)) wager = 0;
  wager = Math.max(0, Math.min(max, wager));

  state.r3.wager = wager;
  state.r3.started = true;
  state.r3.qIndex = Math.floor(Math.random() * FINAL.length);
  saveState(state);

  statusEl.innerHTML = `🎬 Finale gestartet. Team ${team} setzt <b>${wager}</b> Punkte.`;
  r3Render();
});

finalSubmit.addEventListener("click", () => {
  if (!state.r3.started || state.r3.done) return;

  const team = state.active;
  const q = FINAL[state.r3.qIndex % FINAL.length];

  const guess = norm(finalInput.value);
  const sol = norm(q.a);

  if (guess && guess === sol) {
    award(+state.r3.wager, `🏆 Finale: Richtig! Team ${team} +${state.r3.wager} (Antwort: <b>${q.a}</b>)`);
    finalFeedback.innerHTML = `✅ Richtig! Antwort: <b>${q.a}</b>`;
  } else {
    award(-state.r3.wager, `💥 Finale: Falsch. Team ${team} -${state.r3.wager} (Richtig: <b>${q.a}</b>)`);
    finalFeedback.innerHTML = `❌ Falsch. Richtig: <b>${q.a}</b>`;
  }

  state.r3.done = true;
  saveState(state);
  renderScore();
});

// ---------------------- RENDER ALL ----------------------
function renderAll() {
  renderScore();

  // Runde Tabs: automatisch zur ersten nicht fertigen Runde springen
  if (!state.r1.done) switchPanel(1);
  else if (!state.r2.done) switchPanel(2);
  else switchPanel(3);

  r1Render();
  r2Render();
  r3Render();
}

renderAll();