// LucaQuiz – Jeopardy Board (5 Kategorien x 5 Punkte)
// Ungerade Quiz-ID: 100/200/300/400/500
// Gerade Quiz-ID:   200/400/600/800/1000
// Team-Modus: Team A / Team B (umschaltbar), Punkte pro Team
// Richtig: + Punkte, Falsch: - Punkte, Feld danach gesperrt
// State pro Quiz in localStorage

function qs(sel) { return document.querySelector(sel); }

function baseValueForQuiz(quizId) {
  return (quizId % 2 === 0) ? 200 : 100;
}
function valuesForQuiz(quizId) {
  const base = baseValueForQuiz(quizId);
  return [1, 2, 3, 4, 5].map(n => n * base);
}

function storageKey(quizId) {
  return `lucaquiz_jeopardy_q${quizId}_state_v8_team_harder`;
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
 * Fragebank: pro Quiz 5 Kategorien × 5 Fragen.
 * Reihen werden nach unten schwerer – aber auch die 1./2. Reihe ist nicht mehr "zu leicht".
 */
function getQuestionBank(quizId) {
  switch (quizId) {

    // ==================================
    // QUIZ 1 — ALLGEMEINWISSEN (harder)
    // ==================================
    case 1:
      return {
        categories: ["ALLGEMEIN", "WISSENSCHAFT", "GEOGRAFIE", "GESCHICHTE", "KULTUR"],
        clues: [
          // ALLGEMEIN
          [
            { q: "WIE VIEL IST 7²?", a: ["14", "28", "49", "56"], c: 2 },
            { q: "WIE VIELE SEKUNDEN HAT EINE STUNDE?", a: ["360", "3600", "36 000", "6000"], c: 1 },
            { q: "WELCHE ZAHL IST AM GRÖSSTEN?", a: ["0,62", "5/8", "0,7", "2/3"], c: 2 }, // 0.7
            { q: "WELCHER WERT IST GLEICH WIE 0,125?", a: ["1/4", "1/8", "1/16", "1/12"], c: 1 },
            { q: "WELCHE IST DIE KLEINSTE PRIMZAHL > 100?", a: ["101", "103", "107", "109"], c: 0 },
          ],
          // WISSENSCHAFT
          [
            { q: "WELCHES GAS IST IN DER LUFT AM HÄUFIGSTEN?", a: ["SAUERSTOFF", "STICKSTOFF", "CO2", "ARGON"], c: 1 },
            { q: "WELCHE EINHEIT MISST ELEKTRISCHE LEISTUNG?", a: ["VOLT", "WATT", "AMPERE", "OHM"], c: 1 },
            { q: "WELCHER BEGRIFF PASST ZU 'ERBGUT'?", a: ["DNA", "ATP", "H2O", "NaCl"], c: 0 },
            { q: "WELCHER TEIL DES AUGES REGELT DEN LICHTEINLASS?", a: ["LINSE", "NETZHAUT", "IRIS", "SEHNERV"], c: 2 },
            { q: "WAS BESCHREIBT 'DICHTE' AM BESTEN?", a: ["MASSE PRO VOLUMEN", "VOLUMEN PRO ZEIT", "KRAFT PRO FLÄCHE", "ENERGIE PRO STROM"], c: 0 },
          ],
          // GEOGRAFIE
          [
            { q: "WELCHER FLUSS FLIESST DURCH WIEN?", a: ["RHEIN", "DONAU", "ELBE", "ODER"], c: 1 },
            { q: "WELCHES LAND HAT DIE HAUPTSTADT 'LISSABON'?", a: ["SPANIEN", "PORTUGAL", "ITALIEN", "GRIECHENLAND"], c: 1 },
            { q: "WELCHES MEER GRENZT AN POLEN?", a: ["NORDSEE", "OSTSEE", "MITTELMEER", "SCHWARZES MEER"], c: 1 },
            { q: "WELCHER KONTINENT HAT DIE MEISTEN LÄNDER?", a: ["EUROPA", "AFRIKA", "ASIEN", "SÜDAMERIKA"], c: 1 },
            { q: "WELCHE STADT LIEGT AM BOSPORUS?", a: ["ISTANBUL", "ATHEN", "ROM", "SOFIA"], c: 0 },
          ],
          // GESCHICHTE
          [
            { q: "WANN FIEL DIE BERLINER MAUER (JAHR)?", a: ["1987", "1989", "1991", "1993"], c: 1 },
            { q: "WELCHER ENTDECKER WIRD OFT MIT 1492 VERBUNDEN?", a: ["MAGELLAN", "KOLUMBUS", "COOK", "POLO"], c: 1 },
            { q: "WAS WAR DIE 'INDUSTRIELLE REVOLUTION' PRIMÄR?", a: ["LANDWIRTSCHAFTLICHE REFORM", "ÜBERGANG ZU MASCHINEN/INDUSTRIE", "RELIGIONSKRIEG", "EU-GRÜNDUNG"], c: 1 },
            { q: "WELCHES EREIGNIS GILT ALS DIREKTER ANLASS 1914?", a: ["BÖRSENCRASH", "ATTENTAT VON SARAJEVO", "MAUERFALL", "MONDLANDUNG"], c: 1 },
            { q: "WIE HIESS DAS SCHIFF DER PILGERVÄTER (1620) BERÜHMT?", a: ["SANTA MARIA", "MAYFLOWER", "ENDEAVOUR", "TITANIC"], c: 1 },
          ],
          // KULTUR
          [
            { q: "WER MALTE DIE 'MONA LISA'?", a: ["PICASSO", "DA VINCI", "VAN GOGH", "MONET"], c: 1 },
            { q: "WELCHER BEGRIFF PASST ZU EINEM 'BÜHNENSTÜCK MIT GESANG'?", a: ["OPER", "ESSAY", "REPORTAGE", "KOMMENTAR"], c: 0 },
            { q: "WELCHER AUTOR SCHRIEB 'FAUST'?", a: ["GOETHE", "SCHILLER", "KAFKA", "BRECHT"], c: 0 },
            { q: "WELCHER KOMPONIST IST FÜR 'FÜR ELISE' BEKANNT?", a: ["BACH", "MOZART", "BEETHOVEN", "VIVALDI"], c: 2 },
            { q: "WELCHES IST EIN LITERARISCHES 'EPOS' (BEKANNT)?", a: ["ODYSSEE", "FAUST", "DIE ZEIT", "DAS GRUNDGESETZ"], c: 0 },
          ],
        ],
      };

    // ==================================
    // QUIZ 2 — SPORT & TECH (harder)
    // ==================================
    case 2:
      return {
        categories: ["SPORT", "TECHNIK", "NETZ", "LOGIK", "MIX"],
        clues: [
          // SPORT
          [
            { q: "WIE VIELE PUNKTE ZÄHLT EIN TOUCHDOWN (OHNE EXTRA) IM AMERICAN FOOTBALL?", a: ["3", "6", "7", "10"], c: 1 },
            { q: "WIE HEISST DAS TURNIER 'WIMBLEDON' (SPORT)?", a: ["GOLF", "TENNIS", "RUGBY", "HOCKEY"], c: 1 },
            { q: "WIE VIELE SÄTZE BRAUCHT MAN IM TENNIS 'BEST OF 5' ZUM SIEG?", a: ["2", "3", "4", "5"], c: 1 },
            { q: "WELCHER SPORT HAT EINE 'ABSEITS'-REGEL?", a: ["BASKETBALL", "FUSSBALL", "TENNIS", "GOLF"], c: 1 },
            { q: "WIE VIELE SPIELER STEHEN BEIM HANDBALL PRO TEAM AUF DEM FELD?", a: ["5", "6", "7", "11"], c: 2 },
          ],
          // TECHNIK
          [
            { q: "WOFÜR STEHT 'CPU'?", a: ["CENTRAL PROCESSING UNIT", "COMPUTER POWER UPDATE", "CONTROL PROGRAM UNIT", "CORE PRINT UTILITY"], c: 0 },
            { q: "WELCHE EINHEIT MISST SPANNUNG?", a: ["WATT", "AMPERE", "VOLT", "OHM"], c: 2 },
            { q: "WAS IST DER UNTERSCHIED RAM vs. SSD AM BESTEN?", a: ["RAM DAUERHAFT", "RAM FLÜCHTIG/ARBEITSSPEICHER", "SSD FLÜCHTIG", "KEIN UNTERSCHIED"], c: 1 },
            { q: "WELCHES IST EINE DATEIENDUNG FÜR EIN BILD?", a: [".mp3", ".jpg", ".exe", ".zip"], c: 1 },
            { q: "WAS IST 'BLUETOOTH' AM EHesten?", a: ["DRUCKERSPRACHE", "FUNKVERBINDUNG KURZSTRECKE", "STROMSTECKER", "INTERNETPROTOKOLL"], c: 1 },
          ],
          // NETZ
          [
            { q: "WELCHER PORT GEHÖRT TYPISCH ZU HTTPS?", a: ["21", "80", "443", "25"], c: 2 },
            { q: "WAS MACHT DNS?", a: ["VERSCHLÜSSELN", "NAMEN IN IP AUFLÖSEN", "DATEIEN LÖSCHEN", "WLAN STÄRKEN"], c: 1 },
            { q: "WELCHES IST EIN WEBBROWSER?", a: ["CHROME", "EXCEL", "POWERPOINT", "SPOTIFY"], c: 0 },
            { q: "WAS IST 'PHISHING'?", a: ["UPDATE", "BETRUG ÜBER FAKE-NACHRICHTEN", "BACKUP", "VIRUS-SCANNER"], c: 1 },
            { q: "WAS BEDEUTET 2FA?", a: ["2 FIREWALLS", "ZWEI-FAKTOR-ANMELDUNG", "2 BACKUPS", "2 PASSWÖRTER IMMER"], c: 1 },
          ],
          // LOGIK
          [
            { q: "WENN A WAHR IST UND B FALSCH: A UND B IST…", a: ["WAHR", "FALSCH", "BEIDES", "UNBEKANNT"], c: 1 },
            { q: "WENN A FALSCH IST UND B WAHR: A ODER B IST…", a: ["WAHR", "FALSCH", "UNBEKANNT", "BEIDES"], c: 0 },
            { q: "WELCHE ZAHL FEHLT: 3, 6, 12, 24, …", a: ["30", "36", "42", "48"], c: 3 },
            { q: "WENN P→Q UND Q IST FALSCH, WAS FOLGT ÜBER P?", a: ["P IST WAHR", "P IST FALSCH", "P UNBEKANNT", "Q WAHR"], c: 1 },
            { q: "WELCHES IST EIN ANAGRAMM VON 'LISTEN'?", a: ["SILENT", "TINSEL", "BEIDE", "KEINS"], c: 2 },
          ],
          // MIX
          [
            { q: "WELCHES LAND HAT 'CANBERRA' ALS HAUPTSTADT?", a: ["KANADA", "AUSTRALIEN", "NEUSEELAND", "IRLAND"], c: 1 },
            { q: "WELCHER PLANET IST DER SONNE AM NÄCHSTEN?", a: ["VENUS", "ERDE", "MERKUR", "MARS"], c: 2 },
            { q: "WELCHES MEER LIEGT ZWISCHEN ITALIEN UND KROATIEN?", a: ["ADRIA", "OSTSEE", "NORDSEE", "IRISCHE SEE"], c: 0 },
            { q: "WELCHE ZAHL IST DURCH 9 TEILBAR?", a: ["54", "56", "58", "60"], c: 0 },
            { q: "WELCHER BEGRIFF PASST ZU 'WENN…DANN…' IN DER LOGIK?", a: ["UND", "ODER", "IMPLIKATION", "NEGATION"], c: 2 },
          ],
        ],
      };

    // ==================================
    // QUIZ 3 — NATUR & ERDE (harder)
    // ==================================
    case 3:
      return {
        categories: ["TIERWELT", "PFLANZEN", "ERDE", "CHEMIE", "WELTALL"],
        clues: [
          // TIERWELT
          [
            { q: "WELCHES TIER IST EIN SÄUGETIER?", a: ["FROSCH", "PENGUIN", "DELFIN", "EIDECHSE"], c: 2 },
            { q: "WELCHES TIER HAT EIN EXOSKELETT (TYPISCH)?", a: ["HUND", "KÄFER", "WAL", "EULE"], c: 1 },
            { q: "WELCHES TIER IST EIN REPTIL?", a: ["SCHLANGE", "WAL", "SPERLING", "BIENE"], c: 0 },
            { q: "WELCHES TIER IST BEKANNT FÜR ECHOORTUNG?", a: ["KATZE", "FLEDERMAUS", "HASE", "SCHAF"], c: 1 },
            { q: "WELCHES TIER IST EIN 'WIEDERKÄUER'?", a: ["PFERD", "KUH", "SCHWEIN", "HUND"], c: 1 },
          ],
          // PFLANZEN
          [
            { q: "WELCHER TEIL DER PFLANZE NIMMT WASSER AUF?", a: ["BLÜTE", "WURZEL", "BLATT", "FRUCHT"], c: 1 },
            { q: "WELCHES GAS ENTSTEHT BEI DER FOTOSYNTHESE?", a: ["CO2", "O2", "N2", "H2"], c: 1 },
            { q: "WELCHES IST EIN NADELBAUM?", a: ["BIRKE", "FICHTE", "APFELBAUM", "BUCHE"], c: 1 },
            { q: "WELCHE PFLANZE IST EINE HÜLSENFRUCHT?", a: ["ERBSE", "WEIZEN", "APFEL", "GURKE"], c: 0 },
            { q: "WELCHER TEIL TRANSPORTIERT WASSER IN PFLANZEN NACH OBEN (LEITGEWEBE)?", a: ["XYLEM", "PHLOEM", "CHLOROPHYLL", "NEKTAR"], c: 0 },
          ],
          // ERDE
          [
            { q: "WELCHE SCHICHT IST ÄUSSERSTE DER ERDE?", a: ["KERN", "MANTEL", "KRUSTE", "MAGMASEE"], c: 2 },
            { q: "WAS VERURSACHT GEZEITEN HAUPTSÄCHLICH?", a: ["WIND", "MONDGRAVITATION", "VULKANE", "MAGNETFELD"], c: 1 },
            { q: "WAS BEDEUTET 'EROSION'?", a: ["AUFBAU", "ABTRAGUNG DURCH WIND/WASSER", "VERDAMPFUNG", "VEREISUNG"], c: 1 },
            { q: "WIE HEISST DER PROZESS, BEI DEM ERDPLATTEN SICH BEWEGEN?", a: ["PLATTENTEKTONIK", "GÄRUNG", "DIFFUSION", "FOTOSYNTHESE"], c: 0 },
            { q: "WELCHER VULKAN LIEGT IN ITALIEN (BEKANNT)?", a: ["VESUV", "FUJI", "MAUNA LOA", "KILIMANDSCHARO"], c: 0 },
          ],
          // CHEMIE
          [
            { q: "WAS IST KOCHSALZ CHEMISCH?", a: ["NaCl", "H2O", "CO2", "O2"], c: 0 },
            { q: "WAS IST DER PH-WERT VON 'NEUTRAL'?", a: ["0", "7", "10", "14"], c: 1 },
            { q: "WELCHE REAKTION IST 'ROSTEN'?", a: ["OXIDATION", "DESTILLATION", "FILTRATION", "SUBLIMATION"], c: 0 },
            { q: "WELCHER STOFF IST TYPISCH SAUER (ZITRONE)?", a: ["AMMONIAK", "ZITRONENSÄURE", "SALZ", "NATRIUMHYDROXID"], c: 1 },
            { q: "WELCHES ELEMENT HAT DAS SYMBOL 'Fe'?", a: ["FLUOR", "EISEN", "FETT", "FERMIUM"], c: 1 },
          ],
          // WELTALL
          [
            { q: "WIE HEISST UNSERE GALAXIE?", a: ["ANDROMEDA", "MILCHSTRASSE", "ORION", "PEGASUS"], c: 1 },
            { q: "WAS IST EIN 'LICHTJAHR'?", a: ["ZEIT", "ENTFERNUNG", "MASSE", "HELLIGKEIT"], c: 1 },
            { q: "WELCHER PLANET HAT RINGE (BEKANNT)?", a: ["MARS", "SATURN", "MERKUR", "VENUS"], c: 1 },
            { q: "WELCHER PLANET IST DER SONNE AM NÄCHSTEN?", a: ["MERKUR", "VENUS", "ERDE", "MARS"], c: 0 },
            { q: "WAS IST EIN 'ASTEROID' AM EHesten?", a: ["Stern", "Kleiner Gesteinsbrocken im All", "Galaxie", "Nebel"], c: 1 },
          ],
        ],
      };

    // ==================================
    // QUIZ 4 — EUROPA & DEUTSCHLAND (harder)
    // ==================================
    case 4:
      return {
        categories: ["DEUTSCHLAND", "EUROPA", "HAUPTSTÄDTE", "SPRACHE", "KULTUR"],
        clues: [
          // DEUTSCHLAND
          [
            { q: "WELCHER FLUSS FLIESST DURCH DRESDEN?", a: ["ELBE", "RHEIN", "DONAU", "MAIN"], c: 0 },
            { q: "WELCHE STADT IST KLASsISCH DIE 'MAIN-METROPOLE'?", a: ["FRANKFURT AM MAIN", "KÖLN", "LEIPZIG", "BREMEN"], c: 0 },
            { q: "WELCHES IST EIN BUNDESLAND?", a: ["BAYERN", "KATALONIEN", "TEXAS", "QUEBEC"], c: 0 },
            { q: "WELCHES MEER GRENZT AN SCHLESWIG-HOLSTEIN?", a: ["MITTELMEER", "OSTSEE UND NORDSEE", "SCHWARZES MEER", "KARIBIK"], c: 1 },
            { q: "PASSAU IST 'DREI-FLÜSSE-STADT'. EIN FLUSS DAVON IST…", a: ["DONAU", "PO", "SEINE", "THEMSE"], c: 0 },
          ],
          // EUROPA
          [
            { q: "WELCHES GEBIRGE TRENNT SPANIEN UND FRANKREICH?", a: ["ALPEN", "PYRENÄEN", "KARPATEN", "URAL"], c: 1 },
            { q: "WELCHES LAND HAT DEN EURO?", a: ["NORWEGEN", "SPANIEN", "SCHWEIZ", "UK"], c: 1 },
            { q: "WELCHES MEER LIEGT ZWISCHEN ITALIEN UND KROATIEN?", a: ["ADRIA", "NORDSEE", "OSTSEE", "IRISCHE SEE"], c: 0 },
            { q: "WELCHES LAND HAT AMSTERDAM ALS HAUPTSTADT, ABER DEN HAAG ALS REGIERUNGSSITZ?", a: ["NIEDERLANDE", "ITALIEN", "PORTUGAL", "DÄNEMARK"], c: 0 },
            { q: "WELCHES LAND LIEGT NICHT IN EUROPA?", a: ["POLEN", "ARGENTINIEN", "ITALIEN", "NORWEGEN"], c: 1 },
          ],
          // HAUPTSTÄDTE
          [
            { q: "HAUPTSTADT VON KANADA?", a: ["TORONTO", "OTTAWA", "MONTREAL", "VANCOUVER"], c: 1 },
            { q: "HAUPTSTADT VON SCHWEDEN?", a: ["OSLO", "STOCKHOLM", "HELSINKI", "KOPENHAGEN"], c: 1 },
            { q: "HAUPTSTADT VON TSCHECHIEN?", a: ["PRAG", "BRÜNN", "OSTRAVA", "PILSEN"], c: 0 },
            { q: "HAUPTSTADT VON PORTUGAL?", a: ["PORTO", "LISSABON", "BRAGA", "FARO"], c: 1 },
            { q: "HAUPTSTADT VON UNGARN?", a: ["BUKAREST", "BUDAPEST", "SOFIA", "BELGRAD"], c: 1 },
          ],
          // SPRACHE
          [
            { q: "WELCHES WORT IST EIN VERB?", a: ["SCHÖN", "LAUFEN", "BLAU", "STUHL"], c: 1 },
            { q: "WELCHE WORTART IST 'SCHNELL' IN: 'ER LÄUFT SCHNELL'?", a: ["SUBSTANTIV", "ADVERBIAL (ADJEKTIVISCH)", "VERB", "ARTIKEL"], c: 1 },
            { q: "WAS BEDEUTET 'ETYMOLOGIE'?", a: ["WORT-HERKUNFT", "ZEITRECHNUNG", "SATZBAU", "SPRACHFEHLER"], c: 0 },
            { q: "WELCHES IST EIN PALINDROM?", a: ["LAGER", "RELIEF", "ANNA", "KATZE"], c: 2 },
            { q: "WELCHER BEGRIFF PASST ZU: 'WÖRTER MIT GLEICHER BEDEUTUNG'?", a: ["ANTONYM", "SYNONYM", "HOMONYM", "AKRONYM"], c: 1 },
          ],
          // KULTUR
          [
            { q: "WER KOMPONIERTE 'EINE KLEINE NACHTMUSIK'?", a: ["BACH", "MOZART", "BEETHOVEN", "CHOPIN"], c: 1 },
            { q: "WELCHER AUTOR SCHRIEB 'DIE VERWANDLUNG'?", a: ["KAFKA", "GOETHE", "HEINE", "MANN"], c: 0 },
            { q: "WELCHER FILMPREIS IST US-FILM (SEHR BEKANNT)?", a: ["OSCAR", "NOBELPREIS", "GRAMMY", "TOUR DE FRANCE"], c: 0 },
            { q: "WELCHER MALER WIRD MIT 'GUERNICA' VERBUNDEN?", a: ["PICASSO", "MONET", "VAN GOGH", "REMBRANDT"], c: 0 },
            { q: "WELCHES IST EINE DRAMENFORM (THEATER) MIT TRAGISCHEM ENDE?", a: ["KOMÖDIE", "TRAGÖDIE", "FABEL", "SATIRE"], c: 1 },
          ],
        ],
      };

    // ==================================
    // QUIZ 5 — MATHE & LOGIK (harder)
    // ==================================
    case 5:
      return {
        categories: ["KOPFRECHNEN", "BRÜCHE", "GEOMETRIE", "LOGIK", "MUSTER"],
        clues: [
          // KOPFRECHNEN
          [
            { q: "WIE VIEL IST 27 + 48?", a: ["65", "75", "85", "95"], c: 1 },
            { q: "WIE VIEL IST 14 × 9?", a: ["116", "126", "136", "146"], c: 1 },
            { q: "WIE VIEL IST 360 ÷ 12?", a: ["20", "25", "30", "35"], c: 2 },
            { q: "WIE VIEL IST 18% VON 150?", a: ["18", "24", "27", "30"], c: 2 },
            { q: "WIE VIEL IST 19 × 17?", a: ["289", "303", "323", "361"], c: 2 }, // 323
          ],
          // BRÜCHE
          [
            { q: "WELCHER BRUCH IST AM GRÖSSTEN?", a: ["5/8", "2/3", "3/5", "7/12"], c: 1 }, // 0.666...
            { q: "WAS IST 0,2 ALS BRUCH?", a: ["1/2", "1/3", "1/5", "1/8"], c: 2 },
            { q: "WAS IST 5/6 VON 24?", a: ["18", "20", "22", "24"], c: 1 }, // 20
            { q: "1/4 + 3/8 = ?", a: ["5/8", "1/2", "3/4", "7/8"], c: 0 },
            { q: "WAS IST 0,375 ALS BRUCH (GEKÜRZT)?", a: ["3/8", "5/16", "7/20", "6/25"], c: 0 }, // 0.375
          ],
          // GEOMETRIE
          [
            { q: "INNENWINKELSUMME IM VIERSEIT (QUADRILATERAL)?", a: ["180°", "270°", "360°", "450°"], c: 2 },
            { q: "UMFANG EINES KREISES: WELCHER TERM PASST?", a: ["πr²", "2πr", "r/2π", "π/2r"], c: 1 },
            { q: "FLÄCHE DREIECK (GRUND 10, HÖHE 6)?", a: ["20", "30", "40", "60"], c: 1 }, // 30
            { q: "WIE VIELE DIAGONALEN HAT EIN SIEBENECK?", a: ["7", "14", "21", "28"], c: 1 }, // n(n-3)/2 = 7*4/2=14
            { q: "PYTHAGORAS: KATHETEN 6 UND 8 → HYPOTENUSE?", a: ["10", "12", "14", "16"], c: 0 },
          ],
          // LOGIK
          [
            { q: "WENN A WAHR UND B WAHR: A ODER B IST…", a: ["WAHR", "FALSCH", "UNBEKANNT", "BEIDES"], c: 0 },
            { q: "WENN A WAHR UND B FALSCH: A ↔ B (ÄQUIVALENZ) IST…", a: ["WAHR", "FALSCH", "UNBEKANNT", "BEIDES"], c: 1 },
            { q: "WAS IST DIE NEGATION VON: 'ALLE SIND PÜNKTLICH'?", a: ["NIEMAND IST PÜNKTLICH", "MINDESTENS EINER IST NICHT PÜNKTLICH", "ALLE SIND UNPÜNKTLICH", "EINER IST PÜNKTLICH"], c: 1 },
            { q: "WELCHER SCHLUSS IST GÜLTIG? P→Q, NICHT Q, ALSO…", a: ["P", "NICHT P", "Q", "NICHT Q"], c: 1 },
            { q: "WELCHE ZAHL FEHLT: 2, 3, 5, 8, 13, …", a: ["18", "20", "21", "22"], c: 2 }, // 21
          ],
          // MUSTER
          [
            { q: "WELCHE ZAHL FEHLT: 100, 90, 81, 73, …", a: ["66", "65", "64", "63"], c: 0 }, // -10,-9,-8 => 73-7=66
            { q: "WELCHE ZAHL FEHLT: 1, 4, 9, 16, …", a: ["20", "24", "25", "36"], c: 2 }, // Quadratzahlen
            { q: "WELCHER AUSDRUCK PASST: 3·(x+2) = ?", a: ["3x+2", "3x+6", "x+6", "x+2"], c: 1 },
            { q: "WELCHE ZAHL FEHLT: 5, 11, 23, 47, …", a: ["71", "85", "95", "99"], c: 1 }, // *2+1 => 95
            { q: "WELCHE ZAHL FEHLT: 2, 6, 12, 20, …", a: ["24", "28", "30", "32"], c: 1 }, // n(n+1): 2,6,12,20,30
          ],
        ],
      };

    // ==================================
    // QUIZ 6 — KINO, MUSIK, WELT (harder)
    // ==================================
    case 6:
      return {
        categories: ["KINO", "MUSIK", "REKORDE", "WELT", "SPRACHE"],
        clues: [
          // KINO
          [
            { q: "WIE HEISST DER FACHBEGRIFF FÜR FILM-VORSCHAU?", a: ["TRAILER", "SCORE", "CUT", "SCRIPT"], c: 0 },
            { q: "WAS MACHT EIN 'KAMERAMANN' (AM BESTEN)?", a: ["SCHNITT", "BILD/AUFNAHME", "TONMISCHUNG", "KOSTÜM"], c: 1 },
            { q: "WAS IST EIN 'SEQUEL'?", a: ["FORTSETZUNG", "VORSCHAU", "NEBENROLLE", "DREHBUCH"], c: 0 },
            { q: "WAS IST EIN 'CAMEO'?", a: ["KURZER GASTAUFTRITT", "SPECIAL EFFECT", "DREHBUCHVERSION", "SOUNDTRACK"], c: 0 },
            { q: "WELCHER PREIS IST VOR ALLEM FÜR FILME BERÜHMT?", a: ["OSCAR", "GRAMMY", "BALLON D’OR", "NOBELPREIS"], c: 0 },
          ],
          // MUSIK
          [
            { q: "WAS BEDEUTET 'TEMPO' IN DER MUSIK?", a: ["LAUTSTÄRKE", "GESCHWINDIGKEIT", "TONHÖHE", "INSTRUMENT"], c: 1 },
            { q: "WELCHES INSTRUMENT HAT TASTEN UND SAITEN (MECHANISCH)?", a: ["KLAVIER", "TROMPETE", "FLÖTE", "DRUMS"], c: 0 },
            { q: "WAS IST EIN 'DUETT'?", a: ["ZWEI MUSIKER", "DREI MUSIKER", "EIN SOLO", "EIN CHOR"], c: 0 },
            { q: "WELCHER BEGRIFF PASST ZU: 'NOTENBILD MIT 5 LINIEN'?", a: ["TABULATUR", "NOTENSYSTEM", "REFRAIN", "TAKTART"], c: 1 },
            { q: "WER KOMPONIERTE 'FÜR ELISE'?", a: ["MOZART", "BEETHOVEN", "BACH", "VIVALDI"], c: 1 },
          ],
          // REKORDE
          [
            { q: "WELCHER OZEAN IST DER GRÖSSTE?", a: ["ATLANTIK", "PAZIFIK", "INDISCHER", "ARKTISCHER"], c: 1 },
            { q: "WELCHES LAND IST FLÄCHENMÄSSIG AM GRÖSSTEN?", a: ["KANADA", "USA", "CHINA", "RUSSLAND"], c: 3 },
            { q: "WELCHER IST DER HÖCHSTE BERG DER ERDE?", a: ["K2", "EVEREST", "MONT BLANC", "KILIMANDSCHARO"], c: 1 },
            { q: "WELCHE WÜSTE IST DIE GRÖSSTE HEISSE WÜSTE?", a: ["GOBI", "SAHARA", "ATACAMA", "KALAHARI"], c: 1 },
            { q: "WELCHER FLUSS GILT KLASSISCH ALS 'LÄNGSTER' DER ERDE?", a: ["AMAZONAS", "NIL", "MISSISSIPPI", "JANGTSE"], c: 1 },
          ],
          // WELT
          [
            { q: "WELCHE STADT IST HAUPTSTADT VON JAPAN?", a: ["OSAKA", "TOKIO", "KYOTO", "NAGOYA"], c: 1 },
            { q: "WELCHE STADT IST HAUPTSTADT DER USA?", a: ["NEW YORK", "WASHINGTON, D.C.", "LOS ANGELES", "CHICAGO"], c: 1 },
            { q: "WELCHES LAND HAT DIE HAUPTSTADT 'OTTAWA'?", a: ["USA", "KANADA", "AUSTRALIEN", "IRLAND"], c: 1 },
            { q: "WELCHES LAND HAT DIE HAUPTSTADT 'CANBERRA'?", a: ["NEUSEELAND", "AUSTRALIEN", "KANADA", "SÜDAFRIKA"], c: 1 },
            { q: "WELCHE WÄHRUNG HAT JAPAN?", a: ["WON", "YEN", "YUAN", "DOLLAR"], c: 1 },
          ],
          // SPRACHE
          [
            { q: "WAS IST EIN SYNONYM FÜR 'PRÄZISE'?", a: ["GENAU", "SCHARF", "LEISE", "SATT"], c: 0 },
            { q: "WELCHES IST EIN ANTONYM ZU 'OPTIMISTISCH'?", a: ["REALISTISCH", "PESSIMISTISCH", "MOTIVIERT", "FRÖHLICH"], c: 1 },
            { q: "WAS BEDEUTET 'IRONIE' AM EHesten?", a: ["WÖRTLICHES MEINEN", "DAS GEGENTEIL MEINEN (STILMITTEL)", "REIM", "AUFZÄHLUNG"], c: 1 },
            { q: "WELCHES WORT IST EIN PARTIZIP II?", a: ["LAUFEN", "GELAUFEN", "LAUFEND", "LAUF"], c: 1 },
            { q: "WELCHER BEGRIFF PASST ZU 'WÖRTER, DIE GLEICH KLINGEN, ABER ANDERES BEDEUTEN'?", a: ["SYNONYME", "HOMOPHONE", "ANTONYME", "METAPHERN"], c: 1 },
          ],
        ],
      };

    default:
      return {
        categories: ["KAT 1", "KAT 2", "KAT 3", "KAT 4", "KAT 5"],
        clues: Array.from({ length: 5 }, () =>
          Array.from({ length: 5 }, () => ({ q: "FEHLENDE FRAGE", a: ["A", "B", "C", "D"], c: 0 }))
        ),
      };
  }
}

function getQuestionBankFixed(quizId) {
  return getQuestionBank(quizId);
}

// ------------------ ENGINE ------------------
function init() {
  const game = document.querySelector(".game");
  if (!game) return;

  const quizId = Number(game.dataset.quiz);
  const bank = getQuestionBankFixed(quizId);
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

  const hud = document.querySelector(".hud");

  // State
  let state = loadState(quizId);
  if (!state || typeof state !== "object" || !state.used || !state.scores) {
    state = { scores: { A: 0, B: 0 }, active: "A", used: {} };
    saveState(quizId, state);
  }

  let current = null; // {cat,row,value,clue}
  function keyFor(cat, row) { return `${cat}-${row}`; }

  // --- Team UI in HUD einbauen ---
  const teamWrap = document.createElement("div");
  teamWrap.style.display = "flex";
  teamWrap.style.gap = "8px";
  teamWrap.style.alignItems = "center";
  teamWrap.style.flexWrap = "wrap";

  const btnA = document.createElement("button");
  btnA.type = "button";
  btnA.textContent = "TEAM A";
  btnA.className = "hudBtn";

  const btnB = document.createElement("button");
  btnB.type = "button";
  btnB.textContent = "TEAM B";
  btnB.className = "hudBtn";

  teamWrap.appendChild(btnA);
  teamWrap.appendChild(btnB);

  if (hud && !hud.dataset.teamui) {
    hud.dataset.teamui = "1";
    hud.insertBefore(teamWrap, resetBtn);
  }

  function renderScore() {
    const a = state.scores.A;
    const b = state.scores.B;
    scoreEl.textContent = `TEAM A: ${a}   |   TEAM B: ${b}   |   AKTIV: ${state.active}`;

    btnA.style.outline = (state.active === "A") ? "2px solid rgba(255,255,255,.35)" : "none";
    btnB.style.outline = (state.active === "B") ? "2px solid rgba(255,255,255,.35)" : "none";
  }

  btnA.addEventListener("click", () => {
    state.active = "A";
    saveState(quizId, state);
    renderScore();
    statusEl.textContent = "Team A ist dran.";
  });

  btnB.addEventListener("click", () => {
    state.active = "B";
    saveState(quizId, state);
    renderScore();
    statusEl.textContent = "Team B ist dran.";
  });

  function buildBoard() {
    boardEl.innerHTML = "";
    boardEl.style.setProperty("--cols", String(bank.categories.length));

    bank.categories.forEach(name => {
      const h = document.createElement("div");
      h.className = "cat";
      h.textContent = name;
      boardEl.appendChild(h);
    });

    for (let row = 0; row < 5; row++) {
      for (let cat = 0; cat < bank.categories.length; cat++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "tile";
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
    const clue = bank.clues?.[cat]?.[row];
    if (!clue) {
      statusEl.textContent = "Für dieses Feld fehlt eine Frage.";
      return;
    }

    current = { cat, row, value: values[row], clue };

    modalMeta.textContent = `${bank.categories[cat]} • ${current.value} PUNKTE • TEAM ${state.active}`;
    modalQuestion.textContent = clue.q;

    modalAnswers.innerHTML = "";
    modalFeedback.textContent = "";
    submitBtn.disabled = true;

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

    if (modal.open) modal.close();
    modal.showModal();
  }

  function lockChoices(correctIndex, selectedIndex) {
    const labels = [...modalAnswers.querySelectorAll(".choice")];
    labels.forEach((lab, idx) => {
      const input = lab.querySelector("input");
      input.disabled = true;

      if (idx === correctIndex) lab.classList.add("correct");
      if (idx === selectedIndex && selectedIndex !== correctIndex) lab.classList.add("wrong");
    });
  }

  function markUsed() {
    state.used[keyFor(current.cat, current.row)] = true;
    saveState(quizId, state);
    buildBoard();
  }

  function allUsed() {
    return Object.keys(state.used).length >= bank.categories.length * 5;
  }

  submitBtn.addEventListener("click", () => {
    if (!current) return;

    const selected = modal.querySelector('input[name="choice"]:checked');
    if (!selected) return;

    submitBtn.disabled = true;

    const selectedIndex = Number(selected.value);
    const correctIndex = current.clue.c;
    const ok = selectedIndex === correctIndex;

    const team = state.active;

    if (ok) {
      state.scores[team] += current.value;
      modalFeedback.innerHTML = `✅ <strong>Richtig.</strong> TEAM ${team} +${current.value}`;
      statusEl.innerHTML = `✅ TEAM ${team}: richtig (+${current.value})`;
    } else {
      state.scores[team] -= current.value;
      modalFeedback.innerHTML = `❌ <strong>Falsch.</strong> TEAM ${team} -${current.value} — richtig: <strong>${current.clue.a[correctIndex]}</strong>`;
      statusEl.innerHTML = `❌ TEAM ${team}: falsch (-${current.value}). Richtig: <strong>${current.clue.a[correctIndex]}</strong>`;
    }

    lockChoices(correctIndex, selectedIndex);

    saveState(quizId, state);
    renderScore();
    markUsed();

    if (allUsed()) {
      statusEl.innerHTML = `🎉 <strong>BOARD FERTIG!</strong> TEAM A: <strong>${state.scores.A}</strong> • TEAM B: <strong>${state.scores.B}</strong>`;
    }
  });

  // X schließt Modal
  closeModalBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (modal.open) modal.close();
  });

  // Klick auf Backdrop schließt
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close();
  });

  resetBtn.addEventListener("click", () => {
    resetState(quizId);
    state = { scores: { A: 0, B: 0 }, active: "A", used: {} };
    saveState(quizId, state);

    renderScore();
    buildBoard();
    statusEl.textContent = "Reset: Neues Spiel gestartet. Team A beginnt.";
    current = null;

    if (modal.open) modal.close();
  });

  renderScore();
  buildBoard();
  statusEl.textContent = "Wähle ein Feld, um zu starten. Team A beginnt.";
}

document.addEventListener("DOMContentLoaded", init);