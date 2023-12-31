// Funktionen für Quiz Seiten

function toggleQuestion(questionNumber) {
    var question = document.getElementById('question' + questionNumber);
    question.classList.toggle('active');
}

function resetPointsDisplay() {
    var pointsDisplay = document.getElementById('pointsDisplay');
    pointsDisplay.style.display = 'flex';
}

function showSolution(questionNumber) {
    var solutionButton = document.getElementById('solutionButton' + questionNumber);
    var pointsButton = document.getElementById('pointsButton' + questionNumber);

    solutionButton.classList.add('used');
    pointsButton.classList.add('used');
    solutionButton.onclick = null;

    var answers = [
        "Emma Watson",
        "The Walking Dead",
        "Stranger Things",
        "Christopher Nolan",
        "Everything everywhere all at once",

        "schläft",
        "Nominativ, Genitiv, Dativ, Akkusativ",
        "Ä, Ö, Ü",
        "Visa",
        "Englisch",

        "Knoppers",
        "Mediamarkt",
        "Ferreo Küsschen",
        "Ritter Sport",
        "Hipp", 
        
        "Appel",
        "Microsoft",
        "Christian Louboutin",
        "4,48 Milliarden",
        "2005", 
        
        "Der Erste Weltkrieg",
        "Pharao Cheops (auch bekannt als Khufu)",
        "Leif Erikson",
        "Die Berliner Mauer wurde im Jahr 1961 errichtet",
        "Nelson Mandela",

        "Deutschland",
        "2006",
        "Basketball",
        "Peking",
        "Turkey", 

        "Frequently Ask Questions",
        "Carbon copy",
        "Informations Technologie",
        "Universal Serial Bus",
        "Tuvalu", 

        "Geld, Rot, Grün, Blau, Schwarz/Ereignisskarte",
        "1993",
        "hinter den Ohren",
        "Kupfer",
        "23.April 2006", 

        "Jupiter",
        "1969",
        "Saturn",
        "Supernova",
        "Andromedagalaxie",

        "2007",
        "eine maßeinheit für Datenmänge",
        "1.000.000MB",
        "Thomas Edison",
        "Haeckse",
    ];

    alert("Hier ist die Lösung für Frage " + questionNumber + ":\n\n" + answers[questionNumber - 1]);
}

// Funktionen für Menüanzeige
function toggleMenu() {
    var menu = document.getElementById('menu');
    var menuWidth = menu.offsetWidth;

    if (menu.style.left === '0px' || menu.style.left === '0') {
        menu.style.left = -menuWidth + 'px';
    } else {
        menu.style.left = '0px';
    }
}

function showHomePage() {
    window.location.href = 'index.html';
}

function showQuizPage(quizNumber) {
    window.location.href = "quiz" + quizNumber + ".html";
}

function showSchätzfragen() {
    window.location.href = "schätzfragen.html";
}

function showImpressum() {
    window.location.href = 'impressum.html';
}

// Funktionen für Schätzfragen

