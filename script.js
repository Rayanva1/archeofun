/* ============================================================
   ARCHEOFUN — Full App Script
   Big web app (explore, history, civs, quiz, memory, AncientAI)
   + 5-level Adventure game added as a game mode
============================================================ */

/* ── TRANSLATIONS ── */
const TRANSLATIONS = {
  en: {
    "nav.home":"Home","nav.explore":"Explore","nav.history":"History",
    "nav.civilizations":"Civilizations","nav.games":"Games",
    "home.title1":"Uncover","home.title2":"Ancient Worlds",
    "home.subtitle":"Explore real archaeological sites, learn about ancient civilizations, and become a Master Archaeologist.",
    "home.cta":"Start Adventure","home.feat1":"Explore Sites","home.feat1desc":"Discover real archaeological sites across the ancient world.",
    "home.feat2":"Learn History","home.feat2desc":"Understand how archaeology works and why it matters.",
    "home.feat3":"Civilizations","home.feat3desc":"Journey through Egypt, Rome, Morocco, the Maya and beyond.",
    "home.feat4":"Play & Learn","home.feat4desc":"Quizzes, memory games and a full ArcheoVenture!",
    "home.why":"Why Archaeology?","home.whydesc":"Archaeology connects us to our shared human story. Every artifact, every ruin, every ancient coin is a message from the past — waiting to be read.",
    "home.stat1":"Years of History","home.stat2":"Sites to Explore","home.stat3":"Game Levels",
    "explore.subtitle":"Tap any site to learn more about it",
    "games.quiz":"Artifact Quiz","games.quizDesc":"Identify artifacts, beat the timer, score big!",
    "games.memory":"Memory Match","games.memoryDesc":"Flip cards to match artifact pairs!",
    "games.siteQuiz":"Site Challenge","games.siteQuizDesc":"Name that archaeological site!",
    "games.siteHint":"Look carefully — architecture, landscape and style are all clues!",
    "quiz.chooseLevel":"Choose Difficulty",
  },
  fr: {
    "nav.home":"Accueil","nav.explore":"Explorer","nav.history":"Histoire",
    "nav.civilizations":"Civilisations","nav.games":"Jeux",
    "home.title1":"Découvrir","home.title2":"les Mondes Anciens",
    "home.subtitle":"Explorez de vrais sites archéologiques, découvrez les civilisations et devenez Maître Archéologue.",
    "home.cta":"Commencer l'Aventure","home.feat1":"Explorer","home.feat1desc":"Découvrez de vrais sites archéologiques.",
    "home.feat2":"Apprendre","home.feat2desc":"Comprendre comment fonctionne l'archéologie.",
    "home.feat3":"Civilisations","home.feat3desc":"Voyagez à travers l'Égypte, Rome, le Maroc et plus.",
    "home.feat4":"Jouer & Apprendre","home.feat4desc":"Quiz, jeux de mémoire et aventure à 5 niveaux!",
    "home.why":"Pourquoi l'archéologie?","home.whydesc":"L'archéologie nous connecte à notre histoire commune.",
    "home.stat1":"Ans d'Histoire","home.stat2":"Sites à Explorer","home.stat3":"Niveaux de Jeu",
    "explore.subtitle":"Appuyez sur un site pour en savoir plus",
    "games.quiz":"Quiz d'Artefacts","games.quizDesc":"Identifiez les artefacts, battez le chrono!",
    "games.memory":"Mémoire","games.memoryDesc":"Retournez les cartes pour trouver les paires!",
    "games.siteQuiz":"Défi Sites","games.siteQuizDesc":"Identifiez ce site archéologique!",
    "games.siteHint":"Regardez attentivement — l'architecture et le paysage sont des indices!",
    "quiz.chooseLevel":"Choisir la Difficulté",
  },
  ar: {
    "nav.home":"الرئيسية","nav.explore":"استكشاف","nav.history":"التاريخ",
    "nav.civilizations":"الحضارات","nav.games":"الألعاب",
    "home.title1":"اكتشف","home.title2":"العوالم القديمة",
    "home.subtitle":"استكشف مواقع أثرية حقيقية وتعلّم عن الحضارات القديمة.",
    "home.cta":"ابدأ المغامرة","home.feat1":"استكشاف المواقع","home.feat1desc":"اكتشف مواقع أثرية حقيقية حول العالم.",
    "home.feat2":"تعلّم التاريخ","home.feat2desc":"افهم كيف يعمل علم الآثار.",
    "home.feat3":"الحضارات","home.feat3desc":"رحلة عبر مصر وروما والمغرب والمايا.",
    "home.feat4":"العب وتعلّم","home.feat4desc":"اختبارات وألعاب ذاكرة ومغامرة من 5 مستويات!",
    "home.why":"لماذا علم الآثار؟","home.whydesc":"يربطنا علم الآثار بقصتنا الإنسانية المشتركة.",
    "home.stat1":"سنوات من التاريخ","home.stat2":"مواقع للاستكشاف","home.stat3":"مستويات اللعبة",
    "explore.subtitle":"اضغط على أي موقع لمعرفة المزيد",
    "games.quiz":"اختبار الآثار","games.quizDesc":"حدد الآثار واكسب النقاط!",
    "games.memory":"لعبة الذاكرة","games.memoryDesc":"اقلب البطاقات لإيجاد الأزواج!",
    "games.siteQuiz":"تحدي المواقع","games.siteQuizDesc":"حدد الموقع الأثري!",
    "games.siteHint":"انظر بعناية — العمارة والمشهد الطبيعي أدلة!",
    "quiz.chooseLevel":"اختر المستوى",
  }
};
let currentLang = 'en';
function t(key) { return TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.en[key] || key; }
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = currentLang;
  updateSitesForLang();
  if (window._exploreInit) renderSites(getCurrentSites());
}
function setLang(lang) {
  currentLang = lang;
  document.getElementById('currentLangLabel').textContent = lang.toUpperCase();
  updateSitesForLang();
  applyTranslations();
  closeLangMenu();
  // Re-render sites if explore page was already init'd
  if (window._exploreInit) {
    SITES = getCurrentSites();
    renderSites(SITES);
  }
}

/* ── PAGE NAVIGATION ── */
let currentPage = 'home';
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const page = document.getElementById(pageId);
  if (page) page.classList.add('active');
  document.querySelectorAll(`[data-page="${pageId}"]`).forEach(l => l.classList.add('active'));
  currentPage = pageId;
  window.scrollTo({top:0,behavior:'smooth'});
  document.body.classList.remove('nav-open');
  // lazy init
  if (pageId === 'explore' && !window._exploreInit) { window._exploreInit = true; renderSites(getCurrentSites()); updateSitesForLang(); }
  if (pageId === 'history' && !window._historyInit) { window._historyInit = true; renderHistory(); }
  if (pageId === 'civilizations' && !window._civInit) { window._civInit = true; renderCivs(); }
  if (pageId === 'games' && !window._gamesInit) { window._gamesInit = true; }
}

/* ── THEME ── */
document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  document.getElementById('themeToggle').textContent = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
});

/* ── LANG MENU ── */
document.getElementById('langToggle').addEventListener('click', () => {
  const dd = document.getElementById('langDropdown');
  dd.classList.toggle('active');
  document.getElementById('langToggle').setAttribute('aria-expanded', dd.classList.contains('active'));
});
function closeLangMenu() { document.getElementById('langDropdown').classList.remove('active'); }
document.querySelectorAll('.lang-choice').forEach(btn => btn.addEventListener('click', () => setLang(btn.dataset.lang)));
document.addEventListener('click', e => { if (!e.target.closest('.lang-menu')) closeLangMenu(); });

/* ── MOBILE NAV ── */
document.getElementById('navMenuToggle').addEventListener('click', () => {
  document.body.classList.toggle('nav-open');
  document.getElementById('navMenuToggle').setAttribute('aria-expanded', document.body.classList.contains('nav-open'));
});

/* ── SCROLL TO TOP ── */
window.addEventListener('scroll', () => {
  document.getElementById('scrollTopBtn').classList.toggle('visible', window.scrollY > 300);
});

/* ── AGE SELECTION ── */
let currentAgeMode = 'adult';
function showAgeSelection() {
  const el = document.getElementById('ageSelection');
  el.classList.add('show');
}
function selectAge(age) {
  currentAgeMode = age;
  sessionStorage.setItem('archeoventure_age', age);
  document.getElementById('ageSelection').classList.remove('show');
  document.body.classList.remove('kid-mode', 'mode-kid', 'mode-teen');
  if (age === 'kid') document.body.classList.add('kid-mode');
  // Update the 👤 chip label
  const chip = document.getElementById('navAgeChip');
  if (chip) chip.textContent = age === 'kid' ? '🧒 Kid' : '🧑 Teen';
}
document.addEventListener('DOMContentLoaded', () => {
  // Only show once per session
  if (!sessionStorage.getItem('archeoventure_age')) {
    setTimeout(() => document.getElementById('ageSelection').classList.add('show'), 600);
  } else {
    selectAge(sessionStorage.getItem('archeoventure_age'));
  }
});

/* ── DID YOU KNOW ── */
const DYK = [
  "The oldest known archaeological site is over 3.3 million years old — in Kenya!",
  "Morocco's Volubilis was once home to 20,000 people under Roman rule.",
  "The Great Pyramid was the world's tallest structure for 3,800 years.",
  "Archaeologists use carbon-14 dating to tell how old organic objects are.",
  "Machu Picchu was never found by Spanish conquistadors.",
  "The word 'archaeology' comes from Greek: arkhaios (ancient) + logos (study).",
  "Zellige mosaic art from Morocco dates back to the 10th century.",
  "Over 8,000 unique terracotta warriors guard Emperor Qin Shi Huang's tomb.",
];
function showDYK() {
  const toast = document.getElementById('didYouKnow');
  document.getElementById('dykText').textContent = DYK[Math.floor(Math.random()*DYK.length)];
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 8000);
}
setTimeout(showDYK, 5000);
setInterval(showDYK, 45000);

/* ── ACHIEVEMENT NOTIFICATION ── */
function showAchievement(icon, title, desc) {
  document.getElementById('achievementIcon').textContent = icon;
  document.getElementById('achievementTitle').textContent = title;
  document.getElementById('achievementDesc').textContent = desc;
  const n = document.getElementById('achievementNotification');
  n.classList.add('show');
  setTimeout(() => n.classList.remove('show'), 4000);
}

