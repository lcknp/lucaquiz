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
  return `lucaquiz_jeopardy_q${quizId}_state_v7_team`;
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
 * Schwierigkeit steigt mit der Reihe (oben leicht → unten schwerer).
 */
function getQuestionBank(quizId) {
  switch (quizId) {

    // ==================================
    // QUIZ 1 — ALLGEMEINWISSEN (MID+)
    // ==================================
    case 1:
      return {
        categories: ["ALLGEMEIN", "WISSENSCHAFT", "GEOGRAFIE", "GESCHICHTE", "KULTUR"],
        clues: [
          // ALLGEMEIN
          [
            { q: "WELCHER TAG KOMMT NACH DONNERSTAG?", a: ["MITTWOCH", "FREITAG", "SAMSTAG", "SONNTAG"], c: 1 },
            { q: "WIE VIELE MINUTEN SIND 2,5 STUNDEN?", a: ["120", "150", "180", "210"], c: 1 },
            { q: "WELCHE ZAHL IST AM GRÖSSTEN?", a: ["0,5", "2/3", "0,7", "3/4"], c: 3 },
            { q: "WELCHE IST DIE KLEINSTE PRIMZAHL, DIE GRÖSSER ALS 50 IST?", a: ["51", "53", "55", "57"], c: 1 },
            { q: "WELCHER AUSDRUCK IST GLEICH WERT WIE 12%?", a: ["0,12", "0,012", "1,2", "12,0"], c: 0 },
          ],
          // WISSENSCHAFT
          [
            { q: "WELCHES ORGAN IST FÜR SAUERSTOFFAUFNAHME ZUSTÄNDIG?", a: ["LEBER", "LUNGE", "NIERE", "MAGEN"], c: 1 },
            { q: "WELCHES GAS IST IN DER LUFT AM HÄUFIGSTEN?", a: ["SAUERSTOFF", "STICKSTOFF", "CO2", "HELIUM"], c: 1 },
            { q: "WELCHE EINHEIT HAT STROMSTÄRKE?", a: ["VOLT", "AMPERE", "WATT", "OHM"], c: 1 },
            { q: "WELCHES BLUTGEFÄSS BRINGT BLUT VOM HERZEN WEG?", a: ["VENE", "ARTERIE", "KAPILLARE", "LYMPHE"], c: 1 },
            { q: "WIE HEISST DIE TEMPERATUR, BEI DER EIN STOFF KOCHT?", a: ["SCHMELZPUNKT", "SIEDEPUNKT", "TAUPUNKT", "BRENNPUNKT"], c: 1 },
          ],
          // GEOGRAFIE
          [
            { q: "WELCHE STADT IST HAUPTSTADT VON ITALIEN?", a: ["MAILAND", "ROM", "NEAPEL", "FLORENZ"], c: 1 },
            { q: "WELCHER FLUSS FLIESST DURCH PARIS?", a: ["SEINE", "THEMSE", "RHEIN", "DONAU"], c: 0 },
            { q: "WELCHER KONTINENT IST DER GRÖSSTE (FLÄCHE)?", a: ["EUROPA", "AFRIKA", "ASIEN", "ANTARKTIS"], c: 2 },
            { q: "WELCHES LAND GRENZT NICHT AN DEUTSCHLAND?", a: ["DÄNEMARK", "SCHWEIZ", "SPANIEN", "POLEN"], c: 2 },
            { q: "WELCHES MEER LIEGT ZWISCHEN GRIECHENLAND UND DER TÜRKEI?", a: ["NORDSEE", "ÄGÄIS", "BALTISCHE SEE", "SCHWARZES MEER"], c: 1 },
          ],
          // GESCHICHTE
          [
            { q: "WER WAR DER ERSTE MENSCH AUF DEM MOND?", a: ["YURI GAGARIN", "NEIL ARMSTRONG", "BUZZ ALDRIN", "JOHN GLENN"], c: 1 },
            { q: "IN WELCHEM JAHR FIEL DIE BERLINER MAUER?", a: ["1987", "1989", "1991", "1993"], c: 1 },
            { q: "WIE HEISST DIE EPOCHE ZWISCHEN ANTike UND NEUZEIT?", a: ["MODERNE", "MITTELALTER", "BRONZEZEIT", "BAROCK"], c: 1 },
            { q: "WELCHES LAND WURDE 1990 WIEDERVEREINIGT?", a: ["ÖSTERREICH", "DEUTSCHLAND", "TSCHECHIEN", "UNGARN"], c: 1 },
            { q: "WAS WAR 1914 DER DIREKTE ANLASS FÜR DEN 1. WELTKRIEG?", a: ["BÖRSENCRASH", "ATTENTAT VON SARAJEVO", "MONDLANDUNG", "BERLINER MAUER"], c: 1 },
          ],
          // KULTUR
          [
            { q: "WER SCHRIEB 'FAUST'?", a: ["GOETHE", "SCHILLER", "KAFKA", "BRECHT"], c: 0 },
            { q: "WELCHES INSTRUMENT HAT TASTEN?", a: ["GEIGE", "KLAVIER", "TROMMEL", "FLÖTE"], c: 1 },
            { q: "WELCHER FILMPREIS IST SEHR BEKANNT?", a: ["GRAMMY", "OSCAR", "NOBELPREIS", "BALLON D’OR"], c: 1 },
            { q: "WER MALTE 'DIE STERNENNACHT'?", a: ["MONET", "VAN GOGH", "PICASSO", "DALÍ"], c: 1 },
            { q: "WIE HEISST DAS SEHR BEKANNTE MUSEUM IN PARIS?", a: ["LOUVRE", "PRADO", "UFFIZIEN", "TATE"], c: 0 },
          ],
        ],
      };

    // ==================================
    // QUIZ 2 — SPORT & TECH (MID+)
    // ==================================
    case 2:
      return {
        categories: ["SPORT", "TECHNIK", "NETZ", "LOGIK", "MIX"],
        clues: [
          // SPORT
          [
            { q: "WIE VIELE SPIELER HAT EIN FUSSBALLTEAM AUF DEM FELD?", a: ["9", "10", "11", "12"], c: 2 },
            { q: "WIE VIELE RINGE HAT DAS OLYMPISCHE SYMBOL?", a: ["4", "5", "6", "7"], c: 1 },
            { q: "WELCHER SPORT NUTZT EINEN 'DREIER'?", a: ["TENNIS", "BASKETBALL", "HANDBALL", "HOCKEY"], c: 1 },
            { q: "WELCHER SPORT HAT EINE 'ABSEITS'-REGEL?", a: ["BASKETBALL", "FUSSBALL", "TENNIS", "GOLF"], c: 1 },
            { q: "IM TENNIS 'BEST OF 5': WIE VIELE SÄTZE BRAUCHT MAN FÜR DEN SIEG?", a: ["2", "3", "4", "5"], c: 1 },
          ],
          // TECHNIK
          [
            { q: "WOFÜR STEHT 'USB'?", a: ["UNIFIED SPEED BUS", "UNIVERSAL SERIAL BUS", "UNITED SYSTEM BACKUP", "USER SAFE BUTTON"], c: 1 },
            { q: "WAS IST EINE 'APP'?", a: ["KABEL", "PROGRAMM/ANWENDUNG", "DRUCKER", "SPEICHERSTICK"], c: 1 },
            { q: "WELCHER SPEICHER IST MEISTENS 'DAUERHAFT'?", a: ["RAM", "SSD/HDD", "CACHE", "REGISTER"], c: 1 },
            { q: "WAS IST DER BESTE UNTERSCHIED: RAM vs. SSD?", a: ["RAM IST DAUERHAFT", "RAM IST FLÜCHTIG/ARBEITSSPEICHER", "SSD IST FLÜCHTIG", "KEIN UNTERSCHIED"], c: 1 },
            { q: "WELCHES IST EIN BETRIEBSSYSTEM?", a: ["CHROME", "WINDOWS", "GOOGLE", "WLAN"], c: 1 },
          ],
          // NETZ
          [
            { q: "WELCHER PORT GEHÖRT TYPISCH ZU HTTPS?", a: ["21", "80", "443", "25"], c: 2 },
            { q: "WAS MACHT DNS?", a: ["VERSCHLÜSSELN", "NAMEN IN IP AUFLÖSEN", "DATEIEN LÖSCHEN", "WLAN STÄRKEN"], c: 1 },
            { q: "WELCHES IST EIN WEBBROWSER?", a: ["EXCEL", "CHROME", "WORD", "POWERPOINT"], c: 1 },
            { q: "WAS IST 'PHISHING'?", a: ["UPDATE", "BETRUG DURCH FAKE-NACHRICHTEN", "BACKUP", "KABEL"], c: 1 },
            { q: "WAS BEDEUTET 2FA?", a: ["2 FIREWALLS", "ZWEI-FAKTOR-ANMELDUNG", "2 BACKUPS", "2 PASSWÖRTER IMMER"], c: 1 },
          ],
          // LOGIK
          [
            { q: "WENN A WAHR IST UND B FALSCH: A UND B IST…", a: ["WAHR", "FALSCH", "BEIDES", "UNBEKANNT"], c: 1 },
            { q: "WENN ALLE HUNDE TIERE SIND, DANN IST JEDER HUND EIN…", a: ["MENSCH", "TIER", "FISCH", "VOGEL"], c: 1 },
            { q: "WAS IST DAS GEGENTEIL VON 'IMMER'?", a: ["OFT", "MANCHMAL", "NIE", "SELTEN"], c: 2 },
            { q: "WENN P→Q UND P, DANN FOLGT…", a: ["Q", "P", "NICHT Q", "NICHT P"], c: 0 },
            { q: "WELCHER BEGRIFF PASST ZU 'WENN…DANN…' IN DER LOGIK?", a: ["UND", "ODER", "IMPLIKATION", "NEGATION"], c: 2 },
          ],
          // MIX
          [
            { q: "WELCHES LAND HAT 'TOKIO' ALS HAUPTSTADT?", a: ["CHINA", "JAPAN", "KOREA", "THAILAND"], c: 1 },
            { q: "WELCHE ZAHL IST DURCH 3 TEILBAR?", a: ["14", "21", "22", "25"], c: 1 },
            { q: "WIE HEISST DIE WÄHRUNG IN UK?", a: ["EURO", "PFUND", "DOLLAR", "KRONE"], c: 1 },
            { q: "WELCHES LAND LIEGT NICHT IN EUROPA?", a: ["POLEN", "ARGENTINIEN", "ITALIEN", "NORWEGEN"], c: 1 },
            { q: "WELCHES IST EIN ANAGRAMM VON 'LISTEN'?", a: ["SILENT", "TINSEL", "BEIDE", "KEINS"], c: 2 },
          ],
        ],
      };

    // ==================================
    // QUIZ 3 — NATUR & ERDE (MID+)
    // ==================================
    case 3:
      return {
        categories: ["TIERWELT", "PFLANZEN", "ERDE", "CHEMIE", "WELTALL"],
        clues: [
          // TIERWELT
          [
            { q: "WELCHES TIER IST EIN SÄUGETIER?", a: ["FROSCH", "PENGUIN", "DELFIN", "EIDECHSE"], c: 2 },
            { q: "WELCHES TIER IST EIN REPTIL?", a: ["SCHLANGE", "WAL", "SPERLING", "BIENE"], c: 0 },
            { q: "WELCHES TIER HAT 8 BEINE?", a: ["AMEISE", "SPINNE", "WURM", "SCHNECKE"], c: 1 },
            { q: "WELCHE TIERGRUPPE HAT IMMER FEDERN?", a: ["SÄUGETIERE", "VÖGEL", "REPTILIEN", "FISCHE"], c: 1 },
            { q: "WELCHES TIER IST BEKANNT FÜR ECHOORTUNG?", a: ["KATZE", "FLEDERMAUS", "HASE", "SCHAF"], c: 1 },
          ],
          // PFLANZEN
          [
            { q: "WELCHER TEIL DER PFLANZE NIMMT WASSER AUF?", a: ["BLÜTE", "WURZEL", "BLATT", "FRUCHT"], c: 1 },
            { q: "WELCHES GAS ENTSTEHT BEI DER FOTOSYNTHESE?", a: ["CO2", "O2", "N2", "H2"], c: 1 },
            { q: "WELCHES IST EIN NADELBAUM?", a: ["BIRKE", "FICHTE", "APFELBAUM", "BUCHE"], c: 1 },
            { q: "WELCHES PFLANZENTEIL MACHT HAUPTSÄCHLICH FOTOSYNTHESE?", a: ["WURZEL", "BLATT", "SAMEN", "FRUCHT"], c: 1 },
            { q: "WELCHE PFLANZE IST EINE HÜLSENFRUCHT?", a: ["ERBSE", "WEIZEN", "APFEL", "GURKE"], c: 0 },
          ],
          // ERDE
          [
            { q: "WELCHE SCHICHT IST ÄUSSERSTE DER ERDE?", a: ["KERN", "MANTEL", "KRUSTE", "MAGMASEE"], c: 2 },
            { q: "WAS VERURSACHT GEZEITEN?", a: ["SONNE NUR", "MONDGRAVITATION (HAUPT)", "VULKANE", "WIND"], c: 1 },
            { q: "WELCHES IST EIN TREIBHAUSGAS?", a: ["CO2", "HELIUM", "ARGON", "NEON"], c: 0 },
            { q: "WELCHER PROZESS FORMt FLUSSTÄLER ÜBER LANGE ZEIT?", a: ["KONDENSATION", "EROSION", "SUBLIMATION", "IONISATION"], c: 1 },
            { q: "WIE HEISST DER PROZESS, BEI DEM ERDPLATTEN SICH BEWEGEN?", a: ["PLATTENTEKTONIK", "GÄRUNG", "DIFFUSION", "FOTOSYNTHESE"], c: 0 },
          ],
          // CHEMIE
          [
            { q: "WAS IST KOCHSALZ CHEMISCH?", a: ["NaCl", "H2O", "CO2", "O2"], c: 0 },
            { q: "WAS IST DER PH-WERT VON 'NEUTRAL'?", a: ["0", "7", "10", "14"], c: 1 },
            { q: "WELCHE REAKTION IST 'ROSTEN'?", a: ["OXIDATION", "DESTILLATION", "FILTRATION", "SUBLIMATION"], c: 0 },
            { q: "WELCHER STOFF IST TYPISCH SAUER (ZITRONE)?", a: ["AMMONIAK", "ZITRONENSÄURE", "SALZ", "NATRIUMHYDROXID"], c: 1 },
            { q: "WELCHES IST EIN EDELGAS?", a: ["NEON", "CHLOR", "NATRIUM", "SCHWEFEL"], c: 0 },
          ],
          // WELTALL
          [
            { q: "WAS IST DIE SONNE?", a: ["PLANET", "STERN", "MOND", "KOMET"], c: 1 },
            { q: "WIE HEISST UNSERE GALAXIE?", a: ["ANDROMEDA", "MILCHSTRASSE", "ORION", "PEGASUS"], c: 1 },
            { q: "WAS IST EIN 'LICHTJAHR'?", a: ["ZEIT", "ENTFERNUNG", "MASSE", "HELLIGKEIT"], c: 1 },
            { q: "WELCHER PLANET HAT RINGE (BEKANNT)?", a: ["MARS", "SATURN", "MERKUR", "VENUS"], c: 1 },
            { q: "WELCHER PLANET IST DER SONNE AM NÄCHSTEN?", a: ["MERKUR", "VENUS", "ERDE", "MARS"], c: 0 },
          ],
        ],
      };

    // ==================================
    // QUIZ 4 — EUROPA & DEUTSCHLAND (MID+)
    // ==================================
    case 4:
      return {
        categories: ["DEUTSCHLAND", "EUROPA", "HAUPTSTÄDTE", "SPRACHE", "KULTUR"],
        clues: [
          // DEUTSCHLAND
          [
            { q: "WELCHE STADT IST HAUPTSTADT DEUTSCHLANDS?", a: ["BERLIN", "HAMBURG", "MÜNCHEN", "BONN"], c: 0 },
            { q: "WELCHER FLUSS FLIESST DURCH KÖLN?", a: ["ELBE", "RHEIN", "DONAU", "ODER"], c: 1 },
            { q: "WELCHES IST EIN BUNDESLAND?", a: ["BAYERN", "KATALONIEN", "TEXAS", "QUEBEC"], c: 0 },
            { q: "WELCHE STADT IST FÜR EINEN GROSSEN HAFEN BEKANNT?", a: ["MÜNCHEN", "HAMBURG", "ERFURT", "AUGSBURG"], c: 1 },
            { q: "PASSAU IST BEKANNT ALS 'DREI-FLÜSSE-STADT'. EIN FLUSS DAVON IST…", a: ["DONAU", "SEINE", "PO", "THEMSE"], c: 0 },
          ],
          // EUROPA
          [
            { q: "WELCHES LAND LIEGT NICHT IN EUROPA?", a: ["SCHWEDEN", "ARGENTINIEN", "POLEN", "IRLAND"], c: 1 },
            { q: "WELCHES GEBIRGE TRENNT SPANIEN UND FRANKREICH?", a: ["ALPEN", "PYRENÄEN", "KARPATEN", "URAL"], c: 1 },
            { q: "WELCHES LAND HAT DEN EURO?", a: ["NORWEGEN", "SPANIEN", "SCHWEIZ", "UK"], c: 1 },
            { q: "WELCHES LAND HAT AMSTERDAM ALS HAUPTSTADT, ABER DEN HAAG ALS REGIERUNGSSITZ?", a: ["NIEDERLANDE", "ITALIEN", "PORTUGAL", "DÄNEMARK"], c: 0 },
            { q: "WELCHES MEER LIEGT ZWISCHEN ITALIEN UND KROATIEN?", a: ["ADRIA", "NORDSEE", "BALTISCHE SEE", "IRISCHE SEE"], c: 0 },
          ],
          // HAUPTSTÄDTE
          [
            { q: "HAUPTSTADT VON FRANKREICH?", a: ["PARIS", "LYON", "MARSEILLE", "NIZZA"], c: 0 },
            { q: "HAUPTSTADT VON ÖSTERREICH?", a: ["SALZBURG", "WIEN", "GRAZ", "INNSBRUCK"], c: 1 },
            { q: "HAUPTSTADT VON POLEN?", a: ["KRAKAU", "WARSCHAU", "DANZIG", "POSEN"], c: 1 },
            { q: "HAUPTSTADT VON TSCHECHIEN?", a: ["PRAG", "BRÜNN", "OSTRAVA", "PILSEN"], c: 0 },
            { q: "HAUPTSTADT VON SCHWEDEN?", a: ["OSLO", "STOCKHOLM", "HELSINKI", "KOPENHAGEN"], c: 1 },
          ],
          // SPRACHE
          [
            { q: "WELCHES WORT IST EIN VERB?", a: ["SCHÖN", "LAUFEN", "BLAU", "STUHL"], c: 1 },
            { q: "WAS IST DAS GEGENTEIL VON 'LEISE'?", a: ["LANGSAM", "LAUT", "KALT", "HELL"], c: 1 },
            { q: "WAS BEDEUTET 'ETYMOLOGIE'?", a: ["WORT-HERKUNFT", "RECHTSCHREIBUNG", "KURZE WÖRTER", "LAUTSTÄRKE"], c: 0 },
            { q: "WELCHES IST EIN PALINDROM?", a: ["LAGER", "RELIEF", "ANNA", "KATZE"], c: 2 },
            { q: "WELCHE WORTART IST 'SCHNELL' IN: 'ER LÄUFT SCHNELL'?", a: ["SUBSTANTIV", "ADVERBIAL (ADJEKTIVISCH)", "VERB", "ARTIKEL"], c: 1 },
          ],
          // KULTUR
          [
            { q: "WER MALTE DIE 'MONA LISA'?", a: ["PICASSO", "DA VINCI", "VAN GOGH", "MONET"], c: 1 },
            { q: "WELCHER SPORT IST TYPISCH FÜR WIMBLEDON?", a: ["FUSSBALL", "TENNIS", "GOLF", "EISHOCKEY"], c: 1 },
            { q: "WELCHES INSTRUMENT HAT SAITEN?", a: ["TROMMEL", "GITARRE", "FLÖTE", "BECKEN"], c: 1 },
            { q: "WER KOMPONIERTE 'EINE KLEINE NACHTMUSIK'?", a: ["BACH", "MOZART", "BEETHOVEN", "CHOPIN"], c: 1 },
            { q: "WIE HEISST EIN BÜHNENSTÜCK MIT VIEL GESANG (KLASSISCH)?", a: ["OPER", "ROMAN", "ESSAY", "REPORTAGE"], c: 0 },
          ],
        ],
      };

    // ==================================
    // QUIZ 5 — MATHE & LOGIK (MID+)
    // ==================================
    case 5:
      return {
        categories: ["KOPFRECHNEN", "BRÜCHE", "GEOMETRIE", "LOGIK", "SCHÄTZEN"],
        clues: [
          // KOPFRECHNEN
          [
            { q: "WIE VIEL IST 18 + 27?", a: ["35", "45", "55", "65"], c: 1 },
            { q: "WIE VIEL IST 12 × 8?", a: ["84", "96", "104", "112"], c: 1 },
            { q: "WIE VIEL IST 250 ÷ 5?", a: ["25", "40", "50", "60"], c: 2 },
            { q: "WIE VIEL IST 15% VON 200?", a: ["20", "25", "30", "35"], c: 2 },
            { q: "WIE VIEL IST 23 × 7?", a: ["141", "149", "161", "171"], c: 2 },
          ],
          // BRÜCHE
          [
            { q: "WELCHER BRUCH IST AM GRÖSSTEN?", a: ["1/2", "2/3", "3/5", "4/9"], c: 1 },
            { q: "WAS IST 0,25 ALS BRUCH?", a: ["1/2", "1/3", "1/4", "1/5"], c: 2 },
            { q: "WAS IST 3/4 VON 20?", a: ["12", "14", "15", "16"], c: 3 },
            { q: "1/3 + 1/6 = ?", a: ["1/2", "2/3", "1/6", "5/6"], c: 0 },
            { q: "WAS IST 7/8 ALS DEZIMALZAHL?", a: ["0,875", "0,78", "0,708", "0,987"], c: 0 },
          ],
          // GEOMETRIE
          [
            { q: "WIE GROSS IST DIE INNENWINKELSUMME IM DREIECK?", a: ["90°", "180°", "270°", "360°"], c: 1 },
            { q: "UMFANG QUADRAT (SEITE 6)?", a: ["12", "18", "24", "36"], c: 2 },
            { q: "FLÄCHE RECHTECK (5×8)?", a: ["13", "30", "40", "80"], c: 2 },
            { q: "KREIS: DURCHMESSER 10 → RADIUS?", a: ["2", "5", "10", "20"], c: 1 },
            { q: "WIE VIELE DIAGONALEN HAT EIN SECHSECK?", a: ["6", "9", "12", "15"], c: 1 },
          ],
          // LOGIK
          [
            { q: "WENN ALLE A B SIND UND X EIN A IST, DANN IST X…", a: ["B", "NICHT B", "C", "UNBEKANNT"], c: 0 },
            { q: "A ODER B IST NUR DANN FALSCH, WENN…", a: ["A WAHR", "B WAHR", "BEIDE FALSCH", "BEIDE WAHR"], c: 2 },
            { q: "WELCHES IST EIN ANAGRAMM VON 'LISTEN'?", a: ["SILENT", "TINSEL", "BEIDE", "KEINS"], c: 2 },
            { q: "WELCHE ZAHL FEHLT: 2, 4, 8, 16, …", a: ["18", "20", "24", "32"], c: 3 },
            { q: "WENN HEUTE MONTAG IST: WAS IST IN 15 TAGEN?", a: ["MONTAG", "DIENSTAG", "MITTWOCH", "DONNERSTAG"], c: 1 },
          ],
          // SCHÄTZEN
          [
            { q: "WIE VIEL IST 1/5 VON 100?", a: ["5", "10", "20", "25"], c: 2 },
            { q: "WELCHE ZAHL LIEGT NÄHER AN 1000?", a: ["930", "860", "790", "700"], c: 0 },
            { q: "WAS IST MEHR? 3×17 ODER 2×26", a: ["3×17", "2×26", "GLEICH", "UNMÖGLICH"], c: 1 },
            { q: "WIE VIEL IST √81?", a: ["7", "8", "9", "10"], c: 2 },
            { q: "WAS IST 60% VON 50?", a: ["25", "30", "35", "40"], c: 1 },
          ],
        ],
      };

    // ==================================
    // QUIZ 6 — KINO, MUSIK, WELT (MID+)
    // ==================================
    case 6:
      return {
        categories: ["KINO", "MUSIK", "REKORDE", "WELT", "SPRACHE"],
        clues: [
          // KINO
          [
            { q: "WIE HEISST EINE FILM-VORSCHAU?", a: ["TEASER/TRAILER", "SCORE", "CUT", "SCRIPT"], c: 0 },
            { q: "WAS MACHT EIN REGISSEUR?", a: ["FILM LEITEN", "MUSIK KOMPOSEN", "LICHT MESSEN", "KARTEN DRUCKEN"], c: 0 },
            { q: "WAS IST EIN 'SEQUEL'?", a: ["FORTSETZUNG", "VORSCHAU", "NEBENROLLE", "DREHBUCH"], c: 0 },
            { q: "WAS IST EIN 'CAMEO'?", a: ["KURZER GASTAUFTRITT", "LAUTES LIED", "FILMTRICK", "KAMERAART"], c: 0 },
            { q: "WELCHER PREIS IST FÜR FILME SEHR BEKANNT?", a: ["OSCAR", "GRAMMY", "BALLON D’OR", "FIFA"], c: 0 },
          ],
          // MUSIK
          [
            { q: "WIE HEISST DIE WIEDERHOLUNG IM LIED?", a: ["STROPHE", "REFRAIN", "BRIDGE", "OUTRO"], c: 1 },
            { q: "WELCHES INSTRUMENT HAT 88 TASTEN (STANDARD)?", a: ["KLAVIER", "GITARRE", "FLÖTE", "TROMMEL"], c: 0 },
            { q: "WAS BEDEUTET 'DUETT'?", a: ["ZWEI SINGEN/SPIELEN", "DREI", "VIER", "ALLEIN"], c: 0 },
            { q: "WIE HEISST DAS 'NOTENBILD' MIT 5 LINIEN?", a: ["TABULATUR", "NOTENSYSTEM", "REFRAIN", "TAKTART"], c: 1 },
            { q: "WER KOMPONIERTE 'FÜR ELISE'?", a: ["MOZART", "BEETHOVEN", "BACH", "VIVALDI"], c: 1 },
          ],
          // REKORDE
          [
            { q: "WELCHER IST DER HÖCHSTE BERG DER ERDE?", a: ["K2", "EVEREST", "MONT BLANC", "KILIMANDSCHARO"], c: 1 },
            { q: "WELCHES IST DAS GRÖSSTE LAND (FLÄCHE)?", a: ["KANADA", "USA", "CHINA", "RUSSLAND"], c: 3 },
            { q: "WELCHER OZEAN IST DER GRÖSSTE?", a: ["ATLANTIK", "PAZIFIK", "INDISCHER", "ARKTISCHER"], c: 1 },
            { q: "WELCHES TIER IST DAS GRÖSSTE?", a: ["ELEFANT", "BLAUWAL", "GIRAFFE", "HAI"], c: 1 },
            { q: "WELCHER FLUSS GILT KLASSISCH ALS DER LÄNGSTE DER ERDE?", a: ["AMAZONAS", "NIL", "MISSISSIPPI", "JANGTSE"], c: 1 },
          ],
          // WELT
          [
            { q: "WELCHE STADT IST HAUPTSTADT VON JAPAN?", a: ["OSAKA", "TOKIO", "KYOTO", "NAGOYA"], c: 1 },
            { q: "WELCHE STADT IST HAUPTSTADT DER USA?", a: ["NEW YORK", "WASHINGTON, D.C.", "LOS ANGELES", "CHICAGO"], c: 1 },
            { q: "WELCHE WÄHRUNG HAT UK?", a: ["EURO", "PFUND", "DOLLAR", "KRONE"], c: 1 },
            { q: "WELCHES LAND HAT DIE HAUPTSTADT 'CANBERRA'?", a: ["NEUSEELAND", "AUSTRALIEN", "KANADA", "SÜDAFRIKA"], c: 1 },
            { q: "WELCHES LAND HAT DIE HAUPTSTADT 'OTTAWA'?", a: ["USA", "KANADA", "AUSTRALIEN", "IRLAND"], c: 1 },
          ],
          // SPRACHE
          [
            { q: "WAS IST EIN SYNONYM FÜR 'SCHWIERIG'?", a: ["LEICHT", "KOMPLIZIERT", "KLEIN", "HELL"], c: 1 },
            { q: "WAS IST DAS GEGENTEIL VON 'FRÜH'?", a: ["SPÄT", "NAH", "LANG", "KURZ"], c: 0 },
            { q: "WELCHES WORT IST EIN ADJEKTIV?", a: ["SCHNELL", "STUHL", "TRINKEN", "HUND"], c: 0 },
            { q: "WAS BEDEUTET 'ETYMOLOGIE'?", a: ["WORT-HERKUNFT", "RECHTSCHREIBUNG", "KURZE WÖRTER", "LAUTSTÄRKE"], c: 0 },
            { q: "WELCHES IST EIN PALINDROM?", a: ["LAGER", "RELIEF", "ANNA", "KATZE"], c: 2 },
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

// Optionaler Hook für spätere kleine Fixes
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

  // --- Team UI in HUD einbauen (falls nicht vorhanden) ---
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

    // Kategorie Header
    bank.categories.forEach(name => {
      const h = document.createElement("div");
      h.className = "cat";
      h.textContent = name;
      boardEl.appendChild(h);
    });

    // 5 Reihen
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

  // X schließt Modal zuverlässig
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