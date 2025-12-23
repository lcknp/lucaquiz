// LucaQuiz – Jeopardy Board (5 Kategorien x 5 Punkte)
// Ungerade Quiz-ID: 100/200/300/400/500
// Gerade Quiz-ID:   200/400/600/800/1000
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
  return `lucaquiz_jeopardy_q${quizId}_state_v4`;
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
 * Fragebank: 5 Kategorien × 5 Fragen pro Quiz
 * clues[catIndex][rowIndex] => { q, a:[...], c:indexCorrect }
 *
 * Schwierigkeit steigt mit rowIndex (0->4).
 */
function getQuestionBank(quizId) {
  switch (quizId) {

    // =========================
    // QUIZ 1 — NATURWISSENSCHAFT
    // =========================
    case 1:
      return {
        categories: ["PHYSIK", "CHEMIE", "BIOLOGIE", "ASTRONOMIE", "ERDE & KLIMA"],
        clues: [
          // PHYSIK
          [
            { q: "WELCHE GRÖSSE MISST MAN IN NEWTON?", a: ["ENERGIE", "KRAFT", "LEISTUNG", "DRUCK"], c: 1 },
            { q: "WAS IST DIE EINHEIT DER ELEKTRISCHEN LEISTUNG?", a: ["VOLT", "OHM", "WATT", "AMPERE"], c: 2 },
            { q: "WELCHE GRÖSSE IST IM SI EINHEITENSYSTEM 'KG·M²/S²'?", a: ["DRUCK", "ARBEIT/ENERGIE (JOULE)", "SPANNUNG", "FREQUENZ"], c: 1 },
            { q: "WAS BESCHREIBT DIE 'HALBWERTSZEIT'?", a: ["ZEIT BIS VERDOPPLUNG", "ZEIT BIS HÄLFTE ZERFALLEN IST", "ZEIT BIS ZWEI MAL SIEDEN", "ZEIT BIS TEMPERATUR HALBIERT"], c: 1 },
            { q: "WELCHES PRINZIP ERKLÄRT AUFTRIEB IN FLÜSSIGKEITEN?", a: ["PASCALSCHES PRINZIP", "ARCHIMEDISCHES PRINZIP", "BOYLESCHES GESETZ", "COULOMBSCHES GESETZ"], c: 1 },
          ],
          // CHEMIE
          [
            { q: "WAS IST DER PH-WERT VON REINEM WASSER (25°C) UNGEFÄHR?", a: ["1", "7", "10", "14"], c: 1 },
            { q: "WELCHES ELEMENT HAT DAS SYMBOL 'K'?", a: ["KUPFER", "KALIUM", "KOHLE", "KRYPTON"], c: 1 },
            { q: "WELCHE BINDUNG ENTSTEHT ZWISCHEN METALL UND NICHTMETALL TYPISCH?", a: ["WASSERSTOFFBRÜCKE", "IONENBINDUNG", "VAN-DER-WAALS", "PEPTIDBINDUNG"], c: 1 },
            { q: "WIE HEISST DIE REAKTIONSART: SÄURE + BASE → SALZ + WASSER?", a: ["OXIDATION", "NEUTRALISATION", "POLYMERISATION", "SUBLIMATION"], c: 1 },
            { q: "WELCHER BEGRIFF BESCHREIBT DIE ANZAHL TEILCHEN IN 1 MOL?", a: ["FARADAY-KONSTANTE", "AVOGADRO-KONSTANTE", "BOLTZMANN-KONSTANTE", "PLANCK-KONSTANTE"], c: 1 },
          ],
          // BIOLOGIE
          [
            { q: "WELCHES MOLEKÜL TRÄGT HAUPTSÄCHLICH DIE GENETISCHE INFORMATION?", a: ["RNA", "DNA", "ATP", "HÄMOGLOBIN"], c: 1 },
            { q: "WELCHES ORGANELL IST HAUPT-ORT DER ZELLATMUNG?", a: ["RIBOSOM", "GOLGI-APPARAT", "MITOCHONDRIUM", "LYSOSOM"], c: 2 },
            { q: "WELCHE PROZESSE GEHÖREN ZUR 'MITOSE'?", a: ["BILDUNG VON GESCHLECHTSZELLEN", "ZELLTEILUNG KÖRPERZELLEN", "DNA-ÜBERSETZUNG", "FOTOSYNTHESE"], c: 1 },
            { q: "WELCHER TEIL DES NEURONS EMPFÄNGT SIGNale TYPISCH?", a: ["AXON", "DENDRIT", "MYELIN", "SYNAPSESPALT"], c: 1 },
            { q: "WELCHER BEGRIFF BESCHREIBT 'STOFFWECHSEL GESAMT'?", a: ["OSMOSE", "METABOLISMUS", "DIFFUSION", "HOMÖOSTASE"], c: 1 },
          ],
          // ASTRONOMIE
          [
            { q: "WAS IST EIN 'LICHTJAHR'?", a: ["ZEIT", "ENTFERNUNG", "MASSE", "HELLIGKEIT"], c: 1 },
            { q: "WELCHER PLANET HAT DIE MEISTEN BEKANNTEN MONDE (STAND HEUTE OFT: SATURN/JUPITER – HIER KLASSISCH)?", a: ["MARS", "SATURN", "MERKUR", "VENUS"], c: 1 },
            { q: "WAS ENTSTEHT, WENN EIN MASSEREICHER STERN KOLLABIERT?", a: ["KOMET", "SCHWARZES LOCH (MÖGLICH)", "ASTEROIDENGÜRTEL", "NEBEL"], c: 1 },
            { q: "WIE HEISST UNSERE GALAXIE?", a: ["ANDROMEDA", "MILCHSTRASSE", "SOMBRERO", "TRIANGULUM"], c: 1 },
            { q: "WELCHES SPEKTRUM NUTZT MAN, UM ROTVERSCHIEBUNG ZU MESSEN?", a: ["RÖNTGEN", "SICHTBARES/EM-SPEKTRUM (SPEKTRALLINIEN)", "ULTRASCHALL", "GAMMA NUR"], c: 1 },
          ],
          // ERDE & KLIMA
          [
            { q: "WELCHES GAS TRÄGT AM STÄRKSTEN ZUM NATÜRLICHEN TREIBHAUSEFFEKT BEI?", a: ["WASSERDAMPF", "ARGON", "OZON", "HELIUM"], c: 0 },
            { q: "WIE HEISST DIE ÄUSSERE STARRE ERDHÜLLE?", a: ["KRYOSPHÄRE", "LITHOSPHÄRE", "BIOSPHÄRE", "IONOSPHÄRE"], c: 1 },
            { q: "WELCHER PROZESS TREIBT PLATTENTEKTONIK AN?", a: ["EISALBEDO", "KONVEKTION IM MANTEL", "WINDZIRKULATION", "MONDGRAVITATION"], c: 1 },
            { q: "WELCHE SKALA MISST ERDBEBEN-MAGNITUDE HEUTE OFT STATT RICHTER?", a: ["MOHS", "MOMENTENMAGNITUDE (Mw)", "BEAUFORT", "KELVIN"], c: 1 },
            { q: "WELCHER STROM TRANSPORTIERT WÄRME IM ATLANTIK NACH EUROPA?", a: ["HUMBOLDTSTROM", "GOLFSTROM", "KANARENSTROM", "LABRADORSTROM"], c: 1 },
          ],
        ],
      };

    // =========================
    // QUIZ 2 — GESCHICHTE & POLITIK
    // =========================
    case 2:
      return {
        categories: ["ANTIKE", "MITTELALTER", "NEUZEIT", "POLITIK", "WELTORDNUNG"],
        clues: [
          // ANTIKE
          [
            { q: "WELCHE STADT WAR ZENTRUM DES RÖMISCHEN REICHES?", a: ["ATHEN", "ROM", "ALEXANDRIA", "BYZANZ"], c: 1 },
            { q: "WELCHER KRIEG IST MIT 'TROJA' VERBUNDEN?", a: ["PUNISCHE KRIEGE", "TROJANISCHER KRIEG", "HUNDERTJÄHRIGER KRIEG", "PELOPONNESISCHER KRIEG"], c: 1 },
            { q: "WELCHES REICH BAUTE DIE 'KÖNIGSSTRASSE' AUS?", a: ["PERSERREICH", "ROM", "ÄGYPTEN", "MAKEDONIEN"], c: 0 },
            { q: "WELCHER GRIECHISCHE PHILOSOPH WAR LEHRER ALEXANDERS DES GROSSEN?", a: ["PLATON", "ARISTOTELES", "SOKRATES", "EPICUR"], c: 1 },
            { q: "WELCHES BAUWERK IST EIN SYMBOL FÜR ATHEN?", a: ["KOLLOS VON RHODOS", "PARTHENON", "PANTHEON", "KOLLOSEUM"], c: 1 },
          ],
          // MITTELALTER
          [
            { q: "WIE HEISST DAS SYSTEM AUS LEHNEN UND VASALLEN?", a: ["KAPITALISMUS", "FEUDALISMUS", "SOZIALISMUS", "MERKANTILISMUS"], c: 1 },
            { q: "WELCHE STADT GALT ALS 'ZWEITES ROM'?", a: ["KONSTANTINOPEL", "PARIS", "VENEDIG", "KÖLN"], c: 0 },
            { q: "WELCHES EREIGNIS 1215 BEGRENZTE KÖNIGSMACHT IN ENGLAND?", a: ["BILL OF RIGHTS", "MAGNA CARTA", "GLORIOUS REVOLUTION", "HABEAS CORPUS"], c: 1 },
            { q: "WELCHER ORDEN WAR FÜR KREUZZÜGE BERÜHMT?", a: ["BENEDIKTINER", "TEMPLER", "FRANZISKANER", "JESUITEN"], c: 1 },
            { q: "WAS WAR DIE 'HANSE' PRIMÄR?", a: ["RITTERORDEN", "HANDELSBUND", "KÖNIGREICH", "RELIGION"], c: 1 },
          ],
          // NEUZEIT
          [
            { q: "WELCHE REVOLUTION BEGANN 1789?", a: ["INDUSTRIELLE", "FRANZÖSISCHE", "RUSSISCHE", "AMERIKANISCHE"], c: 1 },
            { q: "WELCHER VERTRAG BEENDTE DEN 1. WELTKRIEG FÜR DEUTSCHLAND?", a: ["WESTFÄLISCHER FRIEDEN", "VERTRAG VON VERSAILLES", "WIENER KONGRESS", "POTSDAM"], c: 1 },
            { q: "WELCHES JAHR IST MIT DEM BEGINN DES 2. WELTKRIEGS VERBUNDEN?", a: ["1918", "1939", "1941", "1945"], c: 1 },
            { q: "WELCHES PROGRAMM HALF WESTEUROPA NACH 1945 WIRTSCHAFTLICH?", a: ["NEW DEAL", "MARSHALLPLAN", "FIVE-YEAR PLAN", "BRETTON WOODS"], c: 1 },
            { q: "WELCHER BEGRIFF BESCHREIBT DIE TEILUNG EUROPAS IM KALTEN KRIEG?", a: ["SEIDENSTRASSE", "EISERNER VORHANG", "BLITZKRIEG", "WELTMEERSPERRUNG"], c: 1 },
          ],
          // POLITIK
          [
            { q: "WAS IST DIE GEWALTENTEILUNG?", a: ["NUR EXEKUTIVE", "LEGISLATIVE/EXEKUTIVE/JUDIKATIVE", "WIRTSCHAFT/MILITÄR", "STAAT/KIRCHE"], c: 1 },
            { q: "WELCHE WAHLFORM WÄHLT EINZELPERSONEN IN WAHLKREISEN HÄUFIG?", a: ["MEHRHEITSWAHL", "VERHÄLTNISWAHL", "ZUFALLSWAHL", "KONSENSWAHL"], c: 0 },
            { q: "WAS IST EIN 'VETO'?", a: ["ANTRAG", "ABLEHNUNGSRECHT", "STEUER", "BÜNDNIS"], c: 1 },
            { q: "WELCHE INSTITUTION BESCHLIESST IN DEUTSCHLAND BUNDESGESETZE MIT?", a: ["BUNDESRAT", "BUNDESBANK", "BUNDESWEHR", "BUNDESTAGSPRÄSIDIUM"], c: 0 },
            { q: "WAS BESCHREIBT 'SUPRANATIONAL' AM BESTEN?", a: ["NUR NATIONAL", "ÜBERSTAATLICH MIT EIGENEN KOMPETENZEN", "LOKAL", "PRIVATWIRTSCHAFTLICH"], c: 1 },
          ],
          // WELTORDNUNG
          [
            { q: "WOFÜR STEHT 'UN'?", a: ["UNITED NATIONS", "UNION NETWORK", "UNIFIED NATO", "UNITED NEUTRALS"], c: 0 },
            { q: "WELCHER RAT DER UN HAT 5 STÄNDIGE MITGLIEDER?", a: ["WIRTSCHAFTSRAT", "SICHERHEITSRAT", "MENSCHENRECHTSRAT", "GENERALVERSAMMLUNG"], c: 1 },
            { q: "WAS REGELT DIE WTO PRIMÄR?", a: ["WELTHANDEL", "WELTGESUNDHEIT", "WELTMETEOROLOGIE", "WELTPOST"], c: 0 },
            { q: "WELCHES SYSTEM KOPPELTE (HISTORISCH) WÄHRUNGEN AN GOLD/USD?", a: ["SCHENGEN", "BRETTON-WOODS", "NAFTA", "MERCOSUR"], c: 1 },
            { q: "WELCHER BEGRIFF MEINT 'MACHTAUSGLEICH ZUR KRIEGSVERMEIDUNG'?", a: ["CHECKS AND BALANCES", "BALANCE OF POWER", "REALPOLITIK", "DETENTE"], c: 1 },
          ],
        ],
      };

    // =========================
    // QUIZ 3 — GEOGRAFIE & KARTENWISSEN
    // =========================
    case 3:
      return {
        categories: ["EUROPA", "AFRIKA", "ASIEN", "AMERIKA", "KARTEN & CO."],
        clues: [
          // EUROPA
          [
            { q: "WELCHE STADT IST HAUPTSTADT VON PORTUGAL?", a: ["MADRID", "LISSABON", "PORTO", "SEVILLA"], c: 1 },
            { q: "WELCHER FLUSS FLIESST DURCH WIEN?", a: ["RHEIN", "DONAU", "ELBE", "PO"], c: 1 },
            { q: "WELCHER STAAT IST KEIN MITGLIED DER EU (2025 TYPISCH)?", a: ["NORWEGEN", "FRANKREICH", "SPANIEN", "ITALIEN"], c: 0 },
            { q: "WELCHER PASS VERBINDET DEUTSCHLAND DIREKT MIT ITALIEN (ALPEN-RAUM, BEKANNT)?", a: ["BRENNERPASS", "KARAWANKENTUNNEL", "STILFSER JOCH", "GOTTHARD"], c: 0 },
            { q: "WELCHES MEER GRENZT NICHT AN ITALIEN?", a: ["ADRIA", "IONISCHES MEER", "BALTISCHE SEE", "TYRRHENISCHES MEER"], c: 2 },
          ],
          // AFRIKA
          [
            { q: "WELCHE STADT IST HAUPTSTADT VON ÄGYPTEN?", a: ["KAIRO", "ALEXANDRIA", "GIZEH", "LUXOR"], c: 0 },
            { q: "WELCHER FLUSS GILT ALS KLASSISCHE 'LÄNGSTER FLUSS'?", a: ["KONGO", "NIL", "NIGER", "SAMBESI"], c: 1 },
            { q: "WELCHES LAND LIEGT AM HORN VON AFRIKA?", a: ["GABUN", "ÄTHIOPIEN", "NAMIBIA", "GAMBIA"], c: 1 },
            { q: "WELCHE WÜSTE LIEGT IM SÜDWESTEN AFRIKAS AN DER KÜSTE?", a: ["SAHARA", "NAMIB", "GOBI", "KALAHARI"], c: 1 },
            { q: "WELCHER SEE IST DER FLÄCHENMÄSSIG GRÖSSTE IN AFRIKA?", a: ["TANGANYIKASEE", "VIKTORIASEE", "MALAWISEE", "TSCHADSEE"], c: 1 },
          ],
          // ASIEN
          [
            { q: "WELCHE STADT IST HAUPTSTADT VON SÜDKOREA?", a: ["SEOUL", "BUSAN", "INCHEON", "DAEGU"], c: 0 },
            { q: "WELCHES GEBIRGE TRENNT EUROPA UND ASIEN TEILWEISE?", a: ["PYRENÄEN", "URAL", "ALPEN", "ANDEN"], c: 1 },
            { q: "WELCHES MEER LIEGT ZWISCHEN ARABIEN UND AFRIKA?", a: ["SCHWARZES MEER", "ROTES MEER", "KASPISCHES MEER", "BALTISCHE SEE"], c: 1 },
            { q: "WELCHER STAAT IST KEIN TEIL SÜDOSTASIENS?", a: ["LAOS", "VIETNAM", "NEPAL", "THAILAND"], c: 2 },
            { q: "WELCHER FLUSS IST DER LÄNGSTE IN CHINA?", a: ["MEKONG", "JANGTSE", "GANGES", "AMUR"], c: 1 },
          ],
          // AMERIKA
          [
            { q: "WELCHE STADT IST HAUPTSTADT VON KANADA?", a: ["TORONTO", "OTTAWA", "MONTREAL", "VANCOUVER"], c: 1 },
            { q: "WELCHER OZEAN LIEGT AN DER WESTKÜSTE DER USA?", a: ["ATLANTIK", "PAZIFIK", "INDISCHER OZEAN", "ARKTISCHER OZEAN"], c: 1 },
            { q: "WELCHES LAND HAT KEINEN ANTEIL AM AMAZONASBECKEN?", a: ["BRASILIEN", "PERU", "CHILE", "KOLUMBIEN"], c: 2 },
            { q: "WELCHER STAAT LIEGT NICHT IN MITTELAMERIKA?", a: ["PANAMA", "HONDURAS", "KUBA", "GUATEMALA"], c: 2 },
            { q: "WELCHER GEBIRGSZUG LÄUFT ENTLANG DER WESTSEITE SÜDAMERIKAS?", a: ["ROCKY MOUNTAINS", "ALPEN", "ANDEN", "HIMALAYA"], c: 2 },
          ],
          // KARTEN & CO.
          [
            { q: "WELCHE LINIE MARKIERT 0° BREITENGRAD?", a: ["NORDPOLARKREIS", "ÄQUATOR", "NULLMERIDIAN", "WENDEKREIS"], c: 1 },
            { q: "WELCHER MERIDIAN IST 0° LÄNGENGRAD (HIST.)?", a: ["BERLIN", "PARIS", "GREENWICH", "ROM"], c: 2 },
            { q: "WAS VERZERRT DIE MERKATOR-PROJEKTION BESONDERS?", a: ["FLÄCHEN IN POLNÄHE", "ZEITZONEN", "HÖHEN", "WIND"], c: 0 },
            { q: "WELCHE KOORDINATE ÄNDERT SICH, WENN MAN NACH OSTEN GEHT?", a: ["BREITENGRAD", "LÄNGENGRAD", "HÖHENMETER", "TIEFE"], c: 1 },
            { q: "WELCHER BEGRIFF BEZEICHNET 'HÖHENLINIEN' AUF KARTEN?", a: ["ISOBAR", "ISOHYPSEN", "ISOTHERME", "ISOGONE"], c: 1 },
          ],
        ],
      };

    // =========================
    // QUIZ 4 — LITERATUR, KUNST, MUSIK
    // =========================
    case 4:
      return {
        categories: ["LITERATUR", "KUNST", "MUSIK", "MYTHEN", "SPRACHE"],
        clues: [
          // LITERATUR
          [
            { q: "WER SCHRIEB 'DIE VERWANDLUNG'?", a: ["THOMAS MANN", "FRANZ KAFKA", "HESSE", "BRECHT"], c: 1 },
            { q: "WELCHER AUTOR SCHRIEB '1984'?", a: ["ORWELL", "HUXLEY", "BRADBURY", "TOLKIEN"], c: 0 },
            { q: "WELCHE FIGUR GEHÖRT ZU DANTES 'GÖTTLICHER KOMÖDIE'?", a: ["BEATRICE", "OPHELIA", "DULCINEA", "ANNA KARENINA"], c: 0 },
            { q: "WELCHES WERK IST VON HOMER?", a: ["AENEIS", "ODYSSEE", "METAMORPHOSEN", "FAUST"], c: 1 },
            { q: "WELCHER BEGRIFF PASST ZU 'UNZUVERLÄSSIGER ERZÄHLER'?", a: ["DRAMATURGIE", "ERZÄHLTHEORIE", "VERSMASS", "ALLITERATION"], c: 1 },
          ],
          // KUNST
          [
            { q: "WER MALTE DIE 'MONA LISA'?", a: ["MICHELANGELO", "LEONARDO DA VINCI", "RAPHAEL", "CARAVAGGIO"], c: 1 },
            { q: "WELCHE STILRICHTUNG GEHÖRT ZU MONET?", a: ["IMPRESSIONISMUS", "KUBISMUS", "SURREALISMUS", "BAROCK"], c: 0 },
            { q: "WELCHER KÜNSTLER IST BEKANNT FÜR 'GUERNICA'?", a: ["DALÍ", "PICASSO", "VAN GOGH", "KLEE"], c: 1 },
            { q: "WELCHER BAUSTIL HAT TYPISCH SPITZBÖGEN?", a: ["ROMANIK", "GOTIK", "RENAISSANCE", "KLASSIZISMUS"], c: 1 },
            { q: "WAS IST EIN 'TRIPTYCHON'?", a: ["DREITEILIGES BILDWERK", "STEINART", "MUSIKFORM", "TANZ"], c: 0 },
          ],
          // MUSIK
          [
            { q: "WELCHES INSTRUMENT HAT 6 SAITEN (STANDARD)?", a: ["VIOLINE", "GITARRE", "CELLO", "HARFE"], c: 1 },
            { q: "WER KOMPONIERTE 'EINE KLEINE NACHTMUSIK'?", a: ["BACH", "MOZART", "BEETHOVEN", "HAYDN"], c: 1 },
            { q: "WAS IST EIN 'ADAGIO'?", a: ["SCHNELL", "LANGSAM", "LAUT", "LEISE"], c: 1 },
            { q: "WELCHE TONART HAT KEINE KREUZE/BE’s (C-DUR)?", a: ["C-DUR", "G-DUR", "F-DUR", "D-DUR"], c: 0 },
            { q: "WELCHE FORM HAT TYPISCH 'A–B–A'?", a: ["RONDO", "DA-CAPO-ARIA", "FUGE", "KADENZ"], c: 1 },
          ],
          // MYTHEN
          [
            { q: "WER IST DER GOTTBOTe IM GRIECHISCHEN PANTHEON?", a: ["ARES", "HERMES", "POSEIDON", "HADES"], c: 1 },
            { q: "WELCHER HELD BESIEGTE DEN MINOTAURUS?", a: ["THESEUS", "PERSEUS", "ACHILLES", "ODYSSEUS"], c: 0 },
            { q: "WELCHE GESTALT IST IN DER NORDISCHEN MYTHOLOGIE DER DONNERGOTT?", a: ["ODIN", "THOR", "LOKI", "FREYR"], c: 1 },
            { q: "WELCHE FIGUR KÖNNTE 'SIRENEN' TREFFEN?", a: ["ODYSSEUS", "AENEAS", "ROMULUS", "GILGAMESCH"], c: 0 },
            { q: "WELCHER BEGRIFF BEZEICHNET EINE 'URERZÄHLUNG' ZUR WELTERKLÄRUNG?", a: ["METAPHEr", "MYTHOS", "ELEGIE", "SATIRE"], c: 1 },
          ],
          // SPRACHE
          [
            { q: "WAS IST EIN 'PALINDROM'?", a: ["WORT VOR/RÜCKWÄRTS GLEICH", "REIMSCHEMA", "FREMDWORT", "SPRACHFEHLER"], c: 0 },
            { q: "WIE HEISST DIE LEHRE VON LAUTEN (SPRACHE)?", a: ["MORPHOLOGIE", "PHONETIK/PHONOLOGIE", "SYNTAX", "SEMANTIK"], c: 1 },
            { q: "WELCHES IST EIN OXYMORON?", a: ["BITTERKALT", "HAUSBAUM", "LAUTLEISE", "GROSSKLEIN"], c: 0 },
            { q: "WAS BESCHREIBT 'ETYMOLoGIE'?", a: ["WORTHERKUNFT", "RECHTSCHREIBUNG", "SÄTZE BAUEN", "AUSSPRACHE"], c: 0 },
            { q: "WELCHE SPRACHFAMILIE IST DEUTSCH?", a: ["ROMANISCH", "SLAVISCH", "GERMANISCH", "URALO-ALTAISCH"], c: 2 },
          ],
        ],
      };

    // =========================
    // QUIZ 5 — TECHNIK & INFORMATIK
    // =========================
    case 5:
      return {
        categories: ["NETZWERK", "CODE", "HARDWARE", "SICHERHEIT", "LOGIK IN IT"],
        clues: [
          // NETZWERK
          [
            { q: "WOFÜR STEHT 'IP'?", a: ["INTERNET PROTOCOL", "INPUT PROCESS", "INTERNAL PORT", "INSTANT PACKET"], c: 0 },
            { q: "WELCHER PORT IST TYPISCH FÜR HTTPS?", a: ["21", "53", "80", "443"], c: 3 },
            { q: "WAS MACHT DNS PRIMÄR?", a: ["VERSCHLÜSSELN", "NAMEN→IP AUFLÖSEN", "DATEIEN SPEICHERN", "WLAN VERSTÄRKEN"], c: 1 },
            { q: "WELCHES PROTOKOLL IST VERBINDUNGSLOS?", a: ["TCP", "UDP", "TLS", "SSH"], c: 1 },
            { q: "WAS IST 'NAT' AM BESTEN?", a: ["ZEIT-SYNC", "IP-ÜBERSETZUNG ROUTER-SEITIG", "DATEI-KOMPRESS", "VIRUS-SCAN"], c: 1 },
          ],
          // CODE
          [
            { q: "WELCHER DATENTYP IST WAHR/FALSCH?", a: ["STRING", "BOOLEAN", "FLOAT", "OBJECT"], c: 1 },
            { q: "WAS IST EIN 'ARRAY'?", a: ["BILD", "LISTE/SEQUENZ", "NETZWERK", "PROTOKOLL"], c: 1 },
            { q: "WAS BEDEUTET 'BIG-O'?", a: ["SPEICHERORT", "LAUFZEITKOMPLEXITÄT", "CPU-TYP", "DATEIFORMAT"], c: 1 },
            { q: "WELCHE STRUKTUR IST LIFO?", a: ["QUEUE", "STACK", "TREE", "GRAPH"], c: 1 },
            { q: "WAS IST 'REKURSION'?", a: ["SCHLEIFE", "FUNKTION RUFT SICH SELBST", "KOMPILIEREN", "Verschlüsselung"], c: 1 },
          ],
          // HARDWARE
          [
            { q: "WOFÜR IST RAM PRIMÄR?", a: ["DAUERHAFTE SPEICHERUNG", "KURZZEIT-SPEICHER", "NETZWERK", "GRAFIK-AUSGABE"], c: 1 },
            { q: "WELCHE KOMPONENTE FÜHRT INSTRUKTIONEN AUS?", a: ["SSD", "CPU", "NETZTEIL", "MONITOR"], c: 1 },
            { q: "WAS IST DER VORTEIL VON SSD GEGENÜBER HDD?", a: ["MEHR MAGNETISCH", "SCHNELLERE ZUGRIFFE", "BRAUCHT MEHR STROM", "NUR FÜR SERVER"], c: 1 },
            { q: "WELCHE SCHNITTSTELLE IST FÜR GRAFIK KLASsISCH?", a: ["HDMI/DISPLAYPORT", "RJ45", "SATA", "AUX"], c: 0 },
            { q: "WAS IST 'CACHE' BEI CPUs?", a: ["LANGSAME PLATTE", "SCHNELLER ZWISCHENSPEICHER", "NETZWERKTREIBER", "KÜHLPASTE"], c: 1 },
          ],
          // SICHERHEIT
          [
            { q: "WAS IST 2FA?", a: ["ZWEI FIREWALLS", "ZWEI-FAKTOR-AUTHENTIFIZIERUNG", "ZWEI-FACH BACKUP", "ZWEI-FACH LOGIN"], c: 1 },
            { q: "WAS IST 'PHISHING'?", a: ["HARDWAREFEHLER", "BETRUG DURCH FAKE-NACHRICHTEN", "VIREN-UPDATE", "WLAN-VERSTÄRKUNG"], c: 1 },
            { q: "WAS MACHT 'HASHING'?", a: ["REVERSIBLE VERSCHLÜSSELUNG", "EINWEG-ABDRUCK", "VIDEO-KOMPRESS", "IP-WECHSEL"], c: 1 },
            { q: "WELCHES PRINZIP MINIMIERT RECHTE?", a: ["OPEN ACCESS", "LEAST PRIVILEGE", "ZERO LOGIN", "FULL TRUST"], c: 1 },
            { q: "WAS IST EIN 'MAN-IN-THE-MIDDLE' ANGReIF?", a: ["PC-STROMAUSFALL", "ABHÖREN/MODIFIZIEREN ZWISCHENPARTNER", "PASSWORT LÄNGE", "ANTIVIRUS"], c: 1 },
          ],
          // LOGIK IN IT
          [
            { q: "WAS BEDEUTET 'TRUE AND FALSE'?", a: ["TRUE", "FALSE", "ERROR", "NULL"], c: 1 },
            { q: "WAS IST 'IDEMPOTENT' (HTTP/Mathe)?", a: ["WIEDERHOLUNG ÄNDERT ERGEBNIS", "WIEDERHOLUNG ÄNDERT NICHTS", "NUR EINMAL", "ZUFÄLLIG"], c: 1 },
            { q: "WELCHER SUCHALGO IST O(log n) AUF SORTIERTEN DATEN?", a: ["LINEARE SUCHE", "BINÄRE SUCHE", "BUBBLESORT", "DFS"], c: 1 },
            { q: "WELCHER GRAPH-ALGO FINDET KÜRZESTE WEGE (NICHTNEGATIVE KANTEN)?", a: ["DIJKSTRA", "PRIM", "KRUSKAL", "FLOYD NUR"], c: 0 },
            { q: "WELCHES CONCEPT VERHINDERT RACE CONDITIONS?", a: ["MUTEX/LOCK", "PRINT()", "CACHE", "DNS"], c: 0 },
          ],
        ],
      };

    // =========================
    // QUIZ 6 — MATHE & LOGIK (SCHWER)
    // =========================
    case 6:
      return {
        categories: ["ARITHMETIK", "ALGEBRA", "GEOMETRIE", "WAHRSCHEINLICH.", "LOGIKRÄTSEL"],
        clues: [
          // ARITHMETIK
          [
            { q: "WIE VIEL IST 17×19?", a: ["323", "307", "361", "289"], c: 0 }, // 17*19=323
            { q: "WIE VIEL IST 2^10?", a: ["512", "1024", "2048", "256"], c: 1 },
            { q: "WIE VIEL IST 0,125 ALS BRUCH?", a: ["1/4", "1/8", "1/16", "1/32"], c: 1 },
            { q: "WIE VIEL IST 1/3 + 1/6?", a: ["1/2", "2/3", "1/6", "5/6"], c: 0 },
            { q: "WIE VIEL IST 7! (FAKULTÄT)?", a: ["720", "5040", "40320", "120"], c: 1 },
          ],
          // ALGEBRA
          [
            { q: "LÖSE: 3x − 7 = 11", a: ["x=2", "x=4", "x=6", "x=8"], c: 1 },
            { q: "LÖSE: 2(x+3)=18", a: ["x=3", "x=6", "x=9", "x=12"], c: 1 },
            { q: "WAS IST DIE NULLSTELLE VON f(x)=x²−9?", a: ["x=3", "x=−3", "x=±3", "x=0"], c: 2 },
            { q: "VEREINFACHE: (a²·a³)/a²", a: ["a³", "a⁵", "a", "a⁷"], c: 0 },
            { q: "WELCHE LÖSUNG HAT: x²−5x+6=0?", a: ["x=2 ODER 3", "x=1 ODER 6", "x=−2 ODER −3", "x=0"], c: 0 },
          ],
          // GEOMETRIE
          [
            { q: "INNENWINKELSUMME DREIECK?", a: ["90°", "180°", "270°", "360°"], c: 1 },
            { q: "FLÄCHE KREIS (r=3):", a: ["6π", "9π", "12π", "18π"], c: 1 },
            { q: "SATZ DES PYTHAGORAS GILT IN…", a: ["BELIEBIGEM DREIECK", "GLEICHSCHENKLIG", "RECHTWINKLIG", "GLEICHSEITIG"], c: 2 },
            { q: "VOLUMEN WÜRFEL (KANTE 4):", a: ["16", "32", "48", "64"], c: 3 },
            { q: "WIE VIELE DIAGONALEN HAT EIN ACHTECK?", a: ["20", "24", "28", "32"], c: 1 }, // n(n-3)/2=8*5/2=20 -> oh! correct is 20
          ],
          // fix last: diagonal count for octagon is 20, adjust options/c index
        ],
      };

    default:
      break;
  }

  // If quizId not 1-6
  return {
    categories: ["KAT 1", "KAT 2", "KAT 3", "KAT 4", "KAT 5"],
    clues: Array.from({ length: 5 }, () =>
      Array.from({ length: 5 }, () => ({ q: "FEHLENDE FRAGE", a: ["A", "B", "C", "D"], c: 0 }))
    ),
  };
}

