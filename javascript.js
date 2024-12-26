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

        "J.K. Rowling.",
        "Johann Wolfgang von Goethe.",
        "1984.",
        "Jane Austen.",
        "Dante Alighieri.",

        "Frankreich",
        "Amazonas (oder Nil, je nach Definition)",
        "Nepal.",
        "Afrika",
        "Sahara",

        "Beatles",
        "Billie Eilish",
        "Oktave",
        "Miley Cyrus",
        "Lady Gaga",

        "Gucci",
        "Adidas",
        "Burberry",
        "Uniqlo",
        "Fenty Beauty",

        "360 Grad",
        "Primzahl",
        "20",
        "32",
        "1",

        "Gerste",
        "Mexiko",
        "15 % Vol",
        "Martini",
        "1516",

        "Paella",
        "Zucchini",
        "Safran",
        "Umami",
        "Pökeln",

        "Rund 89.000",
        "1972",
        "Etwa 700 Meter",
        "Zehn (Villingen, Schwenningen, Herzogenweiler , Marbach ,Obereschach, Pfaffenweiler, Rietheim, Tannheim, Weilersbach, Weigheim)",
        "13te",

        "John F. Kennedy.",
        "William Shakespeare",
        "Albert Einstein",
        "Julius Caesar",
        "Forrest Gump (aus dem Film).",

        "Giraffe",
        "Pinguin",
        "Fledermaus",
        "10",
        "Kolibri",
    ];

    alert("Hier ist die Lösung für Frage: " + "\n" + "\n" + answers[questionNumber - 1]);
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