/* ══════════════════════════════════════════════
   EXPLORE PAGE
══════════════════════════════════════════════ */
const sites = {
    en: [
        { name:"Volubilis", country:"Morocco", emoji:"🏛️", image:"images/volubilis.jpg", tags:["Roman","UNESCO","Morocco"], desc:"Best-preserved Roman city in Morocco — UNESCO World Heritage Site.", detail:"📍 Meknes, Morocco | 📅 3rd c. BC → Roman 40 AD\n\nOriginally a Berber capital, Volubilis became a major Roman city rich from olive oil trade. Features a basilica, forum, triumphal arch and luxurious villas. Its mosaics are among the finest in the Roman world.", fact:"Volubilis was once home to 20,000 people and capital of Roman Mauretania Tingitana.", period:"3rd c. BC – 3rd c. AD", type:"Roman ruins" },
        { name:"Lixus", country:"Morocco", emoji:"🏺", image:"images/lixus.jpg", tags:["Phoenician","Roman","Morocco"], desc:"Ancient Phoenician port — possibly the oldest city in Morocco.", detail:"📍 Larache, Morocco | 📅 c. 1200 BC → Roman period\n\nFounded by Phoenicians, Lixus may be older than Carthage. Under Rome it produced garum (fish sauce) at massive scale. Mythology links it to the Garden of the Hesperides.", fact:"Lixus is one of the oldest cities in Morocco — possibly older than Carthage.", period:"c. 1200 BC+", type:"Ancient port" },
        { name:"Chellah", country:"Morocco", emoji:"🕊️", image:"images/chellah.jpg", tags:["Roman","Medieval","Morocco","Merinid"], desc:"Roman Sala Colonia and medieval Marinid necropolis in Rabat.", detail:"📍 Rabat, Morocco | 📅 Roman (1st c. AD) → Merinid necropolis (1339)\n\nChellah combines Roman and Islamic history — from Sala Colonia to a royal burial complex. Storks nest every spring in the ancient minarets.", fact:"Storks nest every spring in Chellah's ancient minarets above the Roman ruins.", period:"1st c. AD – 14th c.", type:"Necropolis" },
        { name:"Aït Ben Haddou", country:"Morocco", emoji:"🏜️", image:"images/ait ben haddou.jpg", tags:["UNESCO","Morocco","Ksar","Medieval"], desc:"UNESCO ksar — iconic earthen fortress in the Draa Valley.", detail:"📍 Ouarzazate, Morocco | 📅 c. 17th century\n\nA traditional ksar of rammed earth controlling caravan routes between Sahara and Marrakech. Globally famous as a film location for Gladiator, Game of Thrones and many more.", fact:"Aït Ben Haddou has appeared in Gladiator, Game of Thrones, Babel and many Hollywood productions.", period:"c. 17th century", type:"Ksar" },
        { name:"Tamuda", country:"Morocco", emoji:"🛡️", image:"images/tamuda.jpg", tags:["Berber","Roman","Morocco"], desc:"Ancient Berber city and Roman camp near Tetouan.", detail:"📍 Tetouan, Morocco | 📅 3rd c. BC → Roman military camp\n\nBegan as a Berber city before the Romans rebuilt it as a fortified camp with towers, gates, barracks and baths. Reveals both local and Roman cultural influences.", fact:"Tamuda is one of Morocco's most important Roman military sites, revealing both Berber and Roman culture.", period:"3rd c. BC – 3rd c. AD", type:"Military camp" },
        { name:"Sijilmasa", country:"Morocco", emoji:"🐫", image:"images/sijilmasa.jpg", tags:["Medieval","Islamic","Morocco","Trade"], desc:"Legendary medieval golden city — northern gateway of trans-Saharan trade.", detail:"📍 Rissani, Morocco | 📅 Founded 757 AD\n\nOne of the richest cities of the medieval Islamic world, controlling trans-Saharan routes bringing gold and ivory from West Africa. Declined after the 14th century.", fact:"Sijilmasa was the northern terminus of the most profitable trade routes in medieval Africa.", period:"757 – 14th c. AD", type:"Medieval city" },
        { name:"Sala Colonia", country:"Morocco", emoji:"🏛️", image:"images/sala colonia.jpg", tags:["Roman","Morocco"], desc:"Southernmost Roman city in Morocco — now within Chellah, Rabat.", detail:"📍 Rabat, Morocco | 📅 c. 40 AD | 👑 Claudius\n\nThe southernmost Roman city in North Africa, marking the empire's frontier. Full Roman urban layout with forum, temples, baths and roads.", fact:"Sala Colonia marked the southernmost frontier of the entire Roman Empire in Africa.", period:"c. 40 AD", type:"Roman city" },
        { name:"Banasa", country:"Morocco", emoji:"📜", image:"images/banasa.jpg", tags:["Roman","Morocco"], desc:"Roman colony on the Sebou River — famous for the Tabula Banasitana.", detail:"📍 Sidi Kacem, Morocco | 📅 c. 30 BC | 👑 Augustus\n\nFounded as a Roman veterans' colony. Famous for the Tabula Banasitana — a bronze document recording Roman citizenship grants, key to understanding Roman administration in Africa.", fact:"The Tabula Banasitana discovered at Banasa is one of the most important Roman documents ever found in Africa.", period:"c. 30 BC – 3rd c. AD", type:"Roman colony" },
        { name:"Thamusida", country:"Morocco", emoji:"⚓", image:"images/thamusida.jpg", tags:["Roman","Berber","Morocco"], desc:"Roman river port on the Sebou — Berber, Carthaginian and Roman layers.", detail:"📍 Kenitra, Morocco | 📅 1st–3rd c. AD\n\nA rare site where Berber, Carthaginian, and Roman layers coexist. Important river port with military camp, residential zones, baths and temples.", fact:"Thamusida is one of the few sites in Morocco where three civilizations' remains are found together.", period:"1st–3rd c. AD", type:"River port" },
        { name:"Rirha", country:"Morocco", emoji:"🏺", image:"images/rirha.jpg", tags:["Berber","Roman","Islamic","Morocco"], desc:"Pre-Roman capital candidate — Berber, Roman and Islamic layers.", detail:"📍 Sidi Slimane, Morocco | 📅 4th c. BC → 14th c. AD\n\nA long-occupied site possibly the ancient city of Gilda. Reveals Roman mosaics, buildings and Islamic structures — a rare 1,700-year continuous timeline.", fact:"Rirha may have been continuously occupied for over 1,700 years across multiple civilizations.", period:"4th c. BC – 14th c. AD", type:"Ancient city" },
        { name:"Mogador", country:"Morocco", emoji:"🌊", image:"images/mogador.jpg", tags:["Phoenician","Roman","Morocco"], desc:"Phoenician island outpost — Essaouira island, 600 BC.", detail:"📍 Essaouira, Morocco | 📅 c. 600 BC\n\nPhoenician island outpost for Atlantic trade and exploration. Famous for producing Tyrian purple dye — one of the most valuable materials of antiquity. Represents the westernmost Phoenician expansion.", fact:"Tyrian purple dye from Mogador was worth more than gold by weight in the ancient world.", period:"c. 600 BC", type:"Island outpost" },
        { name:"Zilil", country:"Morocco", emoji:"⚓", image:"images/zilil.jpg", tags:["Phoenician","Roman","Morocco"], desc:"Phoenician port and Roman city near Asilah.", detail:"📍 Asilah, Morocco | 📅 before 5th c. BC → Roman period\n\nStarted as a Phoenician port, became a Roman colony near the Strait of Gibraltar. Forum, basilica, temples and baths visible.", fact:"Zilil was a key link between Atlantic and Mediterranean trade routes near the Strait of Gibraltar.", period:"5th c. BC – 3rd c. AD", type:"Port city" },
        { name:"Msoura", country:"Morocco", emoji:"🗿", image:"images/msoura.jpg", tags:["Prehistoric","Morocco","Megalith"], desc:"Megalithic stone circle near Asilah — Morocco's Stonehenge.", detail:"📍 Near Asilah, Morocco | 📅 3rd–4th c. BC\n\n168 standing stones arranged around a burial mound, some over 5 metres high. One of Africa's most mysterious monuments, often compared to Stonehenge.", fact:"Msoura's 168 standing stones may mark the tomb of a powerful ancient Berber king.", period:"3rd–4th c. BC", type:"Stone circle" },
        { name:"Tingis", country:"Morocco", emoji:"🌍", image:"images/tingis.jpg", tags:["Phoenician","Roman","Morocco"], desc:"Ancient Tangier — Phoenician, Roman and Berber capital.", detail:"📍 Tangier, Morocco | 📅 before 5th c. BC → Roman capital\n\nModern Tangier, a major Phoenician settlement and capital of the Roman province of Mauretania Tingitana. Gateway between Africa and Europe near the legendary Cave of Hercules.", fact:"Tangier (Tingis) is one of the oldest continuously inhabited cities in the world.", period:"5th c. BC+", type:"Ancient capital" },
        { name:"Taforalt Cave", country:"Morocco", emoji:"🏛️", image:"images/taforalt.jpg", tags:["Prehistoric","Morocco","Paleolithic"], desc:"Oldest funeral site in Africa — 17,000 years old.", detail:"📍 Berkane, Morocco | 📅 ~82,000 BC (occupation)\n\nContains one of the oldest burial sites in Africa with human remains 17,000 years old. Also holds the earliest known jewelry made from shells — key insight into prehistoric ritual.", fact:"Taforalt contains shell beads 82,000 years old — the world's oldest known jewelry.", period:"~82,000 BC", type:"Prehistoric cave" },
        { name:"Jebel Irhoud", country:"Morocco", emoji:"🧬", image:"images/jebel irhoud.jpg", tags:["Prehistoric","Morocco","Human Origins"], desc:"Birthplace of Homo sapiens — 300,000 years old.", detail:"📍 Youssoufia, Morocco | 📅 ~300,000 BC\n\nOne of the most important prehistoric sites in the world. Fossils here are the oldest known Homo sapiens remains, pushing back human origins by 100,000 years. Evidence of fire use shows early advanced behaviour.", fact:"Jebel Irhoud pushed back the origin of Homo sapiens to 300,000 years ago — 100,000 years earlier than thought.", period:"~300,000 BC", type:"Prehistoric site" },
        { name:"Ksar es-Seghir", country:"Morocco", emoji:"🛡️", image:"images/ksar es seghir.jpg", tags:["Islamic","Medieval","Morocco","Portuguese"], desc:"Medieval Islamic and Portuguese fortress on the Strait of Gibraltar.", detail:"📍 Northern Morocco | 📅 9th–15th c. → Portuguese 1458–1550\n\nPreserves both a medieval Islamic town and a later Portuguese fortress. Houses, mosques, baths and churches coexist — a unique record of Islamic–European interaction.", fact:"Ksar es-Seghir is one of the few sites where Islamic and Portuguese-Christian structures share the same walls.", period:"9th–16th c.", type:"Fortified town" },
        { name:"Tinmel Mosque", country:"Morocco", emoji:"🕌", image:"images/tinmel.jpg", tags:["Islamic","Almohad","Morocco","Medieval"], desc:"12th-century Almohad mosque in the High Atlas Mountains.", detail:"📍 High Atlas Mountains | 📅 c. 1156 AD\n\nSpiritual center of the Almohad movement and model for later mosques including the Koutoubia in Marrakech. Built in a remote mountain location symbolising religious reform and power.", fact:"Tinmel Mosque served as the direct prototype for the famous Koutoubia Mosque in Marrakech.", period:"c. 1156 AD", type:"Medieval mosque" },
        { name:"Cotta", country:"Morocco", emoji:"🏛️", image:"images/cotta.jpg", tags:["Roman","Morocco"], desc:"Roman garum factory on the Atlantic coast near Tangier.", detail:"📍 Near Tangier, Morocco | 📅 1st–3rd c. AD\n\nRoman industrial complex for fish processing and garum production. Large salting vats still visible today. Offers a rare look at ancient industrial food production exported across the empire.", fact:"Cotta produced garum — the ancient world's most popular condiment, exported across the entire Roman Empire.", period:"1st–3rd c. AD", type:"Industrial site" },
        { name:"Moulay Idriss Zerhoun", country:"Morocco", emoji:"🕌", image:"images/moulay idriss.jpg", tags:["Islamic","Morocco","Pilgrimage"], desc:"Morocco's holiest city — tomb of Idris I, founder of the first Islamic dynasty.", detail:"📍 Near Meknes, Morocco | 📅 Founded 788 AD | 👑 Idris I\n\nFounded by Idris I who established the first Islamic dynasty in Morocco. Overlooks the ruins of Volubilis, symbolising the shift from Roman to Islamic civilisation.", fact:"Moulay Idriss Zerhoun was closed to non-Muslims until 2005 — Morocco's most sacred city.", period:"788 AD+", type:"Sacred city" },
        { name:"Pompeii", country:"Italy", emoji:"🌋", image:"images/pompeii.avif", tags:["Roman","UNESCO","Italy"], desc:"Ancient Roman city frozen in time by the eruption of Vesuvius in 79 AD.", detail:"A thriving city of 20,000 people buried under 6 metres of ash in just 18 hours on 24 August 79 AD. Forgotten for 1,700 years then rediscovered in 1748. Provides the most vivid picture of daily Roman life anywhere — intact streets, bakeries with bread still in ovens, and body casts of victims.", fact:"Pompeii was buried so fast that bread was still in the ovens when it was rediscovered 1,700 years later.", period:"79 AD (buried)", type:"Roman city" },
        { name:"Machu Picchu", country:"Peru", emoji:"⛰️", image:"images/machu picchu.jpg", tags:["Inca","UNESCO","Wonder","Peru"], desc:"15th-century Inca citadel in the clouds — the Lost City of the Incas.", detail:"Set at 2,430 metres in the Peruvian Andes, built ~1450 AD for Emperor Pachacuti. Abandoned during the Spanish Conquest and unknown to the outside world until 1911. Its 200 structures are built with such precision that a piece of paper cannot fit between the stones.", fact:"Machu Picchu's stones are cut so precisely that no mortar was used — they fit together perfectly.", period:"~1450 CE", type:"Inca citadel" },
        { name:"Giza Pyramids", country:"Egypt", emoji:"🔺", image:"images/giza pyramids.jpg", tags:["Ancient","UNESCO","Wonder","Egypt"], desc:"The only surviving Wonder of the Ancient World — built 4,500 years ago.", detail:"The Giza Pyramid Complex contains the Great Pyramid of Khufu — the largest pyramid ever built. For 3,800 years it was the tallest man-made structure on earth. Also includes the Great Sphinx — a 73-metre limestone statue.", fact:"The Great Pyramid was the world's tallest structure for 3,800 years — until Lincoln Cathedral in 1311.", period:"~2560 BCE", type:"Pyramid complex" },
        { name:"Petra", country:"Jordan", emoji:"🌹", image:"images/Petra.webp", tags:["Nabataean","UNESCO","Wonder","Jordan"], desc:"The Rose-Red city carved into pink sandstone cliffs — Wonder of the World.", detail:"Capital of the Nabataean Kingdom from ~300 BC. The iconic 40-metre Treasury, Street of Facades, and hundreds of tombs are carved directly into rose-red sandstone cliffs. Lost to the Western world for 500 years, rediscovered in 1812.", fact:"Petra was lost to the Western world for over 500 years before being rediscovered in 1812.", period:"c. 300 BC – 100 CE", type:"Rock-cut city" },
        { name:"Angkor Wat", country:"Cambodia", emoji:"🛕", image:"images/Angkor wat.avif", tags:["Khmer","UNESCO","Cambodia"], desc:"Largest religious monument ever built — 12th-century Khmer masterpiece.", detail:"Built in the early 12th century, Angkor Wat covers 162 hectares — the largest religious monument ever constructed. Originally Hindu, converted to Buddhism. Its 800 metres of bas-relief carvings are the longest continuous bas-relief in the world. Appears on Cambodia's national flag.", fact:"Angkor Wat appears on Cambodia's national flag — the only building to feature on any country's flag.", period:"Early 12th c. CE", type:"Temple complex" }
    ],
    fr: [],
    ar: []
}