const questionsAndAnswers = [
  { question: "", correctAnswer: "", txtAnswer: "" },
  { question: "Wie viele Kilogramm wiegt der Eiffelturm? (In Tonnen)", correctAnswer: 10.100, txtAnswer: "10.100 Tonnen" },
  { question: "Wie viele Liter Wasser passen in einen olympischen Swimmingpool? (In Mio)", correctAnswer: 2.5, txtAnswer: "2,5 Mio L" },
  { question: "Wie viele Zähne hat ein erwachsener Mensch normalerweise?", correctAnswer: 32, txtAnswer: "32 Zähne" },
  { question: "Wie viele Zeichen umfässt der Längste Buchtitel?", correctAnswer: 264, txtAnswer: "264 Zeichen, Entwicklung von außergewöhnlich aktiven, kooperativen Aluminium−Fluorid-basierten Lewis-Säure/Oniumsalz-Katalysatoren für die asymmetrische Carboxycyanierung von Aldehyden und Untersuchungen zu ihrer Anwendbarkeit in verwandten enantioselektiven Transformationen" },
  { question: "Wie viele Länder gibt es in Europa?", correctAnswer: 44, txtAnswer: "44 Länder" },
  { question: "Wie viele Smartphones gibt es schätzungsweise weltweit im Jahr 2023?", correctAnswer: 3000000, txtAnswer: "Schätzungsweise 3 Mio." },
  { question: "Wie viele Wörter gibt es schätzungsweise in der englischen Sprache?", correctAnswer: 170000, txtAnswer: "Die Antwort kann variieren, aber eine Schätzung könnte etwa 170.000 Wörter sein" },
  { question: "Wie viele Menschen leben schätzungsweise auf der Erde im Jahr 2023? (In Milliarden)", correctAnswer: 7.9, txtAnswer: "Eine Schätzung könnte etwa 7,9 Milliarden Menschen sein" },
  { question: "Wie viele Buchstaben hat das längste Wort in der deutschen Sprache?", correctAnswer: 79, txtAnswer: "Donaudampfschifffahrtselektrizitätenhauptbetriebswerkbauunterbeamtengesellschaft" },
  { question: "Wie viele Knochen hat der menschliche Körper?", correctAnswer: 206, txtAnswer: "206 Knochen" },
];

let currentQuestion = 0; // Fragezähler

function addTeam() {
  const teamName = document.getElementById("teamName").value;
  if (!teamName) {
    alert("Bitte geben Sie einen Namen für das Team/Spieler ein.");
    return;
  }

  const teamsContainer = document.getElementById("teamsContainer");
  const teamCount = document.getElementsByClassName("team").length + 1;

  const teamDiv = document.createElement("div");
  teamDiv.className = "team";
  teamDiv.id = `team${teamCount}`;
  teamDiv.innerHTML = `
    <label for="points${teamCount}">${teamName}:</label>
    <input class="pointsinput" type="number" id="points${teamCount}" min="0" value="0">
    <br>
    <button class="add" type="button" onclick="changePoints(${teamCount}, 100)">+100</button>
    <button class="add" type="button" onclick="changePoints(${teamCount}, -100)">-100</button>
    <br>
  `;

  teamsContainer.appendChild(teamDiv);
}

function changePoints(teamCount, amount) {
  const pointsInput = document.getElementById(`points${teamCount}`);
  let currentValue = parseInt(pointsInput.value);
  currentValue += amount;
  pointsInput.value = Math.max(currentValue, 0);
}

function showResult() {
  const currentQuestionData = questionsAndAnswers[currentQuestion];
  const correctAnswer = currentQuestionData.correctAnswer;
  const txtAnswerdata = currentQuestionData.txtAnswer; // Korrekte Frage-Text-Antwort
  
  const teamElements = document.getElementsByClassName("team");
  const teams = [];

  for (let i = 0; i < teamElements.length; i++) {
    const teamName = teamElements[i].querySelector(`label`).textContent.replace(":", "");
    const points = parseInt(teamElements[i].querySelector(`input[id^=points]`).value);
    teams.push({ teamName, points });
  }

  let closestTeamIndex = 0;
  let closestDifference = Math.abs(teams[0].points - correctAnswer);

  for (let i = 1; i < teams.length; i++) {
    const difference = Math.abs(teams[i].points - correctAnswer);
    if (difference < closestDifference) {
      closestDifference = difference;
      closestTeamIndex = i;
    }
  }

  const winner = teams[closestTeamIndex].teamName;
  const pointsDifference = Math.abs(teams[closestTeamIndex].points - correctAnswer);

  alert(`${winner} ist der Gewinner! ${txtAnswerdata}`);

  currentQuestion++;

  if (currentQuestion < questionsAndAnswers.length) {
    document.getElementById("question").innerText = questionsAndAnswers[currentQuestion].question;
  } else {
    alert("Alle Fragen wurden beantwortet.");
  }
}