// --- Patch: Quiz 6 had one corrected item and missing categories (continue here properly)
function getQuestionBankFixed(quizId){
  if (quizId !== 6) return getQuestionBank(quizId);

  return {
    categories: ["ARITHMETIK", "ALGEBRA", "GEOMETRIE", "WAHRSCHEINLICH.", "LOGIKRÄTSEL"],
    clues: [
      // ARITHMETIK
      [
        { q: "WIE VIEL IST 17×19?", a: ["323", "307", "361", "289"], c: 0 },
        { q: "WIE VIEL IST 2^10?", a: ["512", "1024", "2048", "256"], c: 1 },
        { q: "WIE VIEL IST 0,125 ALS BRUCH?", a: ["1/4", "1/8", "1/16", "1/32"], c: 1 },
        { q: "WIE VIEL IST 1/3 + 1/6?", a: ["1/2", "2/3", "1/6", "5/6"], c: 0 },
        { q: "WIE VIEL IST 7! (FAKULTÄT)?", a: ["720", "5040", "40320", "120"], c: 1 },
      ],
      // ALGEBRA
      [
        { q: "LÖSE: 3x − 7 = 11", a: ["x=2", "x=4", "x=6", "x=8"], c: 1 },
        { q: "LÖSE: 2(x+3)=18", a: ["x=3", "x=6", "x=9", "x=12"], c: 1 },
        { q: "WAS IST DIE NULLSTELLE VON f(x)=x²−9?", a: ["x=3", "x=−3", "x=±3", "x=0"], c: 2 },
        { q: "VEREINFACHE: (a²·a³)/a²", a: ["a³", "a⁵", "a", "a⁷"], c: 0 },
        { q: "LÖSUNGSMENGE: x²−5x+6=0", a: ["{2,3}", "{1,6}", "{−2,−3}", "{0}"], c: 0 },
      ],
      // GEOMETRIE
      [
        { q: "INNENWINKELSUMME IM DREIECK?", a: ["90°", "180°", "270°", "360°"], c: 1 },
        { q: "FLÄCHE KREIS (r=3):", a: ["6π", "9π", "12π", "18π"], c: 1 },
        { q: "PYTHAGORAS GILT BEI…", a: ["BELIEBIGEM DREIECK", "GLEICHSCHENKLIG", "RECHTWINKLIG", "GLEICHSEITIG"], c: 2 },
        { q: "VOLUMEN WÜRFEL (KANTE 4):", a: ["16", "32", "48", "64"], c: 3 },
        { q: "WIE VIELE DIAGONALEN HAT EIN ACHTECK?", a: ["20", "24", "28", "32"], c: 0 },
      ],
      // WAHRSCHEINLICHKEIT
      [
        { q: "MÜNZWURF: WAHRSCHEINLICHKEIT FÜR KOPF?", a: ["1/3", "1/2", "2/3", "1/4"], c: 1 },
        { q: "ZWEI WÜRFE: P(DOPPEL-6)?", a: ["1/6", "1/12", "1/36", "1/18"], c: 2 },
        { q: "WÜRFEL: P(ZAHL ≥ 5)?", a: ["1/6", "2/6", "3/6", "4/6"], c: 1 },
        { q: "KARTE AUS 52: P(ASS)?", a: ["1/13", "1/26", "4/13", "1/52"], c: 0 },
        { q: "UNABHÄNGIG: P(A ∩ B) =", a: ["P(A)+P(B)", "P(A)·P(B)", "P(A)−P(B)", "P(A)/P(B)"], c: 1 },
      ],
      // LOGIKRÄTSEL
      [
        { q: "WENN ALLE A SIND B UND ALLE B SIND C, DANN…", a: ["ALLE C SIND A", "ALLE A SIND C", "KEIN A IST C", "MAN KANN NICHTS SAGEN"], c: 1 },
        { q: "NICHT (A UND B) IST ÄQUIVALENT ZU…", a: ["(¬A) ODER (¬B)", "(¬A) UND (¬B)", "A ODER B", "A UND (¬B)"], c: 0 },
        { q: "EIN ZUG: 'ALLE RABEN SIND SCHWARZ'. EIN GRÜNER APFEL…", a: ["WIDERLEGT", "BESTÄTIGT", "IST IRRELEVANT", "BEWEIST"], c: 2 },
        { q: "WELCHER SCHLUSS IST GÜLTIG? (MODUS PONENS)", a: ["WENN P→Q UND P, DANN Q", "WENN P→Q UND Q, DANN P", "WENN P ODER Q, DANN P", "WENN NICHT P, DANN Q"], c: 0 },
        { q: "PARADOX: 'DIESER SATZ IST FALSCH' IST EIN…", a: ["TAUTOLOGIE", "ANTINOMIE/PARADOX", "AXIOM", "SYLLOGISMUS"], c: 1 },
      ],
    ],
  };
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

  let state = loadState(quizId);
  if (!state) {
    state = { score: 0, used: {} };
    saveState(quizId, state);
  }

  let current = null; // {cat,row,value,clue}

  function keyFor(cat, row) { return `${cat}-${row}`; }

  function renderScore() {
    scoreEl.textContent = `SCORE: ${state.score}`;
  }

  function buildBoard() {
    boardEl.innerHTML = "";
    boardEl.style.setProperty("--cols", String(bank.categories.length));

    // Kategorie-Header
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

    modalMeta.textContent = `${bank.categories[cat]} • ${current.value} PUNKTE`;
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

    if (ok) {
      state.score += current.value;
      modalFeedback.innerHTML = `✅ <strong>Richtig.</strong> +${current.value}`;
      statusEl.innerHTML = `✅ ${bank.categories[current.cat]} (${current.value}): richtig (+${current.value}).`;
    } else {
      state.score -= current.value;
      modalFeedback.innerHTML = `❌ <strong>Falsch.</strong> -${current.value} — richtig: <strong>${current.clue.a[correctIndex]}</strong>`;
      statusEl.innerHTML = `❌ ${bank.categories[current.cat]} (${current.value}): falsch (-${current.value}). Richtig: <strong>${current.clue.a[correctIndex]}</strong>`;
    }

    lockChoices(correctIndex, selectedIndex);
    saveState(quizId, state);
    renderScore();
    markUsed();

    if (allUsed()) {
      statusEl.innerHTML = `🎉 <strong>BOARD FERTIG!</strong> Endscore: <strong>${state.score}</strong>`;
    }
  });

  // X schließt immer
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
    state = { score: 0, used: {} };
    saveState(quizId, state);

    renderScore();
    buildBoard();
    statusEl.textContent = "Reset: Neues Spiel gestartet.";
    current = null;

    if (modal.open) modal.close();
  });

  renderScore();
  buildBoard();
  statusEl.textContent = "Wähle ein Feld, um zu starten.";
}

document.addEventListener("DOMContentLoaded", init);