// Helper: get sites for current language
function getCurrentSites() {
    return sites[currentLang] || sites.en;
}
// Legacy alias for our renderSites calls
let SITES = sites.en;
function updateSitesForLang() {
    SITES = sites[currentLang] || sites.en;
}

let visitedSites = new Set();
let sitesViewed = 0;

function renderSites(list) {
  const grid = document.getElementById('sitesGrid'); grid.innerHTML = '';
  if (!list || !list.length) { grid.innerHTML = '<div class="no-results">No sites found. Try a different search!</div>'; return; }
  list.forEach((s, i) => {
    const card = document.createElement('div');
    card.className = 'site-card' + (visitedSites.has(s.name) ? ' visited' : '');
    card.style.animationDelay = (i * 0.05) + 's';
    card.setAttribute('tabindex','0'); card.setAttribute('role','button');
    // Image or emoji fallback
    const imgHtml = s.image
      ? `<div class="site-image"><img src="${s.image}" alt="${s.name}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\"site-no-img\"><span class=\"no-img-icon\">${s.name.slice(0,2)}</span></div>'"></div>`
      : `<div class="site-no-img"><span class="no-img-icon" style="font-size:3.5rem">${s.name.slice(0,2)}</span></div>`;
    const tags = s.tags || [];
    card.innerHTML = `
      ${imgHtml}
      <div class="site-info">
        <h3>${s.name}</h3>
        <span class="site-country">📍 ${s.country}${s.type?' · <em>'+s.type+'</em>':''}</span>
        <p>${(s.desc||'').substring(0,110)}${s.desc && s.desc.length>110?'…':''}</p>
        ${tags.length ? '<div class="site-tags">'+tags.map(t=>`<span class="site-tag">${t}</span>`).join('')+'</div>' : ''}
        <div class="site-card-cta">Tap to explore →</div>
      </div>`;
    card.addEventListener('click', () => openSiteModal(s));
    card.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' ') openSiteModal(s); });
    grid.appendChild(card);
  });
  updateExploreProgress();
}
function filterSites() {
  const q = document.getElementById('siteSearch').value.toLowerCase();
  const country = document.getElementById('countryFilter').value;
  const list = getCurrentSites();
  renderSites(list.filter(s => {
    const name = (s.name||'').toLowerCase();
    const desc = (s.desc||'').toLowerCase();
    const ctry = (s.country||'').toLowerCase();
    const tags = s.tags ? s.tags.map(t=>t.toLowerCase()) : [];
    const mq = !q || name.includes(q) || desc.includes(q) || ctry.includes(q) || tags.some(t=>t.includes(q));
    const mc = !country || ctry.includes(country.toLowerCase());
    return mq && mc;
  }));
}
function updateExploreProgress() {
  const allSites = getCurrentSites();
  const pct = Math.round(visitedSites.size / allSites.length * 100);
  document.getElementById('exploreProgressFill').style.width = pct + '%';
  document.getElementById('exploreProgressCount').textContent = visitedSites.size + '/' + allSites.length;
}
async function openSiteModal(site) {
  visitedSites.add(site.name); updateExploreProgress();

  // Show modal immediately with local data while Wikipedia loads
  const imgEl = document.getElementById('siteImage');
  const imgWrap = imgEl.parentElement;
  if (site.image) {
    imgEl.src = site.image; imgEl.alt = site.name;
    imgEl.style.display = ''; imgWrap.style.display = '';
    imgEl.onerror = () => { imgWrap.style.display = 'none'; };
  } else { imgWrap.style.display = 'none'; }

  document.getElementById('modalSiteName').textContent = site.name;
  document.getElementById('modalTags').innerHTML = (site.tags||[]).map(t=>`<span class="site-tag">${t}</span>`).join('');
  document.getElementById('modalFacts').innerHTML = [
    site.country ? `<span>📍 ${site.country}</span>`:'',
    site.type    ? `<span>🏛️ ${site.type}</span>`:'',
    site.period  ? `<span>📅 ${site.period}</span>`:'',
  ].filter(Boolean).join('');

  // Show local desc while loading
  document.getElementById('modalDetailText').innerHTML =
    `<p>${site.desc}</p><p style="color:var(--text-muted);font-size:.82rem;font-style:italic">🌐 Loading more from Wikipedia…</p>`;
  document.getElementById('siteModal').classList.add('active');
  addXP(5);

  // Fetch Wikipedia in background
  try {
    const wiki = await wikiFetch(site.name + ' archaeological site');
    if (wiki && wiki.extract) {
      const extract = wikiFormat(wiki.extract, 800);
      // Use Wikipedia thumbnail if we don't have a local image
      if (!site.image && wiki.thumbnail?.source) {
        imgEl.src = wiki.thumbnail.source; imgEl.alt = site.name;
        imgEl.style.display = ''; imgWrap.style.display = '';
      }
      document.getElementById('modalDetailText').innerHTML =
        `<p>${extract}</p>` +
        (site.fact ? `<p>💡 <em>${site.fact}</em></p>` : '') +
        `<p style="font-size:.72rem;color:var(--text-muted);margin-top:.5rem">Source: <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(wiki.title)}" target="_blank" rel="noopener" style="color:var(--camel)">Wikipedia — ${wiki.title}</a></p>`;
    } else {
      // Fallback to our local detail text
      const local = site.detail || (site.desc + (site.fact ? '\n\n💡 ' + site.fact : ''));
      document.getElementById('modalDetailText').innerHTML = local
        .split('\n\n').map(p => `<p>${p.replace(/\n/g,'<br>')}</p>`).join('');
    }
  } catch(e) {
    const local = site.detail || site.desc;
    document.getElementById('modalDetailText').innerHTML = `<p>${local}</p>`;
  }
}
function closeModal() { document.getElementById('siteModal').classList.remove('active'); }
function copySiteName() {
  const name = document.getElementById('modalSiteName').textContent;
  const btn = document.getElementById('modalShareBtn');
  const orig = btn.textContent;
  navigator.clipboard?.writeText(name).then(() => { btn.textContent = '✅ Copied!'; setTimeout(()=>btn.textContent=orig,1500); }).catch(()=>{ btn.textContent = '❌ Failed'; setTimeout(()=>btn.textContent=orig,1500); });
}
document.getElementById('siteSearch').addEventListener('input', filterSites);
document.getElementById('countryFilter').addEventListener('change', filterSites);
document.addEventListener('keydown', e => { if(e.key==='Escape') closeModal(); });

