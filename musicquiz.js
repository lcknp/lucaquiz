function qs(sel){ return document.querySelector(sel); }

const stateKey = "lucaquiz_musicquiz_state_v2_embed";
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
const playerEl = qs("#player");

let audio = new Audio();
audio.preload = "auto";

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
  playerEl.innerHTML = "";
  playBtn.disabled = true;
  nextBtn.disabled = true;
  renderScore();
};

loginBtn.onclick = async () => {
  await SpotifyAuth.login("musicquiz.html");
};

function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}

// Preview-Quote ist oft schlecht → wir nehmen POPULÄRE Suchbegriffe statt Genre-only
const QUERIES = [
  "year:2010-2019",
  "year:2000-2009",
  "year:1990-1999",
  "tag:new",
  "genre:pop",
  "genre:dance",
  "genre:rock",
  "genre:hip-hop"
];

async function searchTracksAny() {
  // Versuche mehrfach, irgendeinen Track zu finden (Preview optional)
  for (let attempt = 0; attempt < 12; attempt++) {
    const qBase = QUERIES[Math.floor(Math.random() * QUERIES.length)];
    const offset = Math.floor(Math.random() * 800);
    const q = encodeURIComponent(qBase);

    const data = await SpotifyAuth.api(`/search?type=track&limit=50&offset=${offset}&q=${q}`);
    const items = (data.tracks?.items || [])
      .filter(t => t && t.id && t.name && t.artists?.length)
      .filter(t => (t.popularity ?? 0) >= 35);

    const unused = items.filter(t => !state.usedTrackIds.includes(t.id));
    if (unused.length) return unused;
  }
  return [];
}

async function getDistractors(correctTrack) {
  const pool = await searchTracksAny();
  const opts = [];
  const seen = new Set();

  function labelOf(t){ return `${t.name} — ${t.artists[0].name}`; }

  opts.push({ label: labelOf(correctTrack), correct: true });
  seen.add(labelOf(correctTrack));

  for (const t of pool) {
    const lab = labelOf(t);
    if (seen.has(lab)) continue;
    seen.add(lab);
    opts.push({ label: lab, correct: false });
    if (opts.length >= 4) break;
  }

  while (opts.length < 4) opts.push({ label: "—", correct: false });
  return shuffle(opts);
}

let current = null; // { track, options, previewUrl, embedUrl }

function setSpotifyEmbed(trackId){
  // Spotify Embed Player (funktioniert auch ohne preview_url)
  playerEl.innerHTML = `
    <iframe
      style="border-radius:14px; width:100%; height:152px; border:0;"
      src="https://open.spotify.com/embed/track/${trackId}"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"></iframe>
  `;
}

async function loadRound() {
  feedbackEl.textContent = "";
  choicesEl.innerHTML = "";
  playerEl.innerHTML = "";

  const token = SpotifyAuth.getToken();
  if (!token) {
    statusEl.textContent = "Bitte auf „MIT SPOTIFY VERBINDEN“ klicken.";
    playBtn.disabled = true;
    nextBtn.disabled = true;
    qEl.textContent = "Spotify nicht verbunden.";
    return;
  }

  statusEl.textContent = "Lade Song…";
  playBtn.disabled = true;
  nextBtn.disabled = true;
  qEl.textContent = "Song wird geladen…";

  const items = await searchTracksAny();
  const track = items[0];

  if (!track) {
    qEl.textContent = "Spotify liefert gerade keine passenden Treffer. Bitte später nochmal probieren.";
    statusEl.textContent = "Keine Tracks gefunden.";
    nextBtn.disabled = false;
    return;
  }

  state.usedTrackIds.push(track.id);
  save();

  const options = await getDistractors(track);

  current = {
    track,
    options,
    previewUrl: track.preview_url || null,
    embedUrl: `https://open.spotify.com/track/${track.id}`
  };

  // Player: immer Embed zeigen (am sichersten)
  setSpotifyEmbed(track.id);

  // Wenn preview_url existiert, erlauben wir den PREVIEW Button zusätzlich (optional)
  if (current.previewUrl) {
    audio.pause(); audio.currentTime = 0;
    audio.src = current.previewUrl;
    playBtn.disabled = false;
  } else {
    playBtn.disabled = true; // sonst verwirrend
  }

  qEl.textContent = "🎧 Spiele im Player ab und wähle die richtige Antwort:";
  choicesEl.innerHTML = "";
  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "choiceBtn";
    btn.type = "button";
    btn.textContent = opt.label;
    btn.onclick = () => answer(opt.correct);
    choicesEl.appendChild(btn);
  });

  nextBtn.disabled = false;
  statusEl.textContent = `Team ${state.active}: Song läuft im Spotify Player.`;
}

function answer(isCorrect){
  if (!current) return;

  [...choicesEl.querySelectorAll("button")].forEach(b => b.disabled = true);

  const team = state.active;
  const pts = 250;
  const lose = 150;

  if (isCorrect) {
    state.scores[team] += pts;
    feedbackEl.innerHTML = `✅ Richtig! +${pts}<br><span class="muted">${current.track.name} — ${current.track.artists[0].name}</span>`;
  } else {
    state.scores[team] -= lose;
    feedbackEl.innerHTML = `❌ Falsch (-${lose})<br>Richtig: <b>${current.track.name} — ${current.track.artists[0].name}</b>`;
  }

  state.round += 1;
  save();
  renderScore();

  if (state.round > 10) {
    statusEl.innerHTML = `🎉 Fertig! TEAM A: <b>${state.scores.A}</b> · TEAM B: <b>${state.scores.B}</b>`;
    playBtn.disabled = true;
    nextBtn.disabled = true;
    qEl.textContent = "Spiel beendet. RESET für neues Spiel.";
  } else {
    statusEl.textContent = `Weiter mit „NÄCHSTER SONG“.`;
  }
}

playBtn.onclick = () => {
  if (!current?.previewUrl) return;
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
  if (SpotifyAuth.getToken()) {
    nextBtn.disabled = false;
    await loadRound();
  } else {
    statusEl.textContent = "Verbinde Spotify, um zu starten.";
  }
})();
