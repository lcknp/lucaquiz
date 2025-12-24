function qs(sel){ return document.querySelector(sel); }

const stateKey = "lucaquiz_lyricsquiz_state_v1";
let state = JSON.parse(localStorage.getItem(stateKey) || "null") || {
  scores: { A: 0, B: 0 },
  active: "A",
  round: 1,
  idx: 0
};

const Q = [
  {
    lyricHint: "„Is this the real life? Is this just fantasy?“ (sehr bekanntes Intro)",
    options: ["Queen — Bohemian Rhapsody", "Nirvana — Smells Like Teen Spirit", "Adele — Hello", "ABBA — Mamma Mia"],
    correct: 0,
    spotifyQuery: "Bohemian Rhapsody Queen"
  },
  {
    lyricHint: "„…sweet dreams are made of this…“",
    options: ["Eurythmics — Sweet Dreams", "Metallica — One", "Coldplay — Yellow", "The Weeknd — Blinding Lights"],
    correct: 0,
    spotifyQuery: "Sweet Dreams Eurythmics"
  },
  {
    lyricHint: "„…hello from the other side…“",
    options: ["Adele — Hello", "Ed Sheeran — Shape of You", "Lady Gaga — Poker Face", "Oasis — Wonderwall"],
    correct: 0,
    spotifyQuery: "Hello Adele"
  },
  {
    lyricHint: "„…we will, we will rock you…“",
    options: ["Queen — We Will Rock You", "AC/DC — Thunderstruck", "Linkin Park — Numb", "U2 — One"],
    correct: 0,
    spotifyQuery: "We Will Rock You Queen"
  },
  {
    lyricHint: "„…I’m gonna take my horse to the old town road…“",
    options: ["Lil Nas X — Old Town Road", "Post Malone — Circles", "Drake — Gods Plan", "Travis Scott — Goosebumps"],
    correct: 0,
    spotifyQuery: "Old Town Road Lil Nas X"
  },
  {
    lyricHint: "„…never gonna give you up…“",
    options: ["Rick Astley — Never Gonna Give You Up", "a-ha — Take On Me", "Michael Jackson — Thriller", "Daft Punk — One More Time"],
    correct: 0,
    spotifyQuery: "Never Gonna Give You Up Rick Astley"
  },
  {
    lyricHint: "„…today is gonna be the day…“ (Britpop-Klassiker)",
    options: ["Oasis — Wonderwall", "Blur — Song 2", "The Beatles — Hey Jude", "Arctic Monkeys — Do I Wanna Know?"],
    correct: 0,
    spotifyQuery: "Wonderwall Oasis"
  },
  {
    lyricHint: "„…cause baby you’re a firework…“",
    options: ["Katy Perry — Firework", "Rihanna — Diamonds", "Beyoncé — Halo", "Dua Lipa — Levitating"],
    correct: 0,
    spotifyQuery: "Firework Katy Perry"
  },
  {
    lyricHint: "„…I got a feeling…“ (Party-Hit)",
    options: ["The Black Eyed Peas — I Gotta Feeling", "Maroon 5 — Sugar", "Imagine Dragons — Believer", "Sia — Chandelier"],
    correct: 0,
    spotifyQuery: "I Gotta Feeling Black Eyed Peas"
  },
  {
    lyricHint: "„…shake it off…“",
    options: ["Taylor Swift — Shake It Off", "Ariana Grande — 7 rings", "Billie Eilish — bad guy", "Bruno Mars — Uptown Funk"],
    correct: 0,
    spotifyQuery: "Shake It Off Taylor Swift"
  },
];

const scoreEl = qs("#score");
const statusEl = qs("#status");
const roundEl = qs("#round");
const lyricEl = qs("#lyric");
const choicesEl = qs("#choices");
const feedbackEl = qs("#feedback");

const loginBtn = qs("#login");
const previewBtn = qs("#preview");
const nextBtn = qs("#next");
const resetBtn = qs("#reset");

const teamA = qs("#teamA");
const teamB = qs("#teamB");

let audio = new Audio();
audio.preload = "auto";
let currentTrackPreview = null;