/* ══════════════════════════════════════════════
   HISTORY PAGE
══════════════════════════════════════════════ */
const HISTORY_DATA = [
  {icon:"⛏️",title:"How a Dig Works",text:"Archaeologists first survey an area using ground-penetrating radar and aerial images. They divide the site into a grid, then carefully dig one layer at a time, recording everything they find. Context is everything — where an object is found matters as much as the object itself.",num:"01"},
  {icon:"🧪",title:"Dating Artifacts",text:"Carbon-14 dating measures radioactive decay in organic material to estimate age. Dendrochronology studies tree rings. Stratigraphy uses soil layers — the deeper you go, the older the objects. Each method adds a piece to the puzzle.",num:"02"},
  {icon:"🏺",title:"What Artifacts Tell Us",text:"Pottery shows trade routes and cooking habits. Coins reveal economic systems and dates. Weapons tell us about conflicts and technology. Jewelry shows wealth and artistic traditions. Every object is a clue about how people lived.",num:"03"},
  {icon:"📸",title:"Recording the Find",text:"Every object is photographed, drawn, and logged with GPS coordinates before it's moved. This context is just as important as the object itself — once lost, it can never be recovered. Modern archaeologists use 3D scanning and photogrammetry.",num:"04"},
  {icon:"🌍",title:"Protecting the Past",text:"UNESCO designates World Heritage Sites to protect important places. Looters who dig illegally destroy the context that makes artifacts meaningful. Archaeology is about knowledge, not treasure — it belongs to all of humanity.",num:"05"},
];
function renderHistory() {
  const c = document.getElementById('historyContent'); c.innerHTML = '';
  HISTORY_DATA.forEach(h => {
    const el = document.createElement('div'); el.className = 'history-card';
    el.innerHTML = `<div class="history-number">${h.num}</div><div class="history-text-block"><span class="history-card-icon">${h.icon}</span><h2>${h.title}</h2><p>${h.text}</p></div>`;
    c.appendChild(el);
  });
}

/* ══════════════════════════════════════════════
   CIVILIZATIONS PAGE
══════════════════════════════════════════════ */
const CIVS = [
  {icon:"🔺",name:"Ancient Egypt",period:"3100–30 BCE",badge:"North Africa",text:"The Egyptians built the pyramids as tombs for pharaohs, developed hieroglyphics, and created sophisticated art, medicine, and astronomy along the Nile. Their civilization lasted over 3,000 years."},
  {icon:"🏛️",name:"Ancient Greece",period:"800–146 BCE",badge:"Mediterranean",text:"Greece gave us democracy, philosophy, the Olympic Games, and dramatic theatre. City-states like Athens and Sparta shaped Western civilization through politics, science, and art."},
  {icon:"⚔️",name:"Roman Empire",period:"27 BCE–476 CE",badge:"Europe & N. Africa",badge2:"Morocco",text:"Rome built roads, aqueducts, and legal systems that influenced Europe for millennia. Their empire stretched from Britain to Mesopotamia, leaving magnificent ruins across Morocco — including Volubilis and Chellah."},
  {icon:"🔷",name:"Moroccan Civilizations",period:"700 BCE–present",badge:"★ Morocco",text:"Morocco has been home to Phoenicians, Carthaginians, Romans, Berbers, Arabs, Merinids, and Saadians. The result is an extraordinary layered culture — from Roman mosaics to zellige art, from Amazigh traditions to Islamic architecture."},
  {icon:"🌽",name:"Maya Civilization",period:"2000 BCE–1500 CE",badge:"Mesoamerica",text:"The Maya developed advanced mathematics, a 365-day calendar, and a complex writing system. Their pyramids and cities in Mexico and Guatemala remain remarkable feats of ancient engineering."},
  {icon:"☯️",name:"Ancient China",period:"2100 BCE–220 CE",badge:"East Asia",text:"Ancient China invented paper, printing, gunpowder, and the compass. The Silk Road connected China to the West, spreading culture and ideas across thousands of kilometres."},
];
function renderCivs() {
  const c = document.getElementById('civList'); c.innerHTML = '';
  CIVS.forEach((civ,i) => {
    const el = document.createElement('div'); el.className = 'civilization-card'; el.style.animationDelay = (i*0.08)+'s';
    el.innerHTML = `<div class="civilization-content">
      <h2>${civ.icon} ${civ.name} <span class="morocco-badge">${civ.badge}</span>${civ.badge2?` <span class="morocco-badge">${civ.badge2}</span>`:''}</h2>
      <p><em>${civ.period}</em></p><p>${civ.text}</p>
    </div>`;
    c.appendChild(el);
  });
}

/* ══════════════════════════════════════════════
   GAMES — SHARED STATE
══════════════════════════════════════════════ */
let globalXP = 0, globalStreak = 0, globalBadges = [];
function addXP(n) {
  globalXP += n;
  document.getElementById('xpValue').textContent = globalXP;
  showXPPopup('+'+n+' XP');
}
function addStreak() {
  globalStreak++;
  document.getElementById('streakValue').textContent = globalStreak;
  if (globalStreak > 0 && globalStreak % 3 === 0) { showAchievement('🔥','On Fire!', globalStreak+' correct in a row!'); }
}
function resetStreak() { globalStreak = 0; document.getElementById('streakValue').textContent = 0; }
function addBadge(icon, name) {
  if (!globalBadges.find(b=>b.name===name)) {
    globalBadges.push({icon,name});
    document.getElementById('badgesValue').textContent = globalBadges.length;
    showAchievement(icon,'Badge Earned!',name);
  }
}
function showXPPopup(text) {
  const p = document.createElement('div'); p.className = 'xp-popup'; p.textContent = text;
  p.style.left = '50%'; p.style.top = '120px';
  document.body.appendChild(p); setTimeout(()=>p.remove(),1000);
}

/* ── GAME SELECTION ── */
let currentGame = null;
function selectGame(game) {
  document.getElementById('gamesList').classList.add('hidden');
  ['adventureGame','quizGame','memoryGame','siteQuizGame'].forEach(id => {
    const el = document.getElementById(id);
    el.classList.add('hidden'); el.style.display = '';
  });
  const vo = document.getElementById('victoryOverlay');
  vo.classList.add('hidden'); vo.style.display = 'none';
  currentGame = game;
  if (game === 'adventure') { const el = document.getElementById('adventureGame'); el.classList.remove('hidden'); el.style.display = ''; initAdventure(); }
  else if (game === 'quiz') { const el = document.getElementById('quizGame'); el.classList.remove('hidden'); el.style.display = ''; loadQuiz(); }
  else if (game === 'memory') { const el = document.getElementById('memoryGame'); el.classList.remove('hidden'); el.style.display = ''; initMemory(); }
  else if (game === 'siteQuiz') { const el = document.getElementById('siteQuizGame'); el.classList.remove('hidden'); el.style.display = ''; initSiteQuiz(); }
}
function backToGames() {
  ['adventureGame','quizGame','memoryGame','siteQuizGame'].forEach(id => {
    const el = document.getElementById(id);
    el.classList.add('hidden'); el.style.display = '';
  });
  const vo = document.getElementById('victoryOverlay');
  vo.classList.add('hidden'); vo.style.display = 'none';
  document.getElementById('gamesList').classList.remove('hidden');
  currentGame = null;
  if (memState && memState.timer) { clearInterval(memState.timer); memState.timer = null; }
  if (advState && advState.timer) { clearInterval(advState.timer); advState.timer = null; }
  if (quizState && quizState.timer) { clearInterval(quizState.timer); quizState.timer = null; }
}
function restartCurrentGame() {
  const vo = document.getElementById('victoryOverlay');
  vo.classList.add('hidden'); vo.style.display = 'none';
  if (currentGame) selectGame(currentGame);
}

/* ── CONFETTI ── */
const CONFETTI_COLORS = ["#B2967D","#7D5A44","#D7C9B8","#4A342A","#3D7A52","#A83228"];
function launchConfetti(n) {
  const c = document.getElementById('confetti-container');
  for (let i=0;i<(n||60);i++) {
    const p = document.createElement('div'); p.className = 'confetti-piece';
    p.style.left = Math.random()*100+'vw';
    p.style.background = CONFETTI_COLORS[Math.floor(Math.random()*CONFETTI_COLORS.length)];
    p.style.animationDuration = 2+Math.random()*2+'s';
    p.style.animationDelay = Math.random()*.5+'s';
    c.appendChild(p); setTimeout(()=>p.remove(),4500);
  }
}