function showwahroderfalsch() {
  window.location.href = "wahroderfalsch.html";
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
  { question: "Wie viele Sekunden hat ein Tag?", correctAnswer: 86400, txtAnswer: "86.400 Sekunden" },
  { question: "Wie viele Kilometer beträgt der Umfang der Erde?", correctAnswer: 40075, txtAnswer: "40.075 Kilometer" },
  { question: "Wie viele Sterne gibt es schätzungsweise in der Milchstraße? (In Milliarden)", correctAnswer: 100, txtAnswer: "Schätzungsweise 100 Milliarden Sterne" },
  { question: "Wie viele Jahre dauert es, bis ein Plastikstrohhalm vollständig abgebaut ist?", correctAnswer: 200, txtAnswer: "Etwa 200 Jahre" },
  { question: "Wie viele Meter ist der Mount Everest hoch?", correctAnswer: 8848, txtAnswer: "8.848 Meter" },
  { question: "Wie viele Stunden verbringt ein durchschnittlicher Mensch in seinem Leben mit Schlafen?", correctAnswer: 200000, txtAnswer: "Etwa 200.000 Stunden" },
  { question: "Wie viele Kilometer pro Stunde kann ein Gepard laufen?", correctAnswer: 120, txtAnswer: "Bis zu 120 km/h" },
  { question: "Wie viele Sprachen werden weltweit gesprochen?", correctAnswer: 7000, txtAnswer: "Etwa 7.000 Sprachen" },
  { question: "Wie viele Jahre alt ist das Universum schätzungsweise? (In Milliarden)", correctAnswer: 13.8, txtAnswer: "Schätzungsweise 13,8 Milliarden Jahre" },
  { question: "Wie viele Liter Milch produziert eine Kuh durchschnittlich pro Jahr?", correctAnswer: 8000, txtAnswer: "Etwa 8.000 Liter" },
  { question: "Wie viele Schritte macht ein Mensch durchschnittlich in seinem Leben? (In Milliarden)", correctAnswer: 150, txtAnswer: "Etwa 150 Milliarden Schritte" },
  { question: "Wie viele Kilometer beträgt die Entfernung zwischen Erde und Mond?", correctAnswer: 384400, txtAnswer: "Etwa 384.400 Kilometer" },
  { question: "Wie viele Stunden hat ein Jahr?", correctAnswer: 8760, txtAnswer: "8.760 Stunden" },
  { question: "Wie viele Zellen hat der menschliche Körper? (In Billionen)", correctAnswer: 37, txtAnswer: "Etwa 37 Billionen Zellen" },
  { question: "Wie viele Liter Wasser trinken Menschen weltweit pro Tag? (In Milliarden)", correctAnswer: 10, txtAnswer: "Schätzungsweise 10 Milliarden Liter" },
  { question: "Wie viele Kilometer beträgt die Länge des Amazonas?", correctAnswer: 6400, txtAnswer: "Etwa 6.400 Kilometer" },
  { question: "Wie viele Planeten gibt es in unserem Sonnensystem?", correctAnswer: 8, txtAnswer: "8 Planeten" },
  { question: "Wie viele Liter Blut hat ein durchschnittlicher Mensch?", correctAnswer: 5, txtAnswer: "Etwa 5 Liter" },
  { question: "Wie viele E-Mails werden weltweit täglich verschickt? (In Milliarden)", correctAnswer: 300, txtAnswer: "Etwa 300 Milliarden E-Mails" },
  { question: "Wie viele Bücher gibt es weltweit? (In Millionen)", correctAnswer: 130, txtAnswer: "Schätzungsweise 130 Millionen Bücher" },
  { question: "Wie viele Jahre alt wird eine Eintagsfliege?", correctAnswer: 1, txtAnswer: "Etwa 1 Tag" },
  { question: "Wie viele Bäume gibt es weltweit? (In Milliarden)", correctAnswer: 3000, txtAnswer: "Schätzungsweise 3 Billionen Bäume" },
  { question: "Wie viele Kilometer ist die Sonne von der Erde entfernt? (In Millionen)", correctAnswer: 149.6, txtAnswer: "Etwa 149,6 Millionen Kilometer" },
  { question: "Wie viele Menschen sterben durchschnittlich pro Tag weltweit?", correctAnswer: 150000, txtAnswer: "Etwa 150.000 Menschen" },
  { question: "Wie viele Blätter hat ein durchschnittlicher Baum?", correctAnswer: 200000, txtAnswer: "Etwa 200.000 Blätter" },
  { question: "Wie viele Löcher hat ein Golfplatz?", correctAnswer: 18, txtAnswer: "18 Löcher" },
  { question: "Wie viele verschiedene Arten von Käfern gibt es?", correctAnswer: 400000, txtAnswer: "Etwa 400.000 Arten" },
  { question: "Wie viele Jahre alt ist die älteste Schildkröte geworden?", correctAnswer: 190, txtAnswer: "Etwa 190 Jahre" },
  { question: "Wie viele Vulkane gibt es weltweit?", correctAnswer: 1500, txtAnswer: "Etwa 1.500 Vulkane" },
  { question: "Wie viele Flüge gibt es weltweit pro Tag?", correctAnswer: 100000, txtAnswer: "Etwa 100.000 Flüge" },
  { question: "Wie viele Arten von Bäumen gibt es weltweit?", correctAnswer: 60000, txtAnswer: "Etwa 60.000 Arten" },
  { question: "Wie viele Quadratkilometer umfasst die Sahara? (In Millionen)", correctAnswer: 9, txtAnswer: "Etwa 9 Millionen Quadratkilometer" },
  { question: "Wie viele Atome enthält ein Wassertropfen? (In Quadrillionen)", correctAnswer: 1.67, txtAnswer: "Etwa 1,67 Quadrillionen Atome" },
  { question: "Wie viele Menschen sprechen Englisch weltweit? (In Milliarden)", correctAnswer: 1.5, txtAnswer: "Etwa 1,5 Milliarden Menschen" },
  { question: "Wie viele Meter tief ist der Marianengraben?", correctAnswer: 11000, txtAnswer: "Etwa 11.000 Meter" },
  { question: "Wie viele Kilometer pro Stunde fliegt ein Düsenflugzeug?", correctAnswer: 900, txtAnswer: "Etwa 900 km/h" },
  { question: "Wie viele Spezies von Ameisen gibt es weltweit?", correctAnswer: 12000, txtAnswer: "Etwa 12.000 Spezies" },
  { question: "Wie viele Kilogramm wiegt ein ausgewachsener Elefant?", correctAnswer: 6000, txtAnswer: "Bis zu 6.000 Kilogramm" },
  { question: "Wie viele Stunden pro Woche arbeitet ein Vollzeitmitarbeiter durchschnittlich?", correctAnswer: 40, txtAnswer: "Etwa 40 Stunden" },
  { question: "Wie viele Erdbeben gibt es jährlich weltweit?", correctAnswer: 500000, txtAnswer: "Etwa 500.000 Erdbeben" },
  { question: "Wie viele Monde hat der Planet Saturn?", correctAnswer: 83, txtAnswer: "83 Monde" },
/*
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
  */
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