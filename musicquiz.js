function qs(sel){ return document.querySelector(sel); }

const stateKey = "lucaquiz_musicquiz_state_v1";
let state = JSON.parse(localStorage.getItem(stateKey) || "null") || {
  scores: { A: 0, B: 0 },
  active: "A",
  round: 1,
  usedTrackIds: []
};

const scoreEl = qs("#score");
const statusEl = qs("#status");
const roundEl = qs("#round");
const loginBtn = qs("#login");
const playBtn = qs("#play");
const nextBtn = qs("#next");
const resetBtn = qs("#reset");
const qEl = qs("#question");
const choicesEl = qs("#choices");
const feedbackEl = qs("#feedback");
const teamA = qs("#teamA");
const teamB = qs("#teamB");

let audio = new Audio();
audio.preload = "auto";
audio.addEventListener("ended", () => {});

function save(){ localStorage.setItem(stateKey, JSON.stringify(state)); }
function renderScore(){
  scoreEl.textContent = `TEAM A: ${state.scores.A} | TEAM B: ${state.scores.B} | AKTIV: ${state.active}`;
  teamA.style.outline = state.active==="A" ? "2px solid rgba(255,255,255,.35)" : "none";
  teamB.style.outline = state.active==="B" ? "2px solid rgba(255,255,255,.35)" : "none";
  roundEl.textContent = String(state.round);
}

teamA.onclick = () => { state.active="A"; save(); renderScore(); };
teamB.onclick = () => { state.active="B"; save(); renderScore(); };

resetBtn.onclick = () => {
  audio.pause(); audio.currentTime = 0;
  state = { scores:{A:0,B:0}, active:"A", round:1, usedTrackIds:[] };
  save();
  feedbackEl.textContent = "";
  qEl.textContent = "Reset: Verbinde Spotify und starte.";
  choicesEl.innerHTML = "";
  playBtn.disabled = true;
  nextBtn.disabled = true;
  renderScore();
};

loginBtn.onclick = async () => {
  // zurück zu dieser Seite nach Login
  await SpotifyAuth.login("musicquiz.html");
};

function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}

// Du kannst hier Genres ändern (macht es abwechslungsreicher)
const GENRES = [
  "pop",
  "dance",
  "electronic",
  "house",
  "edm",
  "rock",
  "classic rock",
  "80s",
  "90s",
  "2000s"
];


async function searchTracks() {
  for (let attempt = 0; attempt < 10; attempt++) {
    const genre = GENRES[Math.floor(Math.random() * GENRES.length)];
    const offset = Math.floor(Math.random() * 500);

    const q = encodeURIComponent(`genre:${genre}`);
    const data = await SpotifyAuth.api(
      `/search?type=track&limit=50&offset=${offset}&q=${q}`
    );

    const withPreview = (data.tracks?.items || []).filter(
      t => t.preview_url && t.popularity > 40
    );

    if (withPreview.length > 0) {
      return withPreview;
    }
  }

  return [];
}


async function getDistractors(correctTrack) {
  // hol weitere Tracks (für 4 Optionen)
  const items = await searchTracks();
  const names = new Set();
  names.add(`${correctTrack.name} — ${correctTrack.artists[0].name}`);

  const opts = [
    { label: `${correctTrack.name} — ${correctTrack.artists[0].name}`, correct: true }
  ];

  for (const t of items) {
    const label = `${t.name} — ${t.artists[0].name}`;
    if (names.has(label)) continue;
    names.add(label);
    opts.push({ label, correct: false });
    if (opts.length >= 4) break;
  }

  // Fallback: falls zu wenig, mit dem was da ist
  while (opts.length < 4) opts.push({ label: "KEINE OPTION", correct: false });

  return shuffle(opts);
}

let current = null; // { track, options }

async function loadRound() {
  feedbackEl.textContent = "";

  const token = SpotifyAuth.getToken();
  if (!token) {
    statusEl.textContent = "Bitte auf „MIT SPOTIFY VERBINDEN“ klicken.";
    playBtn.disabled = true;
    nextBtn.disabled = true;
    qEl.textContent = "Spotify nicht verbunden.";
    choicesEl.innerHTML = "";
    return;
  }

  statusEl.textContent = "Lade Song…";
  playBtn.disabled = true;
  nextBtn.disabled = true;
  choicesEl.innerHTML = "";
  qEl.textContent = "Song wird geladen…";

  // versuche ein paar Mal einen Track mit Preview zu bekommen
  let track = null;
  const items = await searchTracks();

  track = items.find(t => !state.usedTrackIds.includes(t.id));

  if (!track) {
    qEl.textContent = "Kein geeigneter Song gefunden. Bitte NÄCHSTER SONG klicken.";
    statusEl.textContent = "Spotify liefert aktuell keine Previews.";
    nextBtn.disabled = false;
    return;
  }


  if (!track) {
    qEl.textContent = "Leider keinen neuen Song mit Preview gefunden. Reset oder später erneut probieren.";
    statusEl.textContent = "Kein Preview verfügbar.";
    return;
  }

  state.usedTrackIds.push(track.id);
  save();

  const options = await getDistractors(track);
  current = { track, options };

  audio.pause(); audio.currentTime = 0;
  audio.src = track.preview_url;

  qEl.textContent = "🎧 Hör dir das Preview an und wähle die richtige Antwort:";
  choicesEl.innerHTML = "";

  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "choiceBtn";
    btn.type = "button";
    btn.textContent = opt.label;
    btn.onclick = () => answer(opt.correct, opt.label);
    choicesEl.appendChild(btn);
  });

  playBtn.disabled = false;
  nextBtn.disabled = false;
  statusEl.textContent = `Genre-Runde · Team ${state.active}`;
}

function answer(isCorrect, pickedLabel){
  if (!current) return;

  // disable buttons
  [...choicesEl.querySelectorAll("button")].forEach(b => b.disabled = true);

  const team = state.active;
  const pts = 200;      // Standardpunkte
  const lose = 100;     // Minus bei falsch

  if (isCorrect) {
    state.scores[team] += pts;
    feedbackEl.innerHTML = `✅ Richtig! +${pts} <br><span class="muted">${current.track.name} — ${current.track.artists[0].name}</span>`;
  } else {
    state.scores[team] -= lose;
    feedbackEl.innerHTML = `❌ Falsch (-${lose}). <br>Richtig: <b>${current.track.name} — ${current.track.artists[0].name}</b>`;
  }

  // nächste Runde
  state.round += 1;
  if (state.round > 10) {
    statusEl.innerHTML = `🎉 Fertig! TEAM A: <b>${state.scores.A}</b> · TEAM B: <b>${state.scores.B}</b>`;
    playBtn.disabled = true;
    nextBtn.disabled = true;
    qEl.textContent = "Spiel beendet. RESET für neues Spiel.";
  } else {
    statusEl.textContent = `Weiter mit „NÄCHSTER SONG“ — Team ${state.active}`;
  }

  save();
  renderScore();
}

playBtn.onclick = () => {
  if (!audio.src) return;
  audio.currentTime = 0;
  audio.play().catch(() => {
    statusEl.textContent = "Autoplay blockiert – tippe nochmal auf PREVIEW.";
  });
};

nextBtn.onclick = async () => {
  if (state.round > 10) return;
  await loadRound();
};

(async () => {
  renderScore();
  // autoload wenn token vorhanden
  if (SpotifyAuth.getToken()) {
    await loadRound();
  } else {
    statusEl.textContent = "Verbinde Spotify, um Previews zu hören.";
  }
})();