/* ══════════════════════════════════════════════
   ARTIFACT QUIZ GAME
══════════════════════════════════════════════ */
const QUIZ_QUESTIONS = [
  {q:"Which ancient civilization built the pyramids of Giza?",opts:["Romans","Egyptians","Greeks","Persians"],a:1,hint:"They also invented hieroglyphics.",level:"easy",xp:10},
  {q:"What tool do archaeologists use to gently remove dust from artifacts?",opts:["Shovel","Brush","Hammer","Drill"],a:1,hint:"It's soft and gentle.",level:"easy",xp:10},
  {q:"What is a 'sherd' in archaeology?",opts:["A type of sword","A broken piece of pottery","A burial mound","An ancient coin"],a:1,hint:"It comes from broken ceramics.",level:"easy",xp:10},
  {q:"Where is the ancient Roman site of Volubilis located?",opts:["France","Spain","Morocco","Tunisia"],a:2,hint:"It's in North Africa.",level:"medium",xp:15},
  {q:"Which dating method uses radioactive decay in organic material?",opts:["Dendrochronology","Carbon-14 dating","Stratigraphy","Thermoluminescence"],a:1,hint:"It involves carbon atoms.",level:"medium",xp:20},
  {q:"The Maya civilization was mainly located in which region?",opts:["South America","North America","Mesoamerica","Europe"],a:2,hint:"Think Mexico and Guatemala.",level:"medium",xp:20},
  {q:"What is 'stratigraphy' in archaeology?",opts:["The study of stars","Studying soil layers to date objects","A method of carbon dating","The study of ancient maps"],a:1,hint:"Deeper layers are usually older.",level:"hard",xp:25},
  {q:"Zellige is a form of art from which country?",opts:["Egypt","Turkey","Morocco","Iran"],a:2,hint:"It decorates riads and palaces.",level:"hard",xp:25},
  {q:"Which ancient wonder is still standing today?",opts:["Hanging Gardens of Babylon","Colossus of Rhodes","Great Pyramid of Giza","Lighthouse of Alexandria"],a:2,hint:"It's in Egypt.",level:"hard",xp:30},
  {q:"What discovery was made near Xi'an, China in 1974?",opts:["The Dead Sea Scrolls","Terracotta Army","Lost city of Pompeii","King Tut's tomb"],a:1,hint:"Thousands of clay soldiers.",level:"hard",xp:30},
];
let quizState = {};
function loadQuiz() {
  document.getElementById('quizLevelSelector').classList.remove('hidden');
  document.getElementById('quizQuestions').classList.add('hidden');
  quizState = {};
}
function backToLevels() { loadQuiz(); }
function startQuiz(level) {
  const questions = level === 'easy' ? QUIZ_QUESTIONS.filter(q=>q.level==='easy') :
                    level === 'medium' ? QUIZ_QUESTIONS.filter(q=>q.level!=='hard') : QUIZ_QUESTIONS;
  document.getElementById('quizLevelSelector').classList.add('hidden');
  document.getElementById('quizQuestions').classList.remove('hidden');
  document.getElementById('currentLevelBadge').textContent = level === 'easy' ? '🌱 Easy' : level === 'medium' ? '⚡ Medium' : '🔥 Hard';
  quizState = {questions:shuffle([...questions]),current:0,score:0,hints:3,timer:null,level};
  showQuizQuestion();
}
function shuffle(a){const c=[...a];for(let i=c.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[c[i],c[j]]=[c[j],c[i]];}return c;}
function showQuizQuestion() {
  if (quizState.current >= quizState.questions.length) { endQuiz(); return; }
  const q = quizState.questions[quizState.current];
  const total = quizState.questions.length;
  document.getElementById('questionCounter').textContent = `Q${quizState.current+1}/${total}`;
  document.getElementById('quizScoreDisplay').textContent = `Score: ${quizState.score}`;
  document.getElementById('quizProgressFill').style.width = (quizState.current/total*100)+'%';
  document.getElementById('questionText').textContent = q.q;
  document.getElementById('feedbackText').textContent = '';
  document.getElementById('hintBox').classList.remove('show');
  document.getElementById('hintText').textContent = '';
  document.getElementById('hintCount').textContent = quizState.hints;
  document.getElementById('nextBtn').style.display = 'none';
  document.getElementById('scoreDisplay').textContent = 'Score: ' + quizState.score;
  const ac = document.getElementById('answersContainer'); ac.innerHTML = '';
  shuffle([...q.opts.map((o,i)=>({o,i}))]).forEach(({o,i}) => {
    const btn = document.createElement('button'); btn.className = 'answer-btn'; btn.textContent = o;
    btn.addEventListener('click', () => handleQuizAnswer(btn, i, q));
    ac.appendChild(btn);
  });
  startQuizTimer(20, q);
}
function startQuizTimer(sec, q) {
  let t = sec;
  document.getElementById('quizTimer').textContent = t;
  document.getElementById('quizTimer').className = 'quiz-timer';
  document.getElementById('quizTimerFill').style.transition = 'none';
  document.getElementById('quizTimerFill').style.width = '100%';
  requestAnimationFrame(() => {
    document.getElementById('quizTimerFill').style.transition = `width ${sec}s linear`;
    document.getElementById('quizTimerFill').style.width = '0%';
  });
  if (quizState.timer) clearInterval(quizState.timer);
  quizState.timer = setInterval(() => {
    t--;
    const el = document.getElementById('quizTimer');
    el.textContent = t;
    if (t <= 5) el.className = 'quiz-timer danger';
    else if (t <= 10) el.className = 'quiz-timer warning';
    if (t <= 0) { clearInterval(quizState.timer); handleQuizAnswer(null, -1, q); }
  }, 1000);
}
function handleQuizAnswer(btn, chosenIdx, q) {
  clearInterval(quizState.timer);
  document.querySelectorAll('.answer-btn').forEach(b => b.disabled = true);
  const correct = chosenIdx === q.a;
  if (btn) btn.classList.add(correct ? 'correct' : 'incorrect');
  document.querySelectorAll('.answer-btn').forEach((b,i) => {
    const opts = quizState.questions[quizState.current].opts;
    if (opts.indexOf(b.textContent) === q.a || b.textContent === q.opts[q.a]) b.classList.add('correct');
  });
  const fb = document.getElementById('feedbackText');
  if (correct) {
    quizState.score++; addXP(q.xp); addStreak();
    fb.textContent = '✅ Correct! +'+q.xp+'XP'; fb.className = 'feedback feedback-correct';
  } else {
    resetStreak();
    fb.textContent = chosenIdx === -1 ? '⏰ Time\'s up!' : '❌ Not quite!'; fb.className = 'feedback feedback-incorrect';
  }
  document.getElementById('scoreDisplay').textContent = 'Score: '+quizState.score;
  quizState.current++;
  document.getElementById('nextBtn').style.display = 'block';
}
function nextQuestion() { showQuizQuestion(); }
function endQuiz() {
  const pct = Math.round(quizState.score/quizState.questions.length*100);
  addBadge('🧠', pct>=80?'Quiz Master':'Quiz Player');
  launchConfetti(pct>=80?60:20);
  showVictory('🧠 Quiz Complete!',`Score: ${quizState.score}/${quizState.questions.length} (${pct}%)`);
}
function useHint() {
  if (quizState.hints <= 0) return;
  quizState.hints--;
  document.getElementById('hintCount').textContent = quizState.hints;
  document.getElementById('hintText').textContent = quizState.questions[quizState.current].hint;
  document.getElementById('hintBox').classList.add('show');
  document.getElementById('hintBtn').disabled = quizState.hints === 0;
}

/* ══════════════════════════════════════════════
   MEMORY GAME
══════════════════════════════════════════════ */
const MEM_CARDS = [
  {emoji:"🏺",label:"Clay Pot"},{emoji:"💎",label:"Gemstone"},{emoji:"🪙",label:"Coin"},
  {emoji:"📜",label:"Scroll"},{emoji:"🦴",label:"Bone"},{emoji:"🗿",label:"Statue"},
  {emoji:"⚗️",label:"Canopic Jar"},{emoji:"🏛️",label:"Temple"},
];
let memState = {};
function initMemory() {
  if (memState.timer) clearInterval(memState.timer);
  memState = {flipped:[],matched:0,moves:0,timer:null,seconds:0,locked:false};
  document.getElementById('memoryMoves').textContent = '0';
  document.getElementById('memoryPairs').textContent = '0/8';
  document.getElementById('memoryTimer').textContent = '0s';
  const grid = document.getElementById('memoryGrid'); grid.innerHTML = '';
  const pairs = shuffle([...MEM_CARDS,...MEM_CARDS]);
  pairs.forEach((c,i) => {
    const card = document.createElement('div'); card.className = 'card';
    card.innerHTML = `<div class="card-inner"><div class="card-front"><div class="card-parchment-pattern"></div><span class="card-back-symbol">🏺</span></div><div class="card-back"><div class="memory-emoji-card"><span class="memory-emoji">${c.emoji}</span><span class="memory-label">${c.label}</span></div></div></div>`;
    card.addEventListener('click', () => flipMemCard(card, c.emoji));
    grid.appendChild(card);
  });
  memState.timer = setInterval(() => {
    memState.seconds++;
    document.getElementById('memoryTimer').textContent = memState.seconds+'s';
  }, 1000);
}
function flipMemCard(card, emoji) {
  if (memState.locked || card.classList.contains('flip') || card.classList.contains('matched')) return;
  card.classList.add('flip'); memState.flipped.push({card,emoji});
  if (memState.flipped.length === 2) {
    memState.moves++; memState.locked = true;
    document.getElementById('memoryMoves').textContent = memState.moves;
    const [a,b] = memState.flipped;
    if (a.emoji === b.emoji) {
      a.card.classList.add('matched'); b.card.classList.add('matched');
      memState.matched++; memState.flipped = []; memState.locked = false;
      document.getElementById('memoryPairs').textContent = memState.matched+'/8';
      addXP(10);
      if (memState.matched === 8) {
        clearInterval(memState.timer); memState.timer = null;
        addBadge('🃏','Memory Master'); launchConfetti(50);
        showVictory('🃏 Memory Complete!',`${memState.moves} moves in ${memState.seconds} seconds!`);
      }
    } else {
      setTimeout(() => { a.card.classList.remove('flip'); b.card.classList.remove('flip'); memState.flipped=[]; memState.locked=false; }, 900);
    }
  }
}

/* ══════════════════════════════════════════════
   SITE QUIZ GAME
══════════════════════════════════════════════ */
const SITE_QUESTIONS = SITES.map(s => ({
  site: s,
  question: `Which archaeological site is famous for: "${s.desc.split('.')[0]}"?`,
  options: shuffle([s.name, ...shuffle(SITES.filter(x=>x.name!==s.name).map(x=>x.name)).slice(0,3)]),
  answer: s.name, emoji: s.emoji,
}));
let siteQuizState = {};
function initSiteQuiz() {
  siteQuizState = {questions:shuffle([...SITE_QUESTIONS]).slice(0,8),current:0,score:0};
  showSiteQuestion();
}
function showSiteQuestion() {
  if (siteQuizState.current >= siteQuizState.questions.length) { endSiteQuiz(); return; }
  const q = siteQuizState.questions[siteQuizState.current];
  const total = siteQuizState.questions.length;
  document.getElementById('siteQuizCounter').textContent = `${siteQuizState.current+1}/${total}`;
  document.getElementById('siteQuizScore').textContent = `Score: ${siteQuizState.score}`;
  document.getElementById('siteQuizProgress').style.width = (siteQuizState.current/total*100)+'%';
  const img = document.getElementById('siteQuizImage');
  img.src = ''; img.style.display = 'none';
  document.getElementById('siteQuizQuestion').textContent = q.question;
  document.getElementById('siteFeedback').textContent = '';
  document.getElementById('siteNextBtn').style.display = 'none';
  const ac = document.getElementById('siteQuizAnswers'); ac.innerHTML = '';
  q.options.forEach(opt => {
    const btn = document.createElement('button'); btn.className = 'answer-btn'; btn.textContent = opt;
    btn.addEventListener('click', () => handleSiteAnswer(btn, opt, q));
    ac.appendChild(btn);
  });
}
function handleSiteAnswer(btn, chosen, q) {
  document.querySelectorAll('#siteQuizAnswers .answer-btn').forEach(b => {
    b.disabled = true;
    if (b.textContent === q.answer) b.classList.add('correct');
  });
  const correct = chosen === q.answer;
  if (!correct) btn.classList.add('incorrect');
  const fb = document.getElementById('siteFeedback');
  if (correct) {
    siteQuizState.score++; addXP(15); addStreak();
    fb.textContent = '✅ Correct!'; fb.className = 'feedback feedback-correct';
  } else {
    resetStreak();
    fb.textContent = `❌ It was ${q.answer}!`; fb.className = 'feedback feedback-incorrect';
  }
  siteQuizState.current++;
  document.getElementById('siteNextBtn').style.display = 'block';
}
function nextSiteQuestion() { showSiteQuestion(); }
function endSiteQuiz() {
  addBadge('🗺️','Site Explorer'); launchConfetti(40);
  showVictory('🗺️ Site Quiz Done!',`Score: ${siteQuizState.score}/${siteQuizState.questions.length}`);
}

/* ── VICTORY OVERLAY ── */
function showVictory(title, stats) {
  document.getElementById('victoryTitle').textContent = title;
  document.getElementById('victoryStats').textContent = stats;
  const vo = document.getElementById('victoryOverlay');
  vo.classList.remove('hidden');
  vo.style.display = 'flex';
}

/* ══════════════════════════════════════════════
   5-LEVEL ADVENTURE GAME
══════════════════════════════════════════════ */
const ADV_BADGES = {
  level1:{icon:"🔍",name:"Curious Explorer"},
  level2:{icon:"🪨",name:"Careful Digger"},
  level3:{icon:"🏺",name:"Artifact Spotter"},
  level4:{icon:"🌍",name:"Civilization Connoisseur"},
  level5:{icon:"🕵️",name:"Master Detective"},
  final:{icon:"🏆",name:"Master Archaeologist"},
};
const ADV_Q_TIME = 20;
let advState = {playerName:"Explorer",xp:0,maxXp:500,badges:[],streak:0,timer:null};

