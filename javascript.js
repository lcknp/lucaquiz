function qs(sel){ return document.querySelector(sel); }

function baseValueForQuiz(quizId){
  // ungerade: 100..500, gerade: 200..1000
  return (quizId % 2 === 0) ? 200 : 100;
}
function valuesForQuiz(quizId){
  const base = baseValueForQuiz(quizId);
  return [1,2,3,4,5].map(n => n * base);
}

function storageKey(quizId){
  return `lucaquiz_jeopardy_q${quizId}_state_v2`;
}
function loadState(quizId){
  try{
    const raw = localStorage.getItem(storageKey(quizId));
    return raw ? JSON.parse(raw) : null;
  }catch{ return null; }
}
function saveState(quizId, state){
  localStorage.setItem(storageKey(quizId), JSON.stringify(state));
}
function resetState(quizId){
  localStorage.removeItem(storageKey(quizId));
}

/**
 * 5 Kategorien x 5 Fragen (wie Jeopardy Board)
 * clues[cat][row] (row 0..4 entspricht 1..5 * Base-Punkte)
 */
function getQuestionBank(quizId){
  // Du kannst pro quizId andere Kategorien/Fragen machen.
  // (Hier ein solider Standard-Satz)
  return {
    categories: ["ALLGEMEIN", "WISSENSCHAFT", "GEOGRAFIE", "GESCHICHTE", "KULTUR"],
    clues: [
      [
        { q:"Wie viele Minuten hat eine Stunde?", a:["50","55","60","65"], c:2 },
        { q:"Welche Farbe entsteht aus Blau + Gelb?", a:["GRÜN","ORANGE","LILA","GRAU"], c:0 },
        { q:"Wie viele Kontinente gibt es (klassisch)?", a:["5","6","7","8"], c:2 },
        { q:"Währung in Japan?", a:["YEN","YUAN","WON","RUPIE"], c:0 },
        { q:"Welcher Planet ist der Sonne am nächsten?", a:["MERKUR","VENUS","ERDE","MARS"], c:0 },
      ],
      [
        { q:"Formel für Wasser?", a:["CO2","H2O","O2","NaCl"], c:1 },
        { q:"Einheit für elektrische Spannung?", a:["VOLT","AMPERE","WATT","OHM"], c:0 },
        { q:"Prozess: Pflanzen nutzen Lichtenergie?", a:["FOTOSYNTHESE","GÄRUNG","OXIDATION","DESTILLATION"], c:0 },
        { q:"Negativ geladenes Teilchen?", a:["PROTON","NEUTRON","ELEKTRON","PHOTON"], c:2 },
        { q:"Häufigster Bestandteil der Luft?", a:["SAUERSTOFF","STICKSTOFF","CO2","HELIUM"], c:1 },
      ],
      [
        { q:"Hauptstadt an der Themse?", a:["LONDON","DUBLIN","CARDIFF","EDINBURGH"], c:0 },
        { q:"Hauptstadt von Australien?", a:["SYDNEY","MELBOURNE","CANBERRA","PERTH"], c:2 },
        { q:"Größtes Land (Fläche)?", a:["KANADA","USA","CHINA","RUSSLAND"], c:3 },
        { q:"Größte heiße Wüste?", a:["GOBI","SAHARA","ATACAMA","KALAHARI"], c:1 },
        { q:"Ozean zwischen Afrika & Australien?", a:["ATLANTIK","PAZIFIK","INDISCHER OZEAN","ARKTISCHER OZEAN"], c:2 },
      ],
      [
        { q:"Jahr des Mauerfalls?", a:["1987","1989","1991","1993"], c:1 },
        { q:"Erster Mensch auf dem Mond?", a:["NEIL ARMSTRONG","BUZZ ALDRIN","YURI GAGARIN","COLLINS"], c:0 },
        { q:"Epoche nach dem Mittelalter?", a:["RENAISSANCE","STEINZEIT","BRONZEZEIT","BAROCK"], c:0 },
        { q:"Vom Vesuv verschüttete Stadt (79 n. Chr.)?", a:["POMPEJI","ATHEN","SPARTA","KARTHAGO"], c:0 },
        { q:"Start der Französischen Revolution?", a:["1776","1789","1815","1848"], c:1 },
      ],
      [
        { q:"Autor von 'FAUST'?", a:["GOETHE","SCHILLER","KAFKA","BRECHT"], c:0 },
        { q:"Großes Museum in Paris?", a:["LOUVRE","PRADO","UFFIZIEN","TATE"], c:0 },
        { q:"Ein 'HAIKU' ist…", a:["KURZGEDICHT","TANZ","INSTRUMENT","MALTECHNIK"], c:0 },
        { q:"Violine gehört zu…", a:["BLAS","SCHLAG","STREICH","TASTEN"], c:2 },
        { q:"Griechische Mythologie-Figur?", a:["ODIN","THOR","HERKULES","ANUBIS"], c:2 },
      ],
    ],
  };
}

