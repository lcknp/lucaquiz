// LucaQuiz – einfache Quiz-Engine (6 Quizzes á 10 Fragen)

const QUIZZES = {
  1: {
    title: "Allgemeinwissen",
    questions: [
      { q: "Wie viele Kontinente gibt es?", a: ["5", "6", "7", "8"], c: 2 },
      { q: "Welches Tier ist das größte an Land lebende Säugetier?", a: ["Afrikanischer Elefant", "Giraffe", "Nashorn", "Nilpferd"], c: 0 },
      { q: "Welche Farbe entsteht aus Blau und Gelb?", a: ["Lila", "Grün", "Orange", "Türkis"], c: 1 },
      { q: "Wie heißt die Währung in Japan?", a: ["Won", "Yen", "Yuan", "Rupie"], c: 1 },
      { q: "Welche Sprache hat die meisten Muttersprachler weltweit?", a: ["Englisch", "Spanisch", "Mandarin (Chinesisch)", "Hindi"], c: 2 },
      { q: "Wie viele Minuten hat eine Stunde?", a: ["50", "55", "60", "65"], c: 2 },
      { q: "Was ist die Hauptstadt von Italien?", a: ["Mailand", "Rom", "Neapel", "Florenz"], c: 1 },
      { q: "Welcher Planet ist der Sonne am nächsten?", a: ["Merkur", "Venus", "Erde", "Mars"], c: 0 },
      { q: "Wofür steht die Abkürzung 'WWW'?", a: ["World Wide Web", "World Web Wide", "Web World Wide", "Wide World Web"], c: 0 },
      { q: "Welches Element hat das chemische Symbol O?", a: ["Gold", "Osmium", "Sauerstoff", "Zinn"], c: 2 },
    ],
  },
  2: {
    title: "Wissenschaft & Technik",
    questions: [
      { q: "Wie heißt der Prozess, bei dem Pflanzen Lichtenergie in chemische Energie umwandeln?", a: ["Fermentation", "Fotosynthese", "Oxidation", "Destillation"], c: 1 },
      { q: "Welche Einheit misst elektrische Spannung?", a: ["Ampere", "Volt", "Ohm", "Watt"], c: 1 },
      { q: "Wie viele DNA-Stränge bilden die klassische Doppelhelix?", a: ["1", "2", "3", "4"], c: 1 },
      { q: "Was ist die häufigste Gas-Komponente der Erdatmosphäre?", a: ["Sauerstoff", "Kohlendioxid", "Stickstoff", "Argon"], c: 2 },
      { q: "Welche Teilchen tragen eine negative elektrische Ladung?", a: ["Protonen", "Neutronen", "Elektronen", "Photonen"], c: 2 },
      { q: "Wie lautet die Formel für Wasser?", a: ["CO2", "H2O", "NaCl", "O2"], c: 1 },
      { q: "Welche dieser Größen ist eine SI-Basiseinheit?", a: ["Newton", "Joule", "Kelvin", "Pascal"], c: 2 },
      { q: "Was beschreibt 'Mooresches Gesetz' grob?", a: ["Internet-Geschwindigkeit verdoppelt sich jährlich", "Anzahl Transistoren auf Chips wächst regelmäßig", "Akkukapazität steigt linear", "Bildschirmgrößen werden kleiner"], c: 1 },
      { q: "Welche Farbe hat eine Flamme bei vollständiger Verbrennung von Methan typischerweise?", a: ["Blau", "Grün", "Rot", "Violett"], c: 0 },
      { q: "Wie heißt die kleinste Informationseinheit in der digitalen Technik?", a: ["Byte", "Bit", "Pixel", "Tick"], c: 1 },
    ],
  },
  3: {
    title: "Geografie",
    questions: [
      { q: "Welcher Ozean liegt zwischen Afrika und Australien?", a: ["Atlantik", "Pazifik", "Indischer Ozean", "Arktischer Ozean"], c: 2 },
      { q: "Welche Hauptstadt liegt an der Themse?", a: ["Dublin", "London", "Edinburgh", "Cardiff"], c: 1 },
      { q: "Welches Land hat die größte Fläche?", a: ["Kanada", "China", "USA", "Russland"], c: 3 },
      { q: "Wie heißt der längste Fluss der Welt (je nach Quelle Nile/Amazonas umstritten, hier klassische Antwort)?", a: ["Amazonas", "Nil", "Jangtse", "Mississippi"], c: 1 },
      { q: "Welche Stadt ist die Hauptstadt von Australien?", a: ["Sydney", "Melbourne", "Canberra", "Perth"], c: 2 },
      { q: "Der Mont Blanc liegt in/nahe welchem Gebirge?", a: ["Pyrenäen", "Alpen", "Karpaten", "Appalachen"], c: 1 },
      { q: "Welche Wüste ist die größte heiße Wüste der Erde?", a: ["Gobi", "Sahara", "Kalahari", "Atacama"], c: 1 },
      { q: "Welches Meer trennt Europa und Afrika an der Straße von Gibraltar?", a: ["Schwarzes Meer", "Rotes Meer", "Mittelmeer", "Nordsee"], c: 2 },
      { q: "Welche dieser Länder liegen in Skandinavien?", a: ["Spanien", "Schweden", "Italien", "Polen"], c: 1 },
      { q: "Wie heißt der höchste Berg der Erde (über Meeresspiegel)?", a: ["K2", "Mount Everest", "Kangchenjunga", "Makalu"], c: 1 },
    ],
  },
  4: {
    title: "Geschichte",
    questions: [
      { q: "In welchem Jahr fiel die Berliner Mauer?", a: ["1987", "1989", "1991", "1993"], c: 1 },
      { q: "Wer war der erste Mensch auf dem Mond?", a: ["Buzz Aldrin", "Yuri Gagarin", "Neil Armstrong", "Michael Collins"], c: 2 },
      { q: "Welche Epoche folgte in Europa auf das Mittelalter?", a: ["Steinzeit", "Renaissance", "Bronzezeit", "Barock"], c: 1 },
      { q: "Welche antike Stadt wurde durch den Ausbruch des Vesuvs 79 n. Chr. verschüttet?", a: ["Athen", "Karthago", "Pompeji", "Sparta"], c: 2 },
      { q: "Wer war Königin von England im Zeitalter der 'spanischen Armada' (1588)?", a: ["Elisabeth I.", "Victoria", "Anne", "Mary I."], c: 0 },
      { q: "Wie hieß das politische System der Sowjetunion?", a: ["Feudalismus", "Kommunismus", "Merkantilismus", "Anarchismus"], c: 1 },
      { q: "Die Französische Revolution begann in welchem Jahr?", a: ["1776", "1789", "1815", "1848"], c: 1 },
      { q: "Welche Schrift gilt als eine der frühesten bekannten Schriftsysteme?", a: ["Runen", "Hieroglyphen", "Keilschrift", "Kyrillisch"], c: 2 },
      { q: "Welches Reich baute das berühmte Straßennetz in Europa aus (z. B. Via Appia)?", a: ["Römisches Reich", "Persisches Reich", "Ägyptisches Reich", "Maya-Reich"], c: 0 },
      { q: "Was war die 'Seidenstraße' hauptsächlich?", a: ["Eine Religion", "Ein Handelswegenetz", "Ein Militärbündnis", "Ein Fluss"], c: 1 },
    ],
  },
  5: {
    title: "Kultur",
    questions: [
      { q: "Wer schrieb 'Faust'?", a: ["Goethe", "Schiller", "Kafka", "Brecht"], c: 0 },
      { q: "Welche Kunstform besteht aus gefalteten Papierfiguren?", a: ["Graffiti", "Origami", "Mosaik", "Kalligraphie"], c: 1 },
      { q: "Wie heißt das bekannteste Museum in Paris?", a: ["Prado", "Louvre", "Uffizien", "Tate Modern"], c: 1 },
      { q: "Welche Instrumentengruppe gehört die Violine an?", a: ["Blasinstrumente", "Schlaginstrumente", "Streichinstrumente", "Tasteninstrumente"], c: 2 },
      { q: "Was ist ein 'Haiku'?", a: ["Japanisches Kurzgedicht", "Tanzstil", "Musikrichtung", "Maltechnik"], c: 0 },
      { q: "Welcher Film zeigt einen Ring, der zerstört werden muss?", a: ["Star Wars", "Der Herr der Ringe", "Harry Potter", "Matrix"], c: 1 },
      { q: "Wie nennt man eine sehr große Orchesterbesetzung mit Chor und Solisten in klassischer Musik oft?", a: ["Sonate", "Sinfonie", "Oper", "Fuge"], c: 2 },
      { q: "Welche dieser Figuren stammt aus der griechischen Mythologie?", a: ["Thor", "Herkules", "Anubis", "Odin"], c: 1 },
      { q: "Was bedeutet 'Ballett' am ehesten?", a: ["Erzähltheater", "Kampfsport", "Tanztheater", "Stand-up-Comedy"], c: 2 },
      { q: "Wie heißt das meistverbreitete Notationssystem für Musik in Europa?", a: ["Tabulatur", "Neumen", "Fünfliniensystem", "Akkordsymbole"], c: 2 },
    ],
  },
  6: {
    title: "Logik & Mathe",
    questions: [
      { q: "Wie viel ist 12 × 12?", a: ["124", "144", "156", "132"], c: 1 },
      { q: "Welche Zahl ist eine Primzahl?", a: ["21", "27", "29", "33"], c: 2 },
      { q: "Wenn A = 3 und B = 5, wie viel ist A + 2B?", a: ["11", "13", "15", "17"], c: 1 },
      { q: "Wie viele Ecken hat ein Hexagon?", a: ["5", "6", "7", "8"], c: 1 },
      { q: "Welche Aussage ist logisch äquivalent zu 'nicht (A und B)'?", a: ["(nicht A) oder (nicht B)", "(nicht A) und (nicht B)", "A oder B", "A und (nicht B)"], c: 0 },
      { q: "Welche Zahl kommt als Nächstes: 2, 4, 8, 16, ...?", a: ["18", "24", "30", "32"], c: 3 },
      { q: "Wie viel ist 3/4 als Prozent?", a: ["25%", "50%", "75%", "80%"], c: 2 },
      { q: "Ein Rechteck hat Umfang 20. Wenn eine Seite 6 ist, wie lang ist die andere Seite?", a: ["3", "4", "5", "6"], c: 1 },
      { q: "Welche dieser Formen hat genau eine Symmetrieachse?", a: ["Kreis", "Gleichseitiges Dreieck", "Gleichschenkliges Dreieck", "Quadrat"], c: 2 },
      { q: "Wenn heute Dienstag ist, welcher Wochentag ist in 10 Tagen?", a: ["Donnerstag", "Freitag", "Samstag", "Sonntag"], c: 0 },
    ],
  },
};

