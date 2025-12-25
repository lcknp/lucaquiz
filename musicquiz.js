function qs(sel){ return document.querySelector(sel); }

const PLAYLIST_ID = "3t9VMF91O7fV2B38AaOu2x"; // deine Playlist

const stateKey = "lucaquiz_musicquiz_hostmode_v1";
let state = JSON.parse(localStorage.getItem(stateKey) || "null") || {
  scores: { A: 0, B: 0 },
  active: "A",
  round: 1,
  tracks: [],
  used: [],
  current: null
};

const scoreEl = qs("#score");
const statusEl = qs("#status");
const roundEl = qs("#round");
const qEl = qs("#question");
const choicesEl = qs("#choices");
const feedbackEl = qs("#feedback");

const loginBtn = qs("#login");
const nextBtn = qs("#next");
const resetBtn = qs("#reset");
const teamA = qs("#teamA");
const teamB = qs("#teamB");

const revealBtn = qs("#reveal");
const revealBox = qs("#revealBox");

function save(){ localStorage.setItem(stateKey, JSON.stringify(state)); }

function renderScore(){
  scoreEl.textContent = `TEAM A: ${state.scores.A} | TEAM B: ${state.scores.B} | AKTIV: ${state.active}`;
  roundEl.textContent = `${state.round}/10`;
}

teamA.onclick = () => { state.active="A"; save(); renderScore(); };
teamB.onclick = () => { state.active="B"; save(); renderScore(); };

resetBtn.onclick = () => {
  state = { scores:{A:0,B:0}, active:"A", round:1, tracks:[], used:[], current:null };
  save();
  revealBox.textContent = "";
  feedbackEl.textContent = "";
  choicesEl.innerHTML = "";
  qEl.textContent = "Reset: Verbinde Spotify und starte.";
  statusEl.textContent = "";
  nextBtn.disabled = true;
  revealBtn.disabled = true;
  renderScore();
  if (SpotifyAuth.getToken()) loadPlaylist();
};

loginBtn.onclick = () => SpotifyAuth.login("musikquiz.html"); // <- WICHTIG: du nutzt musikquiz.html!

function shuffle(a){
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

async function loadPlaylist(){
  statusEl.textContent = "Lade Playlist…";
  nextBtn.disabled = true;
  revealBtn.disabled = true;

  try{
    const data = await SpotifyAuth.api(`/playlists/${PLAYLIST_ID}/tracks?limit=100`);
    const tracks = (data.items || []).map(x => x.track).filter(t => t && t.id && t.name && t.artists?.length);

    if(!tracks.length){
      statusEl.textContent = "Playlist leer oder nicht lesbar.";
      return;
    }

    state.tracks = shuffle(tracks);
    save();

    statusEl.textContent = "Playlist geladen ✅ Klick auf „NÄCHSTER SONG“.";
    nextBtn.disabled = false;

  } catch(e){
    const msg = e?.message ? e.message : String(e);
    statusEl.textContent = "Fehler beim Laden: " + msg;
  }
}

function buildQuestion(track){
  // Frage: Songtitel raten (Antworten nur Titel)
  qEl.textContent = "🎧 Host spielt jetzt einen Song ab. Wie heißt dieser Song?";
  revealBox.textContent = "";
  feedbackEl.textContent = "";
  revealBtn.disabled = false;

  // Distraktoren
  const others = state.tracks.filter(t => t.id !== track.id);
  shuffle(others);

  const options = shuffle([
    track.name,
    ...others.slice(0,3).map(t => t.name)
  ]);

  choicesEl.innerHTML = "";
  options.forEach(name => {
    const b = document.createElement("button");
    b.className = "choiceBtn";
    b.type = "button";
    b.textContent = name;
    b.onclick = () => answer(name === track.name, track);
    choicesEl.appendChild(b);
  });
}

function nextSong(){
  if(state.round > 10){
    statusEl.innerHTML = `🎉 Fertig! TEAM A: <b>${state.scores.A}</b> · TEAM B: <b>${state.scores.B}</b>`;
    nextBtn.disabled = true;
    revealBtn.disabled = true;
    return;
  }

  const track = state.tracks.find(t => !state.used.includes(t.id));
  if(!track){
    statusEl.textContent = "Keine Songs mehr.";
    nextBtn.disabled = true;
    revealBtn.disabled = true;
    return;
  }

  state.used.push(track.id);
  state.current = track;
  save();

  statusEl.textContent = `Team ${state.active} ist dran. (Host: Song in Spotify abspielen)`;
  buildQuestion(track);
}

function answer(correct, track){
  // Buttons sperren
  [...choicesEl.querySelectorAll("button")].forEach(b => b.disabled = true);

  const team = state.active;

  if(correct){
    state.scores[team] += 300;
    feedbackEl.innerHTML = `✅ Richtig! +300`;
  } else {
    state.scores[team] -= 150;
    feedbackEl.innerHTML = `❌ Falsch! -150`;
  }

  state.round += 1;
  save();
  renderScore();
  statusEl.textContent = "Klick „NÄCHSTER SONG“ für die nächste Runde.";
}

revealBtn.onclick = () => {
  const t = state.current;
  if(!t) return;
  revealBox.innerHTML = `🎵 Auflösung: <b>${t.name}</b> — ${t.artists[0].name}`;
};

nextBtn.onclick = () => nextSong();

renderScore();

if(SpotifyAuth.getToken()){
  loadPlaylist();
} else {
  statusEl.textContent = "Verbinde Spotify, um zu starten.";
}

const audio = document.getElementById("audio");
const playBtn = document.getElementById("playHidden");

// track.preview_url MUSS existieren
function playHiddenPreview(previewUrl){
  audio.src = previewUrl;
  audio.currentTime = 0;
  audio.play().catch(() => {
    alert("Tippe erneut auf Play (Browser-Autoplay-Schutz)");
  });
}
