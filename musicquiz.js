function qs(sel){ return document.querySelector(sel); }

const PLAYLIST_ID = "37i9dQZEVXbJiZcmkrIHGU?si=f3362dcec6864211"; // ← HIER DEINE PLAYLIST ID

const stateKey = "lucaquiz_musicquiz_playlist_v1";
let state = JSON.parse(localStorage.getItem(stateKey) || "null") || {
  scores: { A: 0, B: 0 },
  active: "A",
  round: 1,
  tracks: [],
  used: []
};

const scoreEl = qs("#score");
const statusEl = qs("#status");
const roundEl = qs("#round");
const qEl = qs("#question");
const choicesEl = qs("#choices");
const feedbackEl = qs("#feedback");
const playerEl = qs("#player");
const nextBtn = qs("#next");
const resetBtn = qs("#reset");
const teamA = qs("#teamA");
const teamB = qs("#teamB");
const loginBtn = qs("#login");

function save(){ localStorage.setItem(stateKey, JSON.stringify(state)); }

function renderScore(){
  scoreEl.textContent = `TEAM A: ${state.scores.A} | TEAM B: ${state.scores.B} | AKTIV: ${state.active}`;
  roundEl.textContent = `${state.round}/10`;
}

teamA.onclick = () => { state.active="A"; save(); renderScore(); };
teamB.onclick = () => { state.active="B"; save(); renderScore(); };

resetBtn.onclick = () => {
  state = { scores:{A:0,B:0}, active:"A", round:1, tracks:[], used:[] };
  save();
  playerEl.innerHTML = "";
  feedbackEl.textContent = "";
  loadPlaylist();
};

loginBtn.onclick = () => SpotifyAuth.login("musicquiz.html");

function shuffle(a){
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

async function loadPlaylist(){
  if(!SpotifyAuth.getToken()){
    statusEl.textContent = "Bitte mit Spotify verbinden.";
    return;
  }

  statusEl.textContent = "Lade Playlist…";

  const data = await SpotifyAuth.api(
    `/playlists/${PLAYLIST_ID}/tracks?limit=100`
  );

  state.tracks = data.items
    .map(i => i.track)
    .filter(t => t && t.id && t.name && t.artists?.length);

  shuffle(state.tracks);
  save();
  nextRound();
}

function nextRound(){
  if(state.round > 10){
    statusEl.innerHTML = `🎉 Fertig! TEAM A: <b>${state.scores.A}</b> · TEAM B: <b>${state.scores.B}</b>`;
    return;
  }

  const track = state.tracks.find(t => !state.used.includes(t.id));
  if(!track){
    statusEl.textContent = "Keine Songs mehr.";
    return;
  }

  state.used.push(track.id);
  save();

  playerEl.innerHTML = `
    <iframe style="width:100%;height:152px;border-radius:14px"
      src="https://open.spotify.com/embed/track/${track.id}"
      allow="autoplay; encrypted-media"></iframe>
  `;

  qEl.textContent = "🎧 Wie heißt dieser Song?";
  choicesEl.innerHTML = "";

  const options = shuffle([
    track.name,
    ...shuffle(state.tracks)
      .filter(t => t.id !== track.id)
      .slice(0,3)
      .map(t => t.name)
  ]);

  options.forEach(name => {
    const b = document.createElement("button");
    b.className = "choiceBtn";
    b.textContent = name;
    b.onclick = () => answer(name === track.name, track);
    choicesEl.appendChild(b);
  });

  statusEl.textContent = `Team ${state.active} ist dran`;
}

function answer(correct, track){
  const team = state.active;

  if(correct){
    state.scores[team] += 300;
    feedbackEl.innerHTML = `✅ Richtig!<br>${track.name} — ${track.artists[0].name}`;
  } else {
    state.scores[team] -= 150;
    feedbackEl.innerHTML = `❌ Falsch!<br>Richtig: ${track.name}`;
  }

  state.round++;
  save();
  renderScore();
}

nextBtn.onclick = nextRound;

renderScore();
if(SpotifyAuth.getToken()) loadPlaylist();