// --------- Engine ----------
function qs(sel) { return document.querySelector(sel); }
function shuffle(arr) {
  // Fisher-Yates
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function storageKey(quizId) {
  return `lucaquiz_q${quizId}_state`;
}

function loadState(quizId) {
  try {
    const raw = sessionStorage.getItem(storageKey(quizId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveState(quizId, state) {
  sessionStorage.setItem(storageKey(quizId), JSON.stringify(state));
}

function resetState(quizId) {
  sessionStorage.removeItem(storageKey(quizId));
}

function init() {
  const root = document.querySelector(".quiz");
  if (!root) return;

  const quizId = Number(root.dataset.quiz);
  const quiz = QUIZZES[quizId];
  if (!quiz) {
    qs("#question").textContent = "Quiz nicht gefunden.";
    return;
  }

  const progressEl = qs("#progress");
  const scoreEl = qs("#score");
  const questionEl = qs("#question");
  const answersEl = qs("#answers");
  const nextBtn = qs("#nextBtn");
  const resetBtn = qs("#resetBtn");
  const resultEl = qs("#result");

  const total = quiz.questions.length;

  // State: randomized order + current index + score + answered flag
  let state = loadState(quizId);
  if (!state) {
    state = {
      order: shuffle([...Array(total).keys()]), // indices 0..total-1 in random order
      i: 0,
      score: 0,
      answered: false,
      // store last selected for UX (optional)
      last: null
    };
    saveState(quizId, state);
  }

  function render() {
    const idx = state.order[state.i];
    const item = quiz.questions[idx];

    progressEl.textContent = `Frage ${Math.min(state.i + 1, total)}/${total}`;
    scoreEl.textContent = `Score: ${state.score}`;
    resultEl.textContent = "";
    nextBtn.disabled = !state.answered;

    questionEl.textContent = item.q;
    answersEl.innerHTML = "";

    item.a.forEach((text, ai) => {
      const btn = document.createElement("button");
      btn.className = "answer";
      btn.type = "button";
      btn.textContent = text;

      btn.addEventListener("click", () => choose(ai, btn));
      answersEl.appendChild(btn);
    });

    if (state.answered && state.last) {
      // re-apply visual state if user refreshes
      const btns = [...answersEl.querySelectorAll(".answer")];
      const correctIndex = item.c;
      btns.forEach((b, ai) => {
        b.disabled = true;
        if (ai === correctIndex) b.classList.add("correct");
        if (ai === state.last.selected && ai !== correctIndex) b.classList.add("wrong");
      });
      resultEl.innerHTML = state.last.correct
        ? `✅ <strong>Richtig!</strong>`
        : `❌ <strong>Falsch.</strong> Richtige Antwort: <strong>${item.a[correctIndex]}</strong>`;
      nextBtn.disabled = false;
    }
  }

  function choose(answerIndex, clickedBtn) {
    if (state.answered) return;

    const idx = state.order[state.i];
    const item = quiz.questions[idx];
    const correctIndex = item.c;

    const btns = [...answersEl.querySelectorAll(".answer")];
    btns.forEach(b => (b.disabled = true));

    const isCorrect = answerIndex === correctIndex;
    if (isCorrect) {
      state.score += 1;
      clickedBtn.classList.add("correct");
      resultEl.innerHTML = `✅ <strong>Richtig!</strong>`;
    } else {
      clickedBtn.classList.add("wrong");
      btns[correctIndex].classList.add("correct");
      resultEl.innerHTML = `❌ <strong>Falsch.</strong> Richtige Antwort: <strong>${item.a[correctIndex]}</strong>`;
    }

    state.answered = true;
    state.last = { selected: answerIndex, correct: isCorrect };
    saveState(quizId, state);

    scoreEl.textContent = `Score: ${state.score}`;
    nextBtn.disabled = false;
  }

  nextBtn.addEventListener("click", () => {
    if (!state.answered) return;

    const isLast = state.i >= total - 1;
    if (isLast) {
      // Finish screen
      questionEl.textContent = `Fertig! Du hast ${state.score} von ${total} richtig.`;
      answersEl.innerHTML = "";
      progressEl.textContent = `Quiz beendet`;
      nextBtn.disabled = true;
      resultEl.innerHTML = `🎉 <strong>Glückwunsch!</strong> Du kannst „Zurücksetzen“ drücken und nochmal spielen.`;
      return;
    }

    state.i += 1;
    state.answered = false;
    state.last = null;
    saveState(quizId, state);
    render();
  });

  resetBtn.addEventListener("click", () => {
    resetState(quizId);
    state = null;
    // neu initialisieren
    state = {
      order: shuffle([...Array(total).keys()]),
      i: 0,
      score: 0,
      answered: false,
      last: null
    };
    saveState(quizId, state);
    render();
  });

  render();
}

document.addEventListener("DOMContentLoaded", init);