function setPip(text,mood) {
  document.getElementById('pip-text').textContent = text;
  const b = document.getElementById('pip-bubble'); b.classList.remove('pop'); requestAnimationFrame(()=>b.classList.add('pop'));
}
function advAddXP(n) {
  advState.xp = Math.min(advState.xp+n, advState.maxXp);
  document.getElementById('adv-xp').textContent = advState.xp;
  const pct = advState.xp/advState.maxXp*100;
  document.getElementById('adv-xp-bar').style.width = pct+'%';
  showXPPopup('+'+n+' XP');
}
function advAwardBadge(id) {
  if (advState.badges.includes(id)) return;
  advState.badges.push(id);
  const b = ADV_BADGES[id];
  const row = document.getElementById('adv-badges-row');
  const el = document.createElement('div'); el.className = 'badge'; el.textContent = b.icon+' '+b.name;
  row.appendChild(el);
  addBadge(b.icon, b.name);
}
function advAddStreak(bonus) {
  advState.streak++;
  document.getElementById('adv-streak').textContent = advState.streak;
  if (advState.streak>0 && advState.streak%3===0) { launchConfetti(20); return 10; }
  return 0;
}
function advResetStreak() { advState.streak=0; document.getElementById('adv-streak').textContent=0; }
function showAdvScreen(id) {
  document.querySelectorAll('.adv-screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.getElementById('adventureGame').scrollIntoView({behavior:'smooth',block:'start'});
}
function initAdventure() {
  advState = {playerName:"Explorer",xp:0,maxXp:500,badges:[],streak:0,timer:null};
  document.getElementById('adv-xp').textContent=0;
  document.getElementById('adv-xp-bar').style.width='0%';
  document.getElementById('adv-streak').textContent=0;
  document.getElementById('adv-badges-row').innerHTML='';
  ['adv-dig-section','adv-quiz-section-l2'].forEach(id=>document.getElementById(id).classList.add('hidden'));
  // Reset discovery modal
  const discModal = document.getElementById('adv-discovery-modal');
  if(discModal){ discModal.classList.add('hidden'); discModal.style.display='none'; }
  document.getElementById('adv-l1-continue').disabled=true;
  ['adv-l2-continue','adv-l3-continue','adv-l4-continue','adv-l5-continue'].forEach(id=>document.getElementById(id).classList.add('hidden'));
  showAdvScreen('adv-screen-start');
  setPip("Hi! I'm Pip! Enter your name and let's start digging! 🏺","idle");
  advStartFactRotation();
}
const ADV_FACTS=[
  {icon:"💡",text:'The word "archaeology" comes from Greek words meaning "study of ancient things."'},
  {icon:"🦴",text:"Archaeologists can learn what ancient people ate by studying old bones!"},
  {icon:"🏺",text:"A single broken piece of pottery is called a 'sherd' and reveals trade routes."},
  {icon:"⏳",text:"Some excavations take years — archaeologists must be very patient!"},
  {icon:"🗺️",text:"Satellites and drones help archaeologists find hidden ruins from space!"},
];
function advStartFactRotation() {
  let i=0; const fi=document.getElementById('adv-fact-icon'),ft=document.getElementById('adv-fact-text');
  if (advState._factTimer) clearInterval(advState._factTimer);
  advState._factTimer=setInterval(()=>{i=(i+1)%ADV_FACTS.length;fi.textContent=ADV_FACTS[i].icon;ft.textContent=ADV_FACTS[i].text;},6000);
}
// Reusable card cycler
function advCardCycle(containerId,items,nextLabel,onDone) {
  const c=document.getElementById(containerId); let cur=0;
  function show(){
    const it=items[cur],isLast=cur===items.length-1;
    c.innerHTML=`<div class="adv-info-card"><span class="adv-card-icon">${it.icon}</span><h3>${it.title}</h3><p>${it.text}</p>
      <div class="adv-pager">${items.map((_,i)=>`<div class="adv-pager-dot${i===cur?' active':''}"></div>`).join('')}</div>
      <button class="adv-btn-primary" id="adv-card-next">${isLast?'Continue ➡️':nextLabel}</button></div>`;
    c.querySelector('#adv-card-next').addEventListener('click',()=>{cur++;cur<items.length?show():onDone();});
  }
  show();
}
// Reusable quiz engine
function advQuiz(containerId,questions,onDone) {
  const c=document.getElementById(containerId); let cur=0,score=0,tid=null;
  function showQ(){
    const q=questions[cur];
    c.innerHTML=`<div class="adv-quiz-meta"><span class="adv-quiz-counter">Q${cur+1}/${questions.length}</span></div>
      <div class="adv-timer-track"><div class="adv-timer-fill" id="adv-tf" style="animation:adv-countdown ${ADV_Q_TIME}s linear forwards"></div></div>
      <div class="adv-q-box">
        <p class="adv-q-text">${q.question}</p>
        <div class="adv-opts">${q.options.map((o,i)=>`<button class="adv-opt" data-i="${i}" data-letter="${String.fromCharCode(65+i)}">${o}</button>`).join('')}</div>
        <div class="adv-feedback" id="adv-qfb"></div>
      </div>`;
    const t0=Date.now();
    tid=setTimeout(()=>handle(null,q,t0,true),ADV_Q_TIME*1000);
    c.querySelectorAll('.adv-opt').forEach(b=>b.addEventListener('click',()=>handle(b,q,t0,false)));
  }
  function handle(btn,q,t0,timedOut){
    clearTimeout(tid);
    // Stop timer bar
    const tf=document.getElementById('adv-tf'); if(tf)tf.style.animationPlayState='paused';
    // Disable all options
    c.querySelectorAll('.adv-opt').forEach(b=>b.disabled=true);
    const ci=btn?parseInt(btn.dataset.i):-1;
    const elapsed=(Date.now()-t0)/1000;
    // Re-query fb AFTER innerHTML was set in showQ (so it's live in DOM)
    const fb=c.querySelector('#adv-qfb');
    if(!fb) return;
    if(!timedOut&&ci===q.correct){
      if(btn) btn.classList.add('correct');
      score++;
      let earned=q.xp||15, bonusMsg='';
      if(elapsed<ADV_Q_TIME/2){ earned+=5; bonusMsg+=' ⚡ Speed +5XP!'; }
      const sb=advAddStreak(); if(sb>0){ earned+=sb; bonusMsg+=` 🔥 Streak +${sb}XP!`; }
      advAddXP(earned); addXP(earned);
      fb.innerHTML=`<div class="adv-feedback ok">✅ Correct!${bonusMsg}<br><small>${q.fact||''}</small></div>`;
    } else {
      if(btn) btn.classList.add('incorrect');
      const opts=c.querySelectorAll('.adv-opt');
      if(opts[q.correct]) opts[q.correct].classList.add('correct');
      advResetStreak();
      fb.innerHTML=`<div class="adv-feedback bad">${timedOut?"⏰ Time's up!":"❌ Not quite."}<br><small>${q.fact||""}</small></div>`;
    }
    // Add next button
    const nb=document.createElement('button');
    nb.className='adv-btn-primary';
    nb.style.marginTop='.75rem';
    nb.textContent=cur<questions.length-1?'Next Question ➡️':'See Results ✅';
    nb.addEventListener('click',()=>{ cur++; cur<questions.length?showQ():onDone(score); });
    fb.appendChild(nb);
  }
  showQ();
}

// LEVEL 1
const L1_FACTS=[
  {icon:"🌍",title:"What is Archaeology?",text:"Archaeology is the study of human history through digging up and analyzing artifacts, buildings, and other physical remains left behind by people long ago."},
  {icon:"🔍",title:"Archaeologists are Detectives",text:"They piece together clues — like pottery, tools, and bones — to figure out how people lived thousands of years ago."},
  {icon:"🗺️",title:"Every Find Matters",text:"Even a tiny broken piece of pottery can tell us what people ate, how they traded, or what they valued. Nothing is too small!"},
];
const L1_ARTIFACTS=[
  {icon:"🏺",name:"Clay Pot",fact:"Ancient pots stored grain, water, and oil — some have survived over 5,000 years!"},
  {icon:"💎",name:"Gemstone",fact:"Gemstones found at dig sites often traveled along ancient trade routes."},
  {icon:"🪙",name:"Ancient Coin",fact:"Coins help archaeologists date a site — they often show a ruler's face or year."},
  {icon:"📜",name:"Old Scroll",fact:"Scrolls made of papyrus or parchment could record laws, stories, or trade."},
  {icon:"🦴",name:"Ancient Bone",fact:"Bones tell us what ancient people hunted, farmed, or kept as pets."},
];
function advInitL1(){
  setPip("Ooh, an ancient site! Learn the basics, then dig — there are 5 treasures hidden!","idle");
  advCardCycle('adv-facts-l1',L1_FACTS,'Next Fact ➡️',()=>{
    document.getElementById('adv-dig-section').classList.remove('hidden');
    advSetupDig();
  });
}
function advSetupDig() {
  const grid = document.getElementById('adv-dig-grid');
  grid.innerHTML = '';

  const ARTIFACTS = [
    { icon:'🏺', name:'Clay Pot',     fact:'Ancient pots stored grain, water, and oil — some have survived over 5,000 years!' },
    { icon:'💎', name:'Gemstone',     fact:'Gemstones found at dig sites often traveled along ancient trade routes.' },
    { icon:'🪙', name:'Ancient Coin', fact:'Coins help archaeologists date a site — they often show a ruler\'s face or year.' },
    { icon:'📜', name:'Old Scroll',   fact:'Scrolls made of papyrus or parchment could record laws, stories, or trade.' },
    { icon:'🦴', name:'Ancient Bone', fact:'Bones tell us what ancient people hunted, farmed, or kept as pets.' },
  ];

  const total = 16;
  // Pick 5 random positions for artifacts
  const allPos = Array.from({length: total}, (_, i) => i);
  for (let i = allPos.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allPos[i], allPos[j]] = [allPos[j], allPos[i]];
  }
  const artifactPositions = allPos.slice(0, ARTIFACTS.length);
  // Map position → artifact
  const posMap = {};
  artifactPositions.forEach((pos, i) => { posMap[pos] = ARTIFACTS[i]; });

  let found = 0;
  const total_artifacts = ARTIFACTS.length;

  // Build tiles
  for (let i = 0; i < total; i++) {
    const tile = document.createElement('div');
    tile.className = 'adv-tile';
    tile.innerHTML = '<span style="opacity:.4;font-size:1rem">🪨</span>';
    let stage = 0;

    tile.addEventListener('click', function() {
      if (stage === 0) {
        // First tap: crack
        stage = 1;
        tile.style.background = 'rgba(74,52,42,.6)';
        tile.innerHTML = '<span>⛏️</span>';

      } else if (stage === 1) {
        // Second tap: reveal
        stage = 2;
        tile.style.cursor = 'default';

        if (posMap[i]) {
          const art = posMap[i];
          stage = 3; // fully done
          tile.innerHTML = '<span style="font-size:1.6rem">' + art.icon + '</span>';
          tile.style.background = 'linear-gradient(135deg,rgba(178,150,125,.2),rgba(125,90,68,.1))';
          tile.style.borderColor = 'var(--camel)';
          tile.style.boxShadow = '0 0 12px rgba(178,150,125,.3)';
          tile.style.cursor = 'default';
          tile.style.pointerEvents = 'none';

          // Show discovery popup
          advShowFind(art, function() {
            found++;
            document.getElementById('adv-found').textContent = found + '/' + total_artifacts;
            advAddXP(15); addXP(15);
            if (found >= total_artifacts) {
              document.getElementById('adv-level1-msg').textContent = '🎉 All ' + total_artifacts + ' found! Amazing!';
              const btn = document.getElementById('adv-l1-continue');
              btn.disabled = false;
              btn.style.opacity = '1';
              btn.style.pointerEvents = 'auto';
              advAwardBadge('level1');
              launchConfetti(40);
              setPip("Wow, you found them all! Amazing eyes! 👀", "happy");
            }
          });

        } else {
          // Empty tile
          tile.innerHTML = '<span style="opacity:.25;font-size:1rem">🪨</span>';
          tile.style.opacity = '0.4';
          tile.style.pointerEvents = 'none';
        }
      }
    });

    grid.appendChild(tile);
  }
}

