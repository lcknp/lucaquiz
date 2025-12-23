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
  return `lucaquiz_jeopardy_q${quizId}_state_v9_team_harderplus`;
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
 * Schwierigkeit steigt nach unten – aber auch Reihe 1/2 ist schon „Jeopardy-mäßig“.
 */
function getQuestionBank(quizId) {
  switch (quizId) {

    // ==================================
    // QUIZ 1 — ALLGEMEINWISSEN (deutlich schwerer)
    // ==================================
    case 1:
      return {
        categories: ["ALLGEMEIN", "WISSEN", "GEOGRAFIE", "GESCHICHTE", "KULTUR"],
        clues: [
          // ALLGEMEIN
          [
            { q: "WELCHER WERT IST AM GRÖSSTEN?", a: ["0,62", "5/8", "0,61", "3/5"], c: 0 }, // 0.62
            { q: "WIE VIELE SEKUNDEN SIND 2,5 MINUTEN?", a: ["120", "150", "180", "210"], c: 1 }, // 150
            { q: "WELCHES IST EINE PRIMZAHL?", a: ["91", "93", "97", "99"], c: 2 },
            { q: "WELCHER AUSDRUCK IST GLEICH WIE 0,375?", a: ["3/8", "1/3", "5/12", "2/5"], c: 0 },
            { q: "WELCHER WERT IST 12,5% VON 320?", a: ["30", "35", "40", "45"], c: 2 }, // 40
          ],
          // WISSEN
          [
            { q: "WELCHES GAS MACHT DEN GRÖSSTEN TEIL DER LUFT AUS?", a: ["O2", "N2", "CO2", "H2"], c: 1 },
            { q: "WELCHE EINHEIT HAT ELEKTRISCHER WIDERSTAND?", a: ["WATT", "OHM", "VOLT", "AMPERE"], c: 1 },
            { q: "WELCHE ART DER STRAHLUNG IST 'UV'?", a: ["ULTRAVIOLETT", "ULTRAVISUELL", "UNTERVOLT", "ULTRAVIBRATION"], c: 0 },
            { q: "WELCHER TEIL DES AUGES REGELT DEN LICHTEINLASS?", a: ["IRIS", "LINSE", "NETZHAUT", "SEHNERV"], c: 0 },
            { q: "WELCHER BEGRIFF PASST ZU 'MASSE PRO VOLUMEN'?", a: ["DICHTE", "DRUCK", "ENERGIE", "SPANNUNG"], c: 0 },
          ],
          // GEOGRAFIE
          [
            { q: "WELCHES LAND HAT DIE HAUPTSTADT 'WELLINGTON'?", a: ["AUSTRALIEN", "NEUSEELAND", "KANADA", "IRLAND"], c: 1 },
            { q: "WELCHER FLUSS FLIESST DURCH BUDAPEST?", a: ["RHEIN", "DONAU", "ELBE", "PO"], c: 1 },
            { q: "WELCHES MEER LIEGT ZWISCHEN SCHWEDEN UND FINNLAND?", a: ["NORDSEE", "BOTTNISCHER MEERBUSEN", "ADRIA", "ÄGÄIS"], c: 1 },
            { q: "WELCHES LAND GRENZT AN KEIN MEER?", a: ["SPANIEN", "ÖSTERREICH", "PORTUGAL", "NORWEGEN"], c: 1 },
            { q: "WELCHER KANAL VERBINDET MITTELMEER UND ROTES MEER?", a: ["PANAMAKANAL", "SUEZKANAL", "KIELKANAL", "KORINTHKANAL"], c: 1 },
          ],
          // GESCHICHTE
          [
            { q: "IN WELCHEM JAHR BEGINN DER 1. WELTKRIEG?", a: ["1912", "1914", "1916", "1918"], c: 1 },
            { q: "WELCHES EREIGNIS WAR 1914 DER DIREKTE ANLASS?", a: ["BÖRSENCRASH", "ATTENTAT VON SARAJEVO", "MAUERBAU", "MONDLANDUNG"], c: 1 },
            { q: "WANN WAR DIE FRANZÖSISCHE REVOLUTION (STARTJAHR)?", a: ["1776", "1789", "1815", "1848"], c: 1 },
            { q: "WELCHES REICH HATTE KONSTANTINOPEL ALS ZENTRUM (SPÄTER)?", a: ["RÖMISCHES REICH", "BIZANTINISCHES REICH", "MAYA-REICH", "FRANKENREICH"], c: 1 },
            { q: "WAS WAR DIE 'HANS E' PRIMÄR?", a: ["EIN KÖNIGREICH", "EIN STÄDTEBUND ZUM HANDEL", "EINE RELIGION", "EIN GEBIRGE"], c: 1 },
          ],
          // KULTUR
          [
            { q: "WER SCHRIEB 'DIE VERWANDLUNG'?", a: ["GOETHE", "KAFKA", "HEINE", "MANN"], c: 1 },
            { q: "WELCHES WERK IST EINE TRAGÖDIE VON SHAKESPEARE?", a: ["ODYSSEE", "HAMLET", "FAUST", "ILIAD E"], c: 1 },
            { q: "WER MALTE 'GUERNICA'?", a: ["PICASSO", "MONET", "VAN GOGH", "REMBRANDT"], c: 0 },
            { q: "WELCHER BEGRIFF PASST ZU 'BÜHNENSTÜCK MIT GESANG UND ORCHESTER'?", a: ["OPER", "ESSAY", "FABEL", "REPORTAGE"], c: 0 },
            { q: "WELCHER KOMPONIST WIRD OFT MIT DER '9. SINFONIE' VERBUNDEN?", a: ["MOZART", "BEETHOVEN", "CHOPIN", "DEBUSSY"], c: 1 },
          ],
        ],
      };

    // ==================================
    // QUIZ 2 — TECH, NETZ, LOGIK, SPORT (deutlich schwerer)
    // ==================================
    case 2:
      return {
        categories: ["TECHNIK", "NETZ", "SICHERHEIT", "LOGIK", "SPORT"],
        clues: [
          // TECHNIK
          [
            { q: "WOFÜR STEHT 'GPU'?", a: ["GENERAL POWER UNIT", "GRAPHICS PROCESSING UNIT", "GLOBAL PROGRAM UPDATE", "GRAPHIC PRINT UTILITY"], c: 1 },
            { q: "WELCHE ZAHL IST TYPISCH BINÄR FÜR '8' (DEZIMAL)?", a: ["1000", "1010", "1111", "0110"], c: 0 },
            { q: "WAS BEDEUTET 'OPEN SOURCE' AM EHESTEN?", a: ["KOSTET IMMER GELD", "QUELLCODE ÖFFENTLICH", "NUR FÜR HANDYS", "NUR ONLINE"], c: 1 },
            { q: "WELCHES IST EIN BEISPIEL FÜR 'CLOUD-SPEICHER'?", a: ["USB-STICK", "GOOGLE DRIVE", "DVD", "RAM"], c: 1 },
            { q: "WELCHES DATEISYSTEM IST TYPISCH FÜR WINDOWS (KLASSISCH)?", a: ["NTFS", "EXT4", "APFS", "HFS+"], c: 0 },
          ],
          // NETZ
          [
            { q: "WAS MACHT DNS?", a: ["VERSCHLÜSSELN", "NAMEN IN IP AUFLÖSEN", "VIRUS ENTFERNEN", "WLAN VERSTÄRKEN"], c: 1 },
            { q: "WELCHER PORT IST TYPISCH HTTPS?", a: ["25", "80", "443", "53"], c: 2 },
            { q: "WOFÜR STEHT 'LAN'?", a: ["LOCAL AREA NETWORK", "LONG ACCESS NODE", "LINKED APP NETWORK", "LOGICAL ADDRESS NUMBER"], c: 0 },
            { q: "WELCHES PROTOKOLL IST FÜR E-MAIL-VERSAND TYPISCH?", a: ["SMTP", "FTP", "SSH", "DHCP"], c: 0 },
            { q: "WAS IST DER UNTERSCHIED HTTP vs. HTTPS AM BESTEN?", a: ["HTTPS IST IMMER SCHNELLER", "HTTPS IST VERSCHLÜSSELT (TYPISCH TLS)", "HTTP BRAUCHT DNS NICHT", "HTTPS IST NUR FÜR APPS"], c: 1 },
          ],
          // SICHERHEIT
          [
            { q: "WAS IST 2FA?", a: ["2 FIREWALLS", "ZWEI-FAKTOR-ANMELDUNG", "ZWEI ROUTER", "2 PASSWÖRTER IMMER GLEICH"], c: 1 },
            { q: "WAS IST 'PHISHING'?", a: ["PC-SPIEL", "BETRUG ÜBER FAKE-NACHRICHTEN/SEITEN", "DATEIKOMPRESS", "WLAN-STANDARD"], c: 1 },
            { q: "WELCHES PASSWORT IST AM SICHERSTEN (TENDENZ)?", a: ["Sommer2025", "Passwort123", "L4mp3!Qz9#rT", "11111111"], c: 2 },
            { q: "WAS MACHT EIN 'VPN' PRIMÄR?", a: ["MACHT WLAN SCHNELLER", "TUNNELT/ERSCHWERT MITLESEN IM NETZ", "LÖSCHT VIREN", "ERSATZ FÜR PASSWORT"], c: 1 },
            { q: "WAS IST EIN 'UPDATE' AUS SECURITY-SICHT OFT?", a: ["UNNÖTIG", "SCHLIESST SICHERHEITSLÜCKEN", "MACHT ALLES LANGSAM", "LÖSCHT DATEIEN"], c: 1 },
          ],
          // LOGIK
          [
            { q: "WENN A FALSCH UND B WAHR: A ODER B IST…", a: ["WAHR", "FALSCH", "UNBEKANNT", "BEIDES"], c: 0 },
            { q: "WENN P→Q UND Q IST FALSCH, DANN MUSS P…", a: ["WAHR SEIN", "FALSCH SEIN", "UNBEKANNT SEIN", "Q WAHR MACHEN"], c: 1 },
            { q: "NEGATION VON 'ALLE SIND PÜNKTLICH' IST…", a: ["NIEMAND IST PÜNKTLICH", "MINDESTENS EINER IST NICHT PÜNKTLICH", "ALLE SIND UNPÜNKTLICH", "EINER IST PÜNKTLICH"], c: 1 },
            { q: "FOLGE: 2, 3, 5, 8, 13, … (NÄCHSTE ZAHL)", a: ["18", "20", "21", "22"], c: 2 },
            { q: "ANAGRAMM: WELCHES PASST ZU 'LISTEN'?", a: ["SILENT", "TINSEL", "BEIDE", "KEINS"], c: 2 },
          ],
          // SPORT
          [
            { q: "WIE VIELE PUNKTE ZÄHLT EIN TOUCHDOWN (OHNE EXTRA)?", a: ["3", "6", "7", "10"], c: 1 },
            { q: "WIE VIELE SPIELER STEHEN IM HANDBALL PRO TEAM AUF DEM FELD?", a: ["5", "6", "7", "11"], c: 2 },
            { q: "WELCHER SPORT NUTZT DEN BEGRIFF 'BIRDIE'?", a: ["GOLF", "TENNIS", "BOXEN", "BASKETBALL"], c: 0 },
            { q: "WELCHER SPORT HAT DIE 'ABSEITS'-REGEL?", a: ["EISHOCKEY", "FUSSBALL", "BASKETBALL", "GOLF"], c: 1 },
            { q: "TENnIS: WIE VIELE PUNKTE BRAUCHT MAN IM TIEBREAK MINDESTENS (NORMAL) ZUM SATZGEWINN?", a: ["5", "6", "7", "10"], c: 2 },
          ],
        ],
      };

    // ==================================
    // QUIZ 3 — NATUR & WELTALL (deutlich schwerer)
    // ==================================
    case 3:
      return {
        categories: ["BIOLOGIE", "PFLANZEN", "ERDE", "CHEMIE", "WELTALL"],
        clues: [
          // BIOLOGIE
          [
            { q: "WELCHES ORGANELLE IST 'KRAFTWERK' DER ZELLE?", a: ["ZELLKERN", "MITOCHONDRIUM", "RIBOSOM", "LYSOSOM"], c: 1 },
            { q: "WELCHES TIER HAT EIN EXOSKELETT?", a: ["KÄFER", "FROSCH", "WAL", "EULE"], c: 0 },
            { q: "WELCHES IST EIN WIRBELTIER?", a: ["REGENWURM", "FISCH", "QUALLE", "KORALLE"], c: 1 },
            { q: "WELCHER BEGRIFF PASST ZU 'KÖRPERABWEHR'?", a: ["IMMUNSYSTEM", "VERDAUUNG", "ATMUNG", "OSMOSE"], c: 0 },
            { q: "WELCHES TIER NUTZT ECHOORTUNG KLASSISCH?", a: ["FLEDERMAUS", "PFERD", "SCHAF", "KATZE"], c: 0 },
          ],
          // PFLANZEN
          [
            { q: "WELCHER BEGRIFF PASST ZU 'BLATTGRÜN'?", a: ["CHLOROPHYLL", "KERATIN", "HEMOGLOBIN", "GLYKOGEN"], c: 0 },
            { q: "WELCHES LEITGEWEBE TRANSPORTIERT WASSER NACH OBEN?", a: ["XYLEM", "PHLOEM", "CUTICULA", "NEKTAR"], c: 0 },
            { q: "WELCHES LEITGEWEBE TRANSPORTIERT ZUCKER/ASSIMILATE?", a: ["XYLEM", "PHLOEM", "RINDE", "MARK"], c: 1 },
            { q: "WELCHER TEIL IST MEISTENS FÜR BESTÄUBUNG WICHTIG?", a: ["WURZEL", "BLÜTE", "STAMM", "RINDE"], c: 1 },
            { q: "WELCHE PFLANZE IST EINE HÜLSENFRUCHT?", a: ["ERBSE", "WEIZEN", "GURKE", "APFEL"], c: 0 },
          ],
          // ERDE
          [
            { q: "WELCHE SCHICHT DER ERDE IST AUSSEN?", a: ["KERN", "MANTEL", "KRUSTE", "MAGMASEE"], c: 2 },
            { q: "WAS IST DER 'ÄQUATOR'?", a: ["LÄNGSTER FLUSS", "GEDACHTE LINIE BEI 0° BREITE", "HÖCHSTER BERG", "TIEFSTER PUNKT"], c: 1 },
            { q: "WELCHER PROZESS IST 'ABTRAGUNG DURCH WIND/WASSER'?", a: ["EROSION", "KONDENSATION", "IONISATION", "SUBLIMATION"], c: 0 },
            { q: "WELCHE PLATTENGRENZE FÜHRT OFT ZU GEBIRGSBILDUNG?", a: ["DIVERGENT", "KONVERGENT", "STATIONÄR", "ISOLIERT"], c: 1 },
            { q: "WELCHER OZEAN IST DER GRÖSSTE?", a: ["ATLANTIK", "PAZIFIK", "INDISCHER", "ARKTISCHER"], c: 1 },
          ],
          // CHEMIE
          [
            { q: "WAS IST 'NaCl'?", a: ["ZUCKER", "KOCHSALZ", "WASSER", "CO2"], c: 1 },
            { q: "WELCHES ELEMENT HAT DAS SYMBOL 'Fe'?", a: ["FLUOR", "EISEN", "FERMIUM", "FETT"], c: 1 },
            { q: "PH 7 IST…", a: ["SAUER", "NEUTRAL", "BASISCH", "GIFTIG"], c: 1 },
            { q: "WAS IST 'OXIDATION' VEREINFACHT OFT?", a: ["SAUERSTOFFABGABE", "ELEKTRONENABGABE", "ABKÜHLUNG", "FILTRATION"], c: 1 },
            { q: "WELCHES IST EIN EDELGAS?", a: ["NEON", "CHLOR", "NATRIUM", "SCHWEFEL"], c: 0 },
          ],
          // WELTALL
          [
            { q: "WAS IST EIN 'LICHTJAHR'?", a: ["ZEIT", "ENTFERNUNG", "MASSE", "HELLIGKEIT"], c: 1 },
            { q: "WELCHER PLANET IST DER SONNE AM NÄCHSTEN?", a: ["MERKUR", "VENUS", "ERDE", "MARS"], c: 0 },
            { q: "WELCHER PLANET IST DER GRÖSSTE IM SONNENSYSTEM?", a: ["ERDE", "SATURN", "JUPITER", "NEPTUN"], c: 2 },
            { q: "WAS IST EIN 'ASTEROID' AM EHESTEN?", a: ["Stern", "Gesteinsbrocken im All", "Galaxie", "Nebel"], c: 1 },
            { q: "WIE HEISST UNSERE GALAXIE?", a: ["ANDROMEDA", "MILCHSTRASSE", "ORION", "PEGASUS"], c: 1 },
          ],
        ],
      };

    // ==================================
    // QUIZ 4 — EUROPA/DEUTSCHLAND/SPRACHE (deutlich schwerer)
    // ==================================
    case 4:
      return {
        categories: ["DEUTSCHLAND", "EUROPA", "HAUPTSTÄDTE", "SPRACHE", "KULTUR"],
        clues: [
          // DEUTSCHLAND
          [
            { q: "WELCHER FLUSS FLIESST DURCH DRESDEN?", a: ["ELBE", "RHEIN", "DONAU", "MAIN"], c: 0 },
            { q: "WELCHES BUNDESLAND HAT DIE HAUPTSTADT 'WIESBADEN'?", a: ["HESSEN", "SACHSEN", "BAYERN", "NRW"], c: 0 },
            { q: "WELCHE STADT LIEGT AN RHEIN UND NECKAR?", a: ["HEIDELBERG", "MÜNSTER", "ROSTOCK", "KIEL"], c: 0 },
            { q: "WELCHES MEER GRENZT AN SCHLESWIG-HOLSTEIN?", a: ["NUR OSTSEE", "OSTSEE UND NORDSEE", "NUR NORDSEE", "MITTELMEER"], c: 1 },
            { q: "WELCHE STADT IST DER SITZ DES EUROPÄISCHEN PARLAMENTS (PLENAR, BEKANNT)?", a: ["BRÜSSEL", "STRASSBURG", "LUXEMBURG", "FRANKFURT"], c: 1 },
          ],
          // EUROPA
          [
            { q: "WELCHES GEBIRGE TRENNT SPANIEN UND FRANKREICH?", a: ["ALPEN", "PYRENÄEN", "KARPATEN", "URAL"], c: 1 },
            { q: "WELCHES LAND HAT DEN EURO?", a: ["NORWEGEN", "SPANIEN", "SCHWEIZ", "UK"], c: 1 },
            { q: "WELCHES MEER LIEGT ZWISCHEN ITALIEN UND KROATIEN?", a: ["ADRIA", "OSTSEE", "NORDSEE", "IRISCHE SEE"], c: 0 },
            { q: "WELCHES LAND HAT AMSTERDAM ALS HAUPTSTADT, ABER DEN HAAG ALS REGIERUNGSSITZ?", a: ["NIEDERLANDE", "DÄNEMARK", "ITALIEN", "PORTUGAL"], c: 0 },
            { q: "WELCHES LAND LIEGT NICHT IN EUROPA?", a: ["POLEN", "ARGENTINIEN", "ITALIEN", "NORWEGEN"], c: 1 },
          ],
          // HAUPTSTÄDTE
          [
            { q: "HAUPTSTADT VON KANADA?", a: ["TORONTO", "OTTAWA", "MONTREAL", "VANCOUVER"], c: 1 },
            { q: "HAUPTSTADT VON AUSTRALIEN?", a: ["SYDNEY", "MELBOURNE", "CANBERRA", "BRISBANE"], c: 2 },
            { q: "HAUPTSTADT VON UNGARN?", a: ["BUKAREST", "BUDAPEST", "SOFIA", "BELGRAD"], c: 1 },
            { q: "HAUPTSTADT VON SÜDAFRIKA (REGIERUNGSSITZ, AM BEKANNTESTEN)?", a: ["KAPSTADT", "PRETORIA", "JOHANNESBURG", "DURBAN"], c: 1 },
            { q: "HAUPTSTADT VON BRASILIEN?", a: ["RIO", "BRASÍLIA", "SÃO PAULO", "SALVADOR"], c: 1 },
          ],
          // SPRACHE
          [
            { q: "WELCHE WORTART IST 'SCHNELL' IN: 'ER LÄUFT SCHNELL'?", a: ["SUBSTANTIV", "ADVERBIAL (ADJEKTIVISCH)", "VERB", "ARTIKEL"], c: 1 },
            { q: "WAS IST EIN SYNONYM FÜR 'PRÄZISE'?", a: ["GENAU", "LAUT", "MÜDE", "BREIT"], c: 0 },
            { q: "WAS IST EIN ANTONYM ZU 'OPTIMISTISCH'?", a: ["REALISTISCH", "PESSIMISTISCH", "MUTIG", "HÖFLICH"], c: 1 },
            { q: "WELCHES WORT IST EIN PARTIZIP II?", a: ["LAUFEN", "GELAUFEN", "LAUFEND", "LAUF"], c: 1 },
            { q: "WIE HEISSEN WÖRTER, DIE GLEICH KLINGEN, ABER ANDERES BEDEUTEN?", a: ["SYNONYME", "HOMOPHONE", "ANTONYME", "METAPHERN"], c: 1 },
          ],
          // KULTUR
          [
            { q: "WER MALTE 'GUERNICA'?", a: ["PICASSO", "MONET", "VAN GOGH", "REMBRANDT"], c: 0 },
            { q: "WER SCHRIEB 'FAUST'?", a: ["GOETHE", "SCHILLER", "KAFKA", "BRECHT"], c: 0 },
            { q: "WELCHES IST EIN WERK VON HOMER?", a: ["ODYSSEE", "FAUST", "DAS KAPITAL", "DER PROZESS"], c: 0 },
            { q: "WER KOMPONIERTE 'EINE KLEINE NACHTMUSIK'?", a: ["BACH", "MOZART", "BEETHOVEN", "CHOPIN"], c: 1 },
            { q: "WELCHER BEGRIFF PASST ZU 'THEATERSTÜCK MIT TRAGISCHEM ENDE'?", a: ["KOMÖDIE", "TRAGÖDIE", "SATIRE", "FABEL"], c: 1 },
          ],
        ],
      };

    // ==================================
    // QUIZ 5 — MATHE & MUSTER (deutlich schwerer)
    // ==================================
    case 5:
      return {
        categories: ["KOPFRECHNEN", "PROZENTE", "BRÜCHE", "GEOMETRIE", "MUSTER"],
        clues: [
          // KOPFRECHNEN
          [
            { q: "WIE VIEL IST 19 × 17?", a: ["289", "303", "323", "361"], c: 2 },
            { q: "WIE VIEL IST 864 ÷ 12?", a: ["68", "72", "74", "76"], c: 1 },
            { q: "WIE VIEL IST 3,6 × 25?", a: ["72", "80", "90", "96"], c: 2 }, // 90
            { q: "WIE VIEL IST 2³ + 3³?", a: ["25", "31", "35", "41"], c: 1 }, // 8+27=35 -> actually 35 => option 2, fix:
            { q: "WIE VIEL IST 999 − 387?", a: ["602", "612", "622", "632"], c: 1 }, // 612
          ],
          // PROZENTE
          [
            { q: "WIE VIEL SIND 15% VON 240?", a: ["24", "30", "36", "42"], c: 2 },
            { q: "EIN PREIS 80€ WIRD UM 25% REDUZIERT. NEUER PREIS?", a: ["55€", "60€", "65€", "70€"], c: 1 },
            { q: "WELCHER BRUCH ENTSPRICHT 12,5%?", a: ["1/5", "1/8", "1/10", "1/12"], c: 1 },
            { q: "EIN WERT STEIGT VON 50 AUF 60. PROZENTUALE STEIGERUNG?", a: ["10%", "15%", "20%", "25%"], c: 2 },
            { q: "WAS IST 2% VON 350?", a: ["5", "7", "9", "12"], c: 1 },
          ],
          // BRÜCHE
          [
            { q: "WELCHER BRUCH IST AM GRÖSSTEN?", a: ["5/8", "2/3", "7/12", "3/5"], c: 1 },
            { q: "1/4 + 3/8 = ?", a: ["1/2", "5/8", "3/4", "7/8"], c: 1 },
            { q: "WAS IST 5/6 VON 24?", a: ["18", "20", "22", "24"], c: 1 },
            { q: "WAS IST 0,375 ALS BRUCH (GEKÜRZT)?", a: ["3/8", "5/16", "7/20", "6/25"], c: 0 },
            { q: "WAS IST 7/8 ALS DEZIMALZAHL?", a: ["0,875", "0,78", "0,708", "0,987"], c: 0 },
          ],
          // GEOMETRIE
          [
            { q: "INNENWINKELSUMME IM VIERSEIT?", a: ["180°", "270°", "360°", "450°"], c: 2 },
            { q: "WELCHER TERM IST KREISUMFANG?", a: ["πr²", "2πr", "r²/π", "π/2r"], c: 1 },
            { q: "DREIECKFLÄCHE: GRUND 12, HÖHE 7?", a: ["42", "84", "36", "24"], c: 0 }, // (12*7)/2=42
            { q: "WIE VIELE DIAGONALEN HAT EIN ACHTECK?", a: ["8", "16", "20", "24"], c: 2 }, // 8*5/2=20
            { q: "PYTHAGORAS: KATHETEN 9 UND 12 → HYPOTENUSE?", a: ["15", "18", "21", "24"], c: 0 },
          ],
          // MUSTER
          [
            { q: "FOLGE: 100, 90, 81, 73, … (NÄCHSTE)", a: ["66", "65", "64", "63"], c: 0 }, // -10,-9,-8,-7
            { q: "FOLGE: 2, 6, 12, 20, … (NÄCHSTE)", a: ["26", "30", "32", "36"], c: 1 }, // 30
            { q: "FOLGE: 5, 11, 23, 47, … (NÄCHSTE)", a: ["85", "95", "97", "99"], c: 1 }, // 95
            { q: "FOLGE: 1, 4, 9, 16, … (NÄCHSTE)", a: ["20", "24", "25", "36"], c: 2 },
            { q: "WELCHE ZAHL FEHLT: 3, 6, 12, 24, …", a: ["30", "36", "42", "48"], c: 3 },
          ],
        ],
      };

    // Fix für eine Mathefrage (2³+3³)
    // (in getQuestionBankFixed unten)

    // ==================================
    // QUIZ 6 — WELT & KULTUR MIX (deutlich schwerer)
    // ==================================
    case 6:
      return {
        categories: ["WELT", "KULTUR", "WISSEN", "SPRACHE", "MIX"],
        clues: [
          // WELT
          [
            { q: "WELCHES LAND HAT DIE HAUPTSTADT 'BRASÍLIA'?", a: ["ARGENTINIEN", "BRASILIEN", "PORTUGAL", "MEXIKO"], c: 1 },
            { q: "WELCHE WÄHRUNG HAT JAPAN?", a: ["WON", "YEN", "YUAN", "DOLLAR"], c: 1 },
            { q: "WELCHER FLUSS FLIESST DURCH LONDON?", a: ["SEINE", "THEMSE", "RHEIN", "DONAU"], c: 1 },
            { q: "WELCHE STADT LIEGT AM BOSPORUS?", a: ["ISTANBUL", "ATHEN", "ROM", "SOFIA"], c: 0 },
            { q: "WELCHER KANAL VERBINDET ATLANTIK UND PAZIFIK?", a: ["SUEZKANAL", "PANAMAKANAL", "KIELKANAL", "KORINTHKANAL"], c: 1 },
          ],
          // KULTUR
          [
            { q: "WER SCHRIEB '1984'?", a: ["ORWELL", "HUXLEY", "TOLKIEN", "DICKENS"], c: 0 },
            { q: "WELCHER MALER IST MIT 'SURREALISMUS' HÄUFIG VERBUNDEN?", a: ["DALÍ", "MONET", "REMBRANDT", "KLEE"], c: 0 },
            { q: "WELCHES WERK IST EINE OPER VON MOZART?", a: ["DIE ZAUBERFLÖTE", "FAUST", "ODYSSEE", "DIE ZEIT"], c: 0 },
            { q: "WER KOMPONIERTE DIE 'VIER JAHRESZEITEN'?", a: ["VIVALDI", "BACH", "BEETHOVEN", "HAYDN"], c: 0 },
            { q: "WELCHER PREIS IST PRIMÄR FILM?", a: ["OSCAR", "GRAMMY", "PULITZER", "BALLON D’OR"], c: 0 },
          ],
          // WISSEN
          [
            { q: "WELCHER WERT IST CA. √144?", a: ["10", "11", "12", "13"], c: 2 },
            { q: "WIE VIEL IST 0,75 ALS BRUCH?", a: ["3/4", "2/3", "1/2", "5/6"], c: 0 },
            { q: "WELCHES IST EIN TREIBHAUSGAS?", a: ["CO2", "NEON", "HELIUM", "ARGON"], c: 0 },
            { q: "WELCHES ELEMENT HAT DAS SYMBOL 'K'?", a: ["KUPFER", "KALIUM", "KRYPTON", "KOHlenstoff"], c: 1 },
            { q: "WAS IST 'DNA' AM EHESTEN?", a: ["ZELLWAND", "ERBINFORMATION", "BLUTZELLE", "KNOCHENMARK"], c: 1 },
          ],
          // SPRACHE
          [
            { q: "WAS IST EIN ANTONYM ZU 'KONKRET'?", a: ["ABSTRAKT", "DETAILLIERT", "DEUTLICH", "KURZ"], c: 0 },
            { q: "WAS BEDEUTET 'PARADOX' AM EHESTEN?", a: ["WIDERSPRUCH, DER DENKT", "EINFACH", "LUSTIG", "REIM"], c: 0 },
            { q: "WELCHES IST EIN RELATIVSATZ-EINLEITER?", a: ["DASS", "WEIL", "DER/DIE/DAS", "ABER"], c: 2 },
            { q: "WELCHES WORT IST EIN SUBSTANTIV?", a: ["LAUFEN", "SCHNELL", "FREIHEIT", "SEHR"], c: 2 },
            { q: "WAS IST EIN 'HOMONYM'?", a: ["GLEICHBEDEUTEND", "GLEICHLAUTEND/gleich geschrieben, andere Bedeutung", "GEGENWORT", "FREMDSATZ"], c: 1 },
          ],
          // MIX
          [
            { q: "WELCHER PLANET IST DER GRÖSSTE?", a: ["ERDE", "SATURN", "JUPITER", "NEPTUN"], c: 2 },
            { q: "WIE VIELE DIAGONALEN HAT EIN SECHSECK?", a: ["6", "9", "12", "15"], c: 1 }, // 6*3/2=9
            { q: "WELCHE ZAHL IST DURCH 11 TEILBAR?", a: ["121", "125", "128", "132"], c: 0 },
            { q: "WELCHES LAND HAT KEINE LANDGRENZEN?", a: ["ÖSTERREICH", "ISLAND", "UNGARN", "TSCHECHIEN"], c: 1 },
            { q: "WELCHE ZAHL FEHLT: 8, 13, 21, 34, …", a: ["45", "50", "55", "55?"], c: 2 }, // next 55
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
  const bank = getQuestionBank(quizId);

  // Fix: Quiz 5 Kopf-Rechnen Frage 4 (2³ + 3³ = 35)
  if (quizId === 5) {
    bank.clues[0][3] = { q: "WIE VIEL IST 2³ + 3³?", a: ["25", "31", "35", "41"], c: 2 };
  }

  // Fix: Quiz 6 Mix letzte Frage: Optionen sauber (55 doppelt vermeiden)
  if (quizId === 6) {
    bank.clues[4][4] = { q: "WELCHE ZAHL FEHLT: 8, 13, 21, 34, …", a: ["43", "50", "55", "60"], c: 2 };
  }

  return bank;
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