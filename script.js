// --- البيانات الأساسية ---
let counts = { subhan: 0, alhamd: 0, akbar: 0 };
let activeType = 'subhan';
let adhanAudio = new Audio();
const tickSound = new Audio('https://assets.mixkit.co/active_storage/sfx/3005/3005-preview.mp3'); tickSound.volume = 0.2;

const azkar30 = [
    "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير",
    "اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك وأنا على عهدك ووعدك ما استطعت",
    "سبحان الله وبحمده، عدد خلقه، ورضا نفسه، وزنة عرشه، ومداد كلماته",
    "اللهم صلِ وسلم وبارك على نبينا محمد",
    "أستغفر الله العظيم الذي لا إله إلا هو الحي القيوم وأتوب إليه",
    "لا حول ولا قوة إلا بالله العلي العظيم",
    "يا حي يا قيوم برحمتك أستغيث، أصلح لي شأني كله ولا تكلني إلى نفسي طرفة عين",
    "اللهم إني أسألك العفو والعافية في الدنيا والآخرة",
    "رضيت بالله رباً وبالإسلام ديناً وبمحمد صلى الله عليه وسلم نبياً",
    "حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم",
    // ... يكمل إلى 30 ذكراً
];

const citiesData = {
    "Egypt": ["Cairo", "Alexandria", "Giza", "Suez", "Port Said", "Mansoura", "Tanta", "Asyut", "Sohag", "Luxor", "Aswan"],
    "Saudi Arabia": ["Mecca", "Medina", "Riyadh", "Jeddah"],
    "Palestine": ["Jerusalem", "Gaza", "Ramallah"],
    "UAE": ["Dubai", "Abu Dhabi"],
    "USA": ["New York", "Washington", "Chicago"],
    "UK": ["London", "Manchester"]
};

// --- منطق المسبحة ---
function selectType(type, title) {
    activeType = type;
    document.querySelectorAll('.sub-card').forEach(c => c.classList.remove('active'));
    document.getElementById('card_' + type).classList.add('active');
    document.getElementById('activeZekrTitle').innerText = title;
    document.getElementById('mainCounter').innerText = counts[type];
}

function pressSubha() {
    counts[activeType]++;
    if (document.getElementById('soundKey').checked) tickSound.play();
    if (document.getElementById('vibrateKey').checked && navigator.vibrate) navigator.vibrate(40);
    
    document.getElementById('mainCounter').innerText = counts[activeType];
    document.getElementById('count_' + activeType).innerText = counts[activeType];

    if (counts[activeType] === 99) {
        alert("تم الانتهاء من 99 تسبيحة لـ " + document.getElementById('activeZekrTitle').innerText);
        saveToLog(activeType, 99);
        resetSingle(activeType);
    }
}

function resetSingle(type, event) {
    if(event) event.stopPropagation();
    if(counts[type] > 0) saveToLog(type, counts[type]);
    counts[type] = 0;
    document.getElementById('count_' + type).innerText = 0;
    if(activeType === type) document.getElementById('mainCounter').innerText = 0;
}

function saveToLog(type, val) {
    const time = new Date().toLocaleTimeString('ar-EG');
    const entry = `<div>تم تسبيح (${val}) لـ ${type} في ${time}</div>`;
    document.getElementById('subhaLog').insertAdjacentHTML('afterbegin', entry);
}

// --- منطق الأذكار كل ساعتين ---
function startAutoAzkar() {
    setInterval(() => {
        if (document.getElementById('autoAzkar').checked) {
            const rand = azkar30[Math.floor(Math.random() * azkar30.length)];
            alert("تذكير: " + rand);
        }
    }, 2 * 60 * 60 * 1000); // 2 ساعة
}

// --- منطق المواقيت والأذان ---
function updateCities() {
    const country = document.getElementById('countrySelect').value;
    const cities = citiesData[country] || [];
    let html = cities.map(c => `<option value="${c}">${c}</option>`).join('');
    document.getElementById('citySelect').innerHTML = html;
    getPrayers();
}

async function getPrayers() {
    const country = document.getElementById('countrySelect').value;
    const city = document.getElementById('citySelect').value;
    const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=4`);
    const data = await res.json();
    const t = data.data.timings;
    window.currentPrayers = t;
    document.getElementById('prayerResults').innerHTML = `
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:5px; text-align:center;">
            <div>الفجر: ${t.Fajr}</div><div>الظهر: ${t.Dhuhr}</div>
            <div>العصر: ${t.Asr}</div><div style="color:var(--gold)">المغرب: ${t.Maghrib}</div>
            <div>العشاء: ${t.Isha}</div>
        </div>`;
}

function playTestAdhan() {
    adhanAudio.src = document.getElementById('adhanVoice').value;
    adhanAudio.play().catch(e => alert("تأكد من وجود الملف الصوتي"));
}

function stopAdhan() { adhanAudio.pause(); adhanAudio.currentTime = 0; }

// فحص الأذان (الخلفية)
setInterval(() => {
    if (!window.currentPrayers) return;
    const now = new Date();
    const timeNow = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
    
    if (Object.values(window.currentPrayers).includes(timeNow) && now.getSeconds() === 0) {
        adhanAudio.src = document.getElementById('adhanVoice').value;
        adhanAudio.play();
    }
}, 1000);

// --- تهيئة الصفحة ---
function showPage(p) {
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    document.querySelectorAll('nav span').forEach(s => s.classList.remove('active'));
    document.getElementById(p + 'Page').style.display = 'block';
    document.getElementById('nav' + p.charAt(0).toUpperCase() + p.slice(1)).classList.add('active');
}

window.onload = () => {
    updateCities();
    startAutoAzkar();
    // بناء قائمة الأذكار
    let azkarHtml = azkar30.map(z => `<div class="zekr-card">${z}</div>`).join('');
    document.getElementById('azkarList').innerHTML = azkarHtml;
    selectType('subhan', 'سبحان الله');
};