function init(){
  const root = document.querySelector(".game");
  if(!root) return;

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
  const closeModalBtn = qs("#closeModalBtn");

  // State: score + used tiles
  let state = loadState(quizId);
  if(!state){
    state = { score: 0, used: {} };
    saveState(quizId, state);
  }

  // aktuelle Auswahl
  let current = null;

  function keyFor(cat,row){ return `${cat}-${row}`; }
  function renderScore(){ scoreEl.textContent = `SCORE: ${state.score}`; }

  function buildBoard(){
    boardEl.innerHTML = "";
    boardEl.style.setProperty("--cols", String(bank.categories.length));

    // headers
    bank.categories.forEach(name=>{
      const h = document.createElement("div");
      h.className = "cat";
      h.textContent = name;
      boardEl.appendChild(h);
    });

    // 5 rows
    for(let row=0; row<5; row++){
      for(let cat=0; cat<bank.categories.length; cat++){
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "tile";
        btn.textContent = String(values[row]); // ohne $ (Punkte)

        const used = !!state.used[keyFor(cat,row)];
        if(used){
          btn.classList.add("used");
          btn.disabled = true;
        }

        btn.addEventListener("click", ()=>openQuestion(cat,row));
        boardEl.appendChild(btn);
      }
    }
  }

  function openQuestion(cat,row){
    const clue = bank.clues[cat][row];
    const value = values[row];

    current = {cat,row,value,clue};
    modalMeta.textContent = `${bank.categories[cat]} • ${value} PUNKTE`;
    modalQuestion.textContent = clue.q;

    modalAnswers.innerHTML = "";
    modalFeedback.textContent = "";
    submitBtn.disabled = true;

    clue.a.forEach((txt, idx)=>{
      const label = document.createElement("label");
      label.className = "choice";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "choice";
      input.value = String(idx);

      input.addEventListener("change", ()=>{ submitBtn.disabled = false; });

      const span = document.createElement("span");
      span.textContent = txt;

      label.appendChild(input);
      label.appendChild(span);
      modalAnswers.appendChild(label);
    });

    modal.showModal();
  }

  function lockChoices(correctIndex, selectedIndex){
    const labels = [...modalAnswers.querySelectorAll(".choice")];
    labels.forEach((lab, idx)=>{
      const input = lab.querySelector("input");
      input.disabled = true;

      if(idx === correctIndex) lab.classList.add("correct");
      if(idx === selectedIndex && selectedIndex !== correctIndex) lab.classList.add("wrong");
    });
  }

  function markUsed(){
    state.used[keyFor(current.cat, current.row)] = true;
    saveState(quizId, state);
    buildBoard();
  }

  function allUsed(){
    return Object.keys(state.used).length >= bank.categories.length * 5;
  }

  submitBtn.addEventListener("click", ()=>{
    if(!current) return;
    const selected = modal.querySelector('input[name="choice"]:checked');
    if(!selected) return;

    submitBtn.disabled = true;

    const selectedIndex = Number(selected.value);
    const correctIndex = current.clue.c;
    const ok = selectedIndex === correctIndex;

    if(ok){
      state.score += current.value;
      modalFeedback.innerHTML = `✅ <strong>RICHTIG!</strong> +${current.value}`;
      statusEl.innerHTML = `✅ ${bank.categories[current.cat]} ${current.value}: richtig (+${current.value}).`;
    }else{
      state.score -= current.value;
      modalFeedback.innerHTML = `❌ <strong>FALSCH.</strong> -${current.value} • Richtig: <strong>${current.clue.a[correctIndex]}</strong>`;
      statusEl.innerHTML = `❌ ${bank.categories[current.cat]} ${current.value}: falsch (-${current.value}). Richtig: <strong>${current.clue.a[correctIndex]}</strong>`;
    }

    lockChoices(correctIndex, selectedIndex);
    saveState(quizId, state);
    renderScore();
    markUsed();

    if(allUsed()){
      statusEl.innerHTML = `🎉 <strong>BOARD FERTIG!</strong> ENDSCORE: <strong>${state.score}</strong>`;
    }
  });

  closeModalBtn.addEventListener("click", ()=>{
    if(modal.open) modal.close();
  });

  resetBtn.addEventListener("click", ()=>{
    resetState(quizId);
    state = { score: 0, used: {} };
    saveState(quizId, state);
    renderScore();
    buildBoard();
    statusEl.textContent = "RESET: Neues Spiel gestartet.";
    current = null;
  });

  renderScore();
  buildBoard();
  statusEl.textContent = "Wähle ein Feld, um zu starten.";
}

document.addEventListener("DOMContentLoaded", init);