// Simple find popup — no modal classes, pure inline
function advShowFind(artifact, onDone) {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = [
    'position:fixed', 'inset:0', 'z-index:99999',
    'background:rgba(0,0,0,.75)', 'backdrop-filter:blur(6px)',
    'display:flex', 'align-items:center', 'justify-content:center', 'padding:20px'
  ].join(';');

  overlay.innerHTML = `
    <div style="
      background:#2A1810; border:1px solid rgba(178,150,125,.4);
      border-radius:20px; padding:2rem 1.5rem; text-align:center;
      max-width:320px; width:100%;
      box-shadow:0 20px 60px rgba(0,0,0,.6);
      animation:adv-pop .35s cubic-bezier(.34,1.56,.64,1);
    ">
      <div style="font-size:3.5rem;margin-bottom:.75rem;line-height:1">${artifact.icon}</div>
      <h3 style="font-family:'Cinzel',serif;color:#F5F1EA;font-size:1.3rem;margin-bottom:.6rem">${artifact.name}</h3>
      <p style="font-size:.88rem;color:#9E7D65;line-height:1.6;margin-bottom:1.25rem">${artifact.fact}</p>
      <button id="adv-find-close" style="
        background:linear-gradient(135deg,#4A342A,#7D5A44);
        color:#F5F1EA; border:none; border-radius:50px;
        padding:.75rem 2rem; font-family:'Cinzel',serif;
        font-size:.9rem; font-weight:700; cursor:pointer;
        width:100%;
      ">Awesome! ✨</button>
    </div>`;

  document.body.appendChild(overlay);

  overlay.querySelector('#adv-find-close').onclick = function() {
    document.body.removeChild(overlay);
    onDone();
  };
}

// LEVEL 2
const L2_TOOLS=[
  {icon:"🛠️",title:"Trowel",text:"A small hand tool used to carefully scrape away soil, layer by layer, without damaging anything hidden underneath."},
  {icon:"🖌️",title:"Brush",text:"A soft brush gently removes dust and dirt from delicate objects so they don't get scratched or broken."},
  {icon:"🕸️",title:"Sieve",text:"Archaeologists pour soil through a sieve to catch tiny objects like beads, seeds, or coins."},
  {icon:"📏",title:"Measuring Tools",text:"Tape measures and grids record the exact location of every object found. Location is a huge clue!"},
  {icon:"📷",title:"Camera & Notebook",text:"Every layer and object is photographed and written down. Without good records, a discovery loses its meaning."},
];
const L2_QUIZ=[
  {question:"Which tool removes dust from a fragile artifact without scratching it?",options:["Shovel","Brush","Hammer","Pickaxe"],correct:1,fact:"A soft brush protects delicate surfaces.",xp:15},
  {question:"Why do archaeologists dig in careful layers?",options:["To find treasure faster","Each layer can represent a different time period","To make neat holes","It's required by law"],correct:1,fact:'Layers ("strata") help date objects — deeper usually means older!',xp:15},
  {question:"What tool helps find tiny objects like beads hidden in soil?",options:["Telescope","Compass","Sieve","Drone"],correct:2,fact:"Sifting soil through a sieve catches small treasures.",xp:15},
];
function advInitL2(){
  setPip("Every great archaeologist needs the right tools. Study these, then beat the quiz!","idle");
  advCardCycle('adv-tools-l2',L2_TOOLS,'Next Tool ➡️',()=>{
    document.getElementById('adv-quiz-section-l2').classList.remove('hidden');
    advQuiz('adv-quiz-l2',L2_QUIZ,()=>{advAwardBadge('level2');launchConfetti(30);setPip("Tool master! On to artifacts!","happy");document.getElementById('adv-l2-continue').classList.remove('hidden');});
  });
}

// LEVEL 3
const L3_QUIZ=[
  {image:"🏺",question:"What kind of artifact is this ancient clay vessel?",options:["Pottery Vessel","Sword","Mask","Statue"],correct:0,fact:"Ancient pots stored food, water, oil, and wine.",xp:15},
  {question:"What is a canopic jar used for?",options:["Storing wine","Storing organs of the mummified","Cooking","Mixing pigments"],correct:1,fact:"Canopic jars held the organs of Egyptian mummies.",xp:15},
  {question:"Which civilization is known for building pyramids?",options:["Romans","Maya","Egyptians","Greeks"],correct:2,fact:"The Egyptians built pyramids as royal tombs.",xp:20},
  {question:"What does 'stratigraphy' mean?",options:["Study of stars","Mapping soil layers to date objects","A form of cave painting","Trading routes"],correct:1,fact:"Stratigraphy: deeper layers are usually older.",xp:20},
  {question:"Which artifact helps archaeologists date a site most precisely?",options:["Pottery shard","Ancient coin","Bone fragment","Textile"],correct:1,fact:"Coins often show dates, rulers or events.",xp:20},
];
function advInitL3(){
  setPip("Time to test your artifact knowledge — answer quickly for a speed bonus!","thinking");
  advQuiz('adv-quiz-l3',L3_QUIZ,()=>{advAwardBadge('level3');launchConfetti(30);setPip("Incredible! You really know your artifacts!","happy");document.getElementById('adv-l3-continue').classList.remove('hidden');});
}

// LEVEL 4 — Drag & Drop
const L4_ITEMS=[
  {emoji:"⚗️",civ:"Egypt",fact:"Canopic jars stored organs of mummified pharaohs."},
  {emoji:"🏛️",civ:"Rome",fact:"Grand amphitheaters like the Colosseum hosted gladiator battles."},
  {emoji:"🏺",civ:"Greece",fact:"Painted vases showed myths and Olympic athletes."},
  {emoji:"🗿",civ:"Maya",fact:"The Maya carved detailed stone calendars."},
  {emoji:"🔷",civ:"Morocco",fact:"Colorful zellige mosaics decorate Moroccan palaces."},
];
function advInitL4(){
  setPip("Drag each artifact onto the civilization it belongs to. Some might surprise you!","idle");
  const c=document.getElementById('adv-quiz-l4');
  const items=shuffle([...L4_ITEMS]), civs=shuffle(L4_ITEMS.map(i=>i.civ));
  c.innerHTML=`<p style="font-size:.82rem;color:var(--text-muted);margin-bottom:.75rem">👆 Drag each artifact to its civilization!</p>
    <div class="adv-dnd-pool" id="adv-dnd-pool">${items.map((it,i)=>`<div class="adv-dnd-item" data-civ="${it.civ}" data-fact="${it.fact}" data-id="${i}">${it.emoji}</div>`).join('')}</div>
    <div class="adv-dnd-targets">${civs.map(civ=>`<div class="adv-dnd-target" data-civ="${civ}"><div class="adv-dnd-slot"></div><span class="adv-dnd-label">${civ}</span></div>`).join('')}</div>
    <p class="adv-dnd-feedback" id="adv-dnd-fb"></p>`;
  let placed=0;
  c.querySelectorAll('.adv-dnd-item').forEach(item=>{
    let drag=false,sx=0,sy=0;
    item.addEventListener('pointerdown',e=>{if(item.classList.contains('placed'))return;drag=true;sx=e.clientX;sy=e.clientY;item.classList.add('dragging');item.setPointerCapture(e.pointerId);});
    item.addEventListener('pointermove',e=>{if(!drag)return;item.style.transform=`translate(${e.clientX-sx}px,${e.clientY-sy}px) scale(1.1)`;});
    item.addEventListener('pointerup',e=>{
      if(!drag)return;drag=false;item.classList.remove('dragging');
      item.style.visibility='hidden';const el=document.elementFromPoint(e.clientX,e.clientY);item.style.visibility='visible';
      const tgt=el?.closest('.adv-dnd-target');
      if(tgt&&!tgt.classList.contains('correct')){
        if(tgt.dataset.civ===item.dataset.civ){
          item.style.transform='';item.classList.add('placed');tgt.classList.add('correct');tgt.querySelector('.adv-dnd-slot').appendChild(item);
          placed++;advAddXP(20);addXP(20);
          document.getElementById('adv-dnd-fb').textContent='✅ '+item.dataset.fact;
          if(placed===items.length){advAwardBadge('level4');launchConfetti(40);setPip("You connected history across the globe! 🌍","happy");document.getElementById('adv-l4-continue').classList.remove('hidden');}
          return;
        } else {
          tgt.classList.add('adv-dnd-target','shake');setTimeout(()=>tgt.classList.remove('shake'),400);
          document.getElementById('adv-dnd-fb').textContent='❌ Try a different civilization!';
        }
      }
      item.style.transition='transform .25s ease';item.style.transform='';setTimeout(()=>item.style.transition='',250);
    });
  });
}

// LEVEL 5
const L5_QUIZ=[
  {question:"The coin with Roman numerals suggests which civilization first settled here?",options:["Rome","Maya","Egypt","Greece"],correct:0,fact:"Roman numerals on the coin point to Roman influence.",xp:25},
  {question:"The geometric tile patterns suggest later inhabitants were influenced by which culture?",options:["Viking","Aztec","Moroccan / Islamic","Maya"],correct:2,fact:"Intricate geometric mosaics are a hallmark of Moroccan and Islamic art.",xp:25},
  {question:"Putting all clues together, what is the best conclusion about this site?",options:["Occupied by multiple civilizations over time","It was never inhabited","Built in a single day","It belongs to aliens"],correct:0,fact:"Many real sites show layers from different civilizations across centuries!",xp:30},
];
function advInitL5(){
  setPip("This is the big one — a real mystery! Use your detective skills, Master Archaeologist.","thinking");
  advQuiz('adv-quiz-l5',L5_QUIZ,()=>{advAwardBadge('level5');launchConfetti(30);document.getElementById('adv-l5-continue').classList.remove('hidden');});
}

