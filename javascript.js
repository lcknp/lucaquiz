// LucaQuiz Jeopardy – 5 Kategorien x 5 Werte
// Ungerade Quiz-ID: 100/200/300/400/500
// Gerade Quiz-ID:   200/400/600/800/1000
//
// Richtig: +Punkte
// Falsch:  -Punkte
// Feld wird danach deaktiviert.

function qs(sel) { return document.querySelector(sel); }

function baseValueForQuiz(quizId) {
  return (quizId % 2 === 0) ? 200 : 100;
}

function valuesForQuiz(quizId) {
  const base = baseValueForQuiz(quizId);
  return [1,2,3,4,5].map(n => n * base);
}

function storageKey(quizId) {
  return `lucaquiz_jeopardy_q${quizId}_state_v1`;
}

function loadState(quizId) {
  try {
    const raw = localStorage.getItem(storageKey(quizId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveState(quizId, state) {
  localStorage.setItem(storageKey(quizId), JSON.stringify(state));
}

function resetState(quizId) {
  localStorage.removeItem(storageKey(quizId));
}

/**
 * Fragen-Daten:
 * categories: 5 Kategorien
 * clues[catIndex][rowIndex] => { q, a:[...], c:indexCorrect, exp(optional) }
 *
 * rowIndex 0..4 entspricht Punkten (1..5)*Base
 */
function getQuestionBank(/* quizId */) {
  // Du kannst später pro quizId andere Fragen liefern.
  return {
    categories: ["Allgemein", "Wissenschaft", "Geografie", "Geschichte", "Kultur"],
    clues: [
      // Allgemein
      [
        { q: "Wie viele Minuten hat eine Stunde?", a: ["50", "55", "60", "65"], c: 2 },
        { q: "Welche Farbe entsteht aus Blau + Gelb?", a: ["Grün", "Orange", "Lila", "Grau"], c: 0 },
        { q: "Wie viele Kontinente gibt es (klassische Zählung)?", a: ["5", "6", "7", "8"], c: 2 },
        { q: "Wie heißt die Währung in Japan?", a: ["Yuan", "Yen", "Won", "Rupie"], c: 1 },
        { q: "Welcher Planet ist der Sonne am nächsten?", a: ["Merkur", "Venus", "Erde", "Mars"], c: 0 },
      ],
      // Wissenschaft
      [
        { q: "Wie lautet die Formel für Wasser?", a: ["CO₂", "H₂O", "NaCl", "O₂"], c: 1 },
        { q: "Welche Einheit misst elektrische Spannung?", a: ["Volt", "Ampere", "Watt", "Ohm"], c: 0 },
        { q: "Wie heißt der Prozess, bei dem Pflanzen Energie aus Licht nutzen?", a: ["Oxidation", "Fotosynthese", "Gärung", "Destillation"], c: 1 },
        { q: "Welche Teilchen sind negativ geladen?", a: ["Protonen", "Neutronen", "Elektronen", "Photonen"], c: 2 },
        { q: "Was ist der häufigste Bestandteil der Erdatmosphäre?", a: ["Sauerstoff", "Stickstoff", "CO₂", "Helium"], c: 1 },
      ],
      // Geografie
      [
        { q: "Welche Hauptstadt liegt an der Themse?", a: ["London", "Dublin", "Cardiff", "Edinburgh"], c: 0 },
        { q: "Welche Stadt ist Hauptstadt von Australien?", a: ["Sydney", "Melbourne", "Canberra", "Perth"], c: 2 },
        { q: "Welches Land hat die größte Fläche?", a: ["Kanada", "USA", "China", "Russland"], c: 3 },
        { q: "Welche Wüste ist die größte heiße Wüste?", a: ["Gobi", "Sahara", "Atacama", "Kalahari"], c: 1 },
        { q: "Welcher Ozean liegt zwischen Afrika und Australien?", a: ["Atlantik", "Pazifik", "Indischer Ozean", "Arktischer Ozean"], c: 2 },
      ],
      // Geschichte
      [
        { q: "In welchem Jahr fiel die Berliner Mauer?", a: ["1987", "1989", "1991", "1993"], c: 1 },
        { q: "Wer war der erste Mensch auf dem Mond?", a: ["Neil Armstrong", "Buzz Aldrin", "Yuri Gagarin", "Michael Collins"], c: 0 },
        { q: "Welche Epoche folgte in Europa auf das Mittelalter?", a: ["Renaissance", "Steinzeit", "Bronzezeit", "Aufklärung"], c: 0 },
        { q: "Welche Stadt wurde 79 n. Chr. durch den Vesuv verschüttet?", a: ["Pompeji", "Athen", "Sparta", "Karthago"], c: 0 },
        { q: "Die Französische Revolution begann in welchem Jahr?", a: ["1776", "1789", "1815", "1848"], c: 1 },
      ],
      // Kultur
      [
        { q: "Wer schrieb 'Faust'?", a: ["Goethe", "Schiller", "Kafka", "Brecht"], c: 0 },
        { q: "Wie heißt das berühmte Museum in Paris?", a: ["Louvre", "Prado", "Uffizien", "Tate Modern"], c: 0 },
        { q: "Was ist ein 'Haiku'?", a: ["Kurzgedicht", "Tanz", "Instrument", "Gemälde"], c: 0 },
        { q: "Welche Instrumentengruppe gehört die Violine an?", a: ["Blas", "Schlag", "Streich", "Tasten"], c: 2 },
        { q: "Welche Figur stammt aus der griechischen Mythologie?", a: ["Odin", "Thor", "Herkules", "Anubis"], c: 2 },
      ],
    ],
  };
}

function init() {
  const root = document.querySelector(".game");
  if (!root) return;

  const quizId = Number(root.dataset.quiz);
  const bank = getQuestionBank(quizId);
  const values = valuesForQuiz(quizId);

  const boardEl = qs("#board");
  const scoreEl = qs("#score");
  const statusEl = qs("#status");
  const resetBtn = qs("#resetBtn");

  const modal = qs("#qModal");
  const modalMeta = qs("#modalMeta");
  const modalQuestion = qs("#modalQuestion");
  const modalAnswers = qs("#modalAnswers");
  const modalFeedback = qs("#modalFeedback");
  const submitBtn = qs("#submitBtn");

  // state: score + used tiles (cat,row)
  let state = loadState(quizId);
  if (!state) {
    state = {
      score: 0,
      used: {}, // key "c-r" => true
    };
    saveState(quizId, state);
  }

  // current selection
  let current = null; // {cat,row,value,clue}

  function renderScore() {
    scoreEl.textContent = `Score: ${state.score}`;
  }

  function keyFor(cat, row) { return `${cat}-${row}`; }

  function buildBoard() {
    boardEl.innerHTML = "";

    // Category headers
    bank.categories.forEach((name) => {
      const h = document.createElement("div");
      h.className = "cat";
      h.textContent = name;
      boardEl.appendChild(h);
    });

    // 5 rows of tiles
    for (let row = 0; row < 5; row++) {
      for (let cat = 0; cat < 5; cat++) {
        const btn = document.createElement("button");
        btn.className = "tile";
        btn.type = "button";
        btn.textContent = String(values[row]);

        const used = !!state.used[keyFor(cat, row)];
        if (used) {
          btn.classList.add("used");
          btn.disabled = true;
        }

        btn.addEventListener("click", () => openQuestion(cat, row));
        boardEl.appendChild(btn);
      }
    }
  }

  function openQuestion(cat, row) {
    const clue = bank.clues[cat][row];
    const value = values[row];

    current = { cat, row, value, clue };
    modalMeta.textContent = `${bank.categories[cat]} • ${value} Punkte`;
    modalQuestion.textContent = clue.q;

    modalAnswers.innerHTML = "";
    modalFeedback.textContent = "";
    submitBtn.disabled = true;

    // Create radio choices
    clue.a.forEach((txt, idx) => {
      const label = document.createElement("label");
      label.className = "choice";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "choice";
      input.value = String(idx);

      input.addEventListener("change", () => {
        submitBtn.disabled = false;
      });

      const span = document.createElement("span");
      span.textContent = txt;

      label.appendChild(input);
      label.appendChild(span);
      modalAnswers.appendChild(label);
    });

    modal.showModal();
  }

  function lockModalChoices(correctIndex, selectedIndex) {
    const labels = [...modalAnswers.querySelectorAll(".choice")];
    labels.forEach((lab, idx) => {
      const input = lab.querySelector("input");
      input.disabled = true;

      if (idx === correctIndex) lab.classList.add("correct");
      if (idx === selectedIndex && selectedIndex !== correctIndex) lab.classList.add("wrong");
    });
  }

  function markUsedAndRebuild() {
    state.used[keyFor(current.cat, current.row)] = true;
    saveState(quizId, state);
    buildBoard();
  }

  function allUsed() {
    return Object.keys(state.used).length >= 25;
  }

  submitBtn.addEventListener("click", () => {
    if (!current) return;

    const selected = modal.querySelector('input[name="choice"]:checked');
    if (!selected) return;

    const selectedIndex = Number(selected.value);
    const correctIndex = current.clue.c;

    // prevent double-submit
    submitBtn.disabled = true;

    const isCorrect = selectedIndex === correctIndex;

    if (isCorrect) {
      state.score += current.value;
      modalFeedback.innerHTML = `✅ <strong>Richtig!</strong> +${current.value}`;
      statusEl.innerHTML = `✅ ${bank.categories[current.cat]} (${current.value}): richtig (+${current.value}).`;
    } else {
      state.score -= current.value;
      modalFeedback.innerHTML = `❌ <strong>Falsch.</strong> -${current.value} — richtig wäre: <strong>${current.clue.a[correctIndex]}</strong>`;
      statusEl.innerHTML = `❌ ${bank.categories[current.cat]} (${current.value}): falsch (-${current.value}). Richtige Antwort: <strong>${current.clue.a[correctIndex]}</strong>`;
    }

    lockModalChoices(correctIndex, selectedIndex);

    saveState(quizId, state);
    renderScore();

    // mark tile used and rebuild board
    markUsedAndRebuild();

    if (allUsed()) {
      statusEl.innerHTML = `🎉 <strong>Board fertig!</strong> Endscore: <strong>${state.score}</strong>.`;
    }
  });

  resetBtn.addEventListener("click", () => {
    resetState(quizId);
    state = { score: 0, used: {} };
    saveState(quizId, state);
    renderScore();
    buildBoard();
    statusEl.textContent = "Spiel zurückgesetzt.";
    current = null;
  });

  // Initial render
  renderScore();
  buildBoard();
  statusEl.textContent = "Wähle ein Feld, um zu starten.";
}

document.addEventListener("DOMContentLoaded", init);