function save(){ localStorage.setItem(stateKey, JSON.stringify(state)); }
function renderScore(){
  scoreEl.textContent = `TEAM A: ${state.scores.A} | TEAM B: ${state.scores.B} | AKTIV: ${state.active}`;
  teamA.style.outline = state.active==="A" ? "2px solid rgba(255,255,255,.35)" : "none";
  teamB.style.outline = state.active==="B" ? "2px solid rgba(255,255,255,.35)" : "none";
  roundEl.textContent = String(state.round);
}

teamA.onclick = () => { state.active="A"; save(); renderScore(); };
teamB.onclick = () => { state.active="B"; save(); renderScore(); };

loginBtn.onclick = async () => {
  await SpotifyAuth.login("lyricsquiz.html");
};

resetBtn.onclick = () => {
  audio.pause(); audio.currentTime = 0;
  state = { scores:{A:0,B:0}, active:"A", round:1, idx:0 };
  save();
  currentTrackPreview = null;
  previewBtn.disabled = true;
  feedbackEl.textContent = "";
  render();
};

function pickQuestion() {
  return Q[state.idx % Q.length];
}

async function findPreview(query) {
  const token = SpotifyAuth.getToken();
  if (!token) return null;

  const q = encodeURIComponent(query);
  const data = await SpotifyAuth.api(`/search?type=track&limit=5&q=${q}`);
  const tracks = data.tracks?.items || [];
  const withPreview = tracks.find(t => t.preview_url);
  return withPreview ? withPreview.preview_url : null;
}

function render() {
  renderScore();
  feedbackEl.textContent = "";
  previewBtn.disabled = true;
  currentTrackPreview = null;

  const qObj = pickQuestion();
  lyricEl.textContent = qObj.lyricHint;
  choicesEl.innerHTML = "";

  qObj.options.forEach((label, i) => {
    const btn = document.createElement("button");
    btn.className = "choiceBtn";
    btn.type = "button";
    btn.textContent = label;
    btn.onclick = () => answer(i);
    choicesEl.appendChild(btn);
  });

  statusEl.textContent = "Wähle die richtige Option. Preview gibt’s nach der Lösung (wenn Spotify verbunden).";
}

async function answer(i) {
  const qObj = pickQuestion();
  [...choicesEl.querySelectorAll("button")].forEach(b => b.disabled = true);

  const team = state.active;
  const pts = 250;
  const lose = 150;

  const ok = i === qObj.correct;

  if (ok) {
    state.scores[team] += pts;
    feedbackEl.innerHTML = `✅ Richtig! +${pts}<br><span class="muted">${qObj.options[qObj.correct]}</span>`;
  } else {
    state.scores[team] -= lose;
    feedbackEl.innerHTML = `❌ Falsch (-${lose})<br>Richtig: <b>${qObj.options[qObj.correct]}</b>`;
  }

  save();
  renderScore();

  // Preview nach Lösung versuchen
  try {
    const url = await findPreview(qObj.spotifyQuery);
    if (url) {
      currentTrackPreview = url;
      audio.src = url;
      previewBtn.disabled = false;
      statusEl.textContent = "Preview verfügbar! ▶";
    } else {
      statusEl.textContent = "Kein Preview gefunden (oder nicht verbunden).";
    }
  } catch {
    statusEl.textContent = "Spotify nicht verbunden – Preview nicht verfügbar.";
  }

  state.round += 1;
  state.idx += 1;
  save();

  if (state.round > 10) {
    statusEl.innerHTML = `🎉 Fertig! TEAM A: <b>${state.scores.A}</b> · TEAM B: <b>${state.scores.B}</b>`;
    nextBtn.disabled = true;
  }
}

previewBtn.onclick = () => {
  if (!currentTrackPreview) return;
  audio.currentTime = 0;
  audio.play().catch(() => {
    statusEl.textContent = "Autoplay blockiert – tippe nochmal auf PREVIEW.";
  });
};

nextBtn.onclick = () => {
  if (state.round > 10) return;
  render();
};

render();