// WIN
function advInitWin(){
  advAwardBadge('final');launchConfetti(80);addXP(100);
  setPip("You did it!! I'm SO proud of you! 🏆","excited");
  document.getElementById('adv-win-msg').textContent=`Amazing work, ${advState.playerName}! You explored, dug, identified artifacts, learned about civilizations, and solved the mystery. You are now a true Master Archaeologist!`;
  document.getElementById('adv-final-xp').textContent=advState.xp;
  const wb=document.getElementById('adv-win-badges'); wb.innerHTML='';
  advState.badges.forEach(id=>{const b=ADV_BADGES[id];const el=document.createElement('div');el.className='badge';el.textContent=b.icon+' '+b.name;wb.appendChild(el);});
}
function advInitCert(){
  document.getElementById('adv-cert-name').textContent=advState.playerName;
  document.getElementById('adv-cert-date').textContent='Awarded on '+new Date().toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'});
  const cb=document.getElementById('adv-cert-badges'); cb.innerHTML='';
  advState.badges.forEach(id=>{const b=ADV_BADGES[id];const el=document.createElement('div');el.className='badge';el.textContent=b.icon+' '+b.name;cb.appendChild(el);});
}
function advReset(){
  advState={playerName:"Explorer",xp:0,maxXp:500,badges:[],streak:0,timer:null};
  document.getElementById('adv-badges-row').innerHTML='';
  document.getElementById('adv-l1-continue').disabled=true;
  document.getElementById('adv-dig-section').classList.add('hidden');
  document.getElementById('adv-level1-msg').textContent='';
  document.getElementById('adv-quiz-section-l2').classList.add('hidden');
  ['adv-l2-continue','adv-l3-continue','adv-l4-continue','adv-l5-continue'].forEach(id=>document.getElementById(id).classList.add('hidden'));
  initAdventure();
}

// Adventure event listeners
document.getElementById('adv-start-btn').addEventListener('click',()=>{
  advState.playerName=document.getElementById('adv-player-name').value.trim()||'Explorer';
  showAdvScreen('adv-screen-level1');advInitL1();
});
document.getElementById('adv-l1-continue').addEventListener('click',()=>{showAdvScreen('adv-screen-level2');advInitL2();});
document.getElementById('adv-l2-continue').addEventListener('click',()=>{showAdvScreen('adv-screen-level3');advInitL3();});
document.getElementById('adv-l3-continue').addEventListener('click',()=>{showAdvScreen('adv-screen-level4');advInitL4();});
document.getElementById('adv-l4-continue').addEventListener('click',()=>{showAdvScreen('adv-screen-level5');advInitL5();});
document.getElementById('adv-l5-continue').addEventListener('click',()=>{showAdvScreen('adv-screen-win');advInitWin();});
document.getElementById('adv-cert-btn').addEventListener('click',()=>{showAdvScreen('adv-screen-certificate');advInitCert();});
document.getElementById('adv-print-btn').addEventListener('click',()=>window.print());
document.getElementById('adv-restart-btn').addEventListener('click',advReset);

/* ══════════════════════════════════════════════
   ARCHEOBOT
══════════════════════════════════════════════ */
/* ══════════════════════════════════════════════
   WIKIPEDIA API — free, no key needed
══════════════════════════════════════════════ */

// Search Wikipedia and return top result title
async function wikiSearch(query) {
  const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=3&format=json&origin=*`;
  const r = await fetch(url);
  const d = await r.json();
  // d[1] = titles array, return first hit
  return d[1]?.[0] || null;
}

// Get page summary from Wikipedia REST API
async function wikiSummary(title) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const r = await fetch(url);
  if (!r.ok) return null;
  const d = await r.json();
  return d;
}

// Smart fetch: try direct title, fall back to search
async function wikiFetch(query) {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
    );
    if (!res.ok) {
      // Fall back to search if direct lookup fails
      const title = await wikiSearch(query);
      if (!title) return null;
      const res2 = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
      );
      if (!res2.ok) return null;
      return await res2.json();
    }
    return await res.json();
  } catch(err) {
    console.error(err);
    return null;
  }
}

// Format Wikipedia extract into clean readable text
function wikiFormat(extract, maxLen) {
  if (!extract) return null;
  // Strip HTML tags
  const clean = extract.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (maxLen && clean.length > maxLen) {
    const cut = clean.lastIndexOf(' ', maxLen);
    return clean.substring(0, cut > 0 ? cut : maxLen) + '…';
  }
  return clean;
}

const AB_CHIPS = ["What is archaeology?","Tell me about Morocco","Volubilis ruins","Ancient Egypt pyramids","Maya civilization","Petra Jordan","What is stratigraphy?"];
function abAddMessage(text, role) {
  const msgs = document.getElementById('ab-messages');
  const div = document.createElement('div'); div.className = `ab-msg ab-msg-${role}`;
  div.innerHTML = `<div class="ab-bubble">${text}</div>`;
  msgs.appendChild(div); msgs.scrollTop = msgs.scrollHeight;
}
function abShowTyping() {
  const msgs = document.getElementById('ab-messages');
  const div = document.createElement('div'); div.className = 'ab-msg ab-msg-bot'; div.id = 'ab-typing';
  div.innerHTML = '<div class="ab-bubble ab-typing"><span class="ab-dot"></span><span class="ab-dot"></span><span class="ab-dot"></span></div>';
  msgs.appendChild(div); msgs.scrollTop = msgs.scrollHeight;
}
function abRemoveTyping() { document.getElementById('ab-typing')?.remove(); }
async function abSend(text) {
  if (!text.trim()) return;
  abAddMessage(text, 'user');
  document.getElementById('ab-input').value = '';
  document.getElementById('ab-send').disabled = true;
  document.getElementById('ab-chips').innerHTML = '';
  abShowTyping();

  try {
    // Build smart search query for archaeology context
    const query = text.toLowerCase().includes('archaeo') ||
                  text.toLowerCase().includes('ancient') ||
                  text.toLowerCase().includes('dig') ||
                  text.toLowerCase().includes('artifact')
      ? text
      : text + ' ancient history archaeology';

    const wiki = await wikiFetch(query);

    abRemoveTyping();

    if (wiki && wiki.extract) {
      const extract = wikiFormat(wiki.extract, 400);
      const emoji = getArcheoEmoji(wiki.title);
      const link = `https://en.wikipedia.org/wiki/${encodeURIComponent(wiki.title)}`;
      abAddMessage(
        `${emoji} <strong>${wiki.title}</strong><br><br>${extract}<br><br>` +
        `<a href="${link}" target="_blank" rel="noopener" style="font-size:.75rem;color:var(--camel);opacity:.8">📖 Read more on Wikipedia</a>`,
        'bot'
      );
    } else {
      // Local fallback answers
      abAddMessage(getLocalAnswer(text), 'bot');
    }
  } catch(e) {
    abRemoveTyping();
    abAddMessage(getLocalAnswer(text), 'bot');
  }

  document.getElementById('ab-send').disabled = false;
  const chips = document.getElementById('ab-chips'); chips.innerHTML = '';
  AB_CHIPS.slice(0, 4).forEach(c => {
    const btn = document.createElement('button'); btn.className = 'ab-chip'; btn.textContent = c;
    btn.addEventListener('click', () => abSend(c)); chips.appendChild(btn);
  });
}

// Pick a relevant emoji for the Wikipedia topic
function getArcheoEmoji(title) {
  const t = title.toLowerCase();
  if (t.includes('egypt') || t.includes('pyramid')) return '🔺';
  if (t.includes('morocco') || t.includes('volubilis') || t.includes('roman')) return '🏛️';
  if (t.includes('maya') || t.includes('inca') || t.includes('aztec')) return '🌽';
  if (t.includes('greece') || t.includes('greek') || t.includes('athen')) return '🏺';
  if (t.includes('petra') || t.includes('jordan')) return '🌹';
  if (t.includes('china') || t.includes('terracotta')) return '🗿';
  if (t.includes('archeolog') || t.includes('excavat')) return '⛏️';
  if (t.includes('artifact') || t.includes('pottery')) return '🏺';
  return '🌍';
}

// Local fallback answers when Wikipedia can't help
function getLocalAnswer(text) {
  const t = text.toLowerCase();
  if (t.includes('morocco') || t.includes('volubilis') || t.includes('chellah'))
    return '🏛️ Morocco has over 3,000 years of layered history — Phoenicians, Romans, Berbers, and Islamic dynasties all left their mark! Sites like Volubilis and Chellah are UNESCO-listed treasures.';
  if (t.includes('egypt') || t.includes('pyramid'))
    return '🔺 Ancient Egypt flourished for over 3,000 years! The Great Pyramid was the world\'s tallest structure for 3,800 years. They invented hieroglyphics — one of the first writing systems ever!';
  if (t.includes('maya'))
    return '🌽 The Maya developed advanced mathematics, a 365-day calendar, and a complex writing system. Their pyramids align perfectly with astronomical events!';
  if (t.includes('greece') || t.includes('greek'))
    return '🏺 Ancient Greece gave us democracy, philosophy, the Olympic Games, and theatre. The Parthenon has stood for over 2,400 years despite wars and earthquakes!';
  if (t.includes('archaeolog') || t.includes('dig') || t.includes('excavat'))
    return '⛏️ Archaeology is the study of human history through physical remains! Archaeologists carefully dig layer by layer — the deeper they go, the older the objects they find.';
  if (t.includes('artifact') || t.includes('pottery') || t.includes('coin'))
    return '🏺 Artifacts are objects made or used by humans in the past. Even a tiny broken piece of pottery — called a "sherd" — can reveal what people ate, how they traded, and when they lived!';
  return '🌍 Great question! Archaeology connects us to our shared human story. Every artifact, ruin, and ancient site is a message from the past waiting to be uncovered. Try asking about a specific site or civilization!';
}
document.getElementById('ab-trigger').addEventListener('click',()=>{
  const panel=document.getElementById('ab-panel'); const open=panel.classList.toggle('ab-visible');
  document.getElementById('ab-trigger').classList.toggle('ab-open',open);
  document.getElementById('ab-trigger').setAttribute('aria-expanded',open);
  if(open&&!document.getElementById('ab-messages').children.length){
    abAddMessage("Hi! I'm AncientAI 🤖 Ask me anything about archaeology, ancient civilizations, or famous sites!","bot");
    const chips=document.getElementById('ab-chips'); chips.innerHTML='';
    AB_CHIPS.forEach(c=>{const btn=document.createElement('button');btn.className='ab-chip';btn.textContent=c;btn.addEventListener('click',()=>abSend(c));chips.appendChild(btn);});
  }
});
document.getElementById('ab-close').addEventListener('click',()=>{
  document.getElementById('ab-panel').classList.remove('ab-visible');
  document.getElementById('ab-trigger').classList.remove('ab-open');
});
document.getElementById('ab-send').addEventListener('click',()=>abSend(document.getElementById('ab-input').value));
document.getElementById('ab-input').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();abSend(e.target.value);}});

/* ── INIT ── */
applyTranslations();
// Pre-render sites so Explore page is ready immediately
SITES = getCurrentSites();
renderSites(getCurrentSites());
window._exploreInit = true;
