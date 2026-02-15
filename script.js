let count = 0;
let audioCtx;
let currentAzanAudio = null;
window.lastAzanTime = "";

// 1. التسبيح
function addCount() {
    count++;
    document.getElementById('counter').innerText = count;
    if(document.getElementById('vibrateToggle').checked && navigator.vibrate) navigator.vibrate(40);
    if(document.getElementById('soundToggle').checked) {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        let osc = audioCtx.createOscillator();
        let gain = audioCtx.createGain();
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        osc.start(); osc.stop(audioCtx.currentTime + 0.05);
    }
}
function resetCounter() { count = 0; document.getElementById('counter').innerText = 0; }
function setZekr(z) { document.getElementById('zekrName').innerText = z; resetCounter(); }

// 2. المدن والمحافظات
function updateCityList() {
    const r = document.getElementById('regionSelect').value;
    const s = document.getElementById('citySelect');
    s.innerHTML = "";
    const egyptCities = [
        {n:"القاهرة",v:"Cairo"}, {n:"الإسكندرية",v:"Alexandria"}, {n:"الجيزة",v:"Giza"}, {n:"المنصورة",v:"Mansoura"},
        {n:"طنطا",v:"Tanta"}, {n:"أسيوط",v:"Asyut"}, {n:"سوهاج",v:"Sohag"}, {n:"الأقصر",v:"Luxor"},
        {n:"أسوان",v:"Aswan"}, {n:"المنيا",v:"Minya"}, {n:"بني سويف",v:"Beni Suef"}, {n:"الفيوم",v:"Faiyum"},
        {n:"الإسماعيلية",v:"Ismailia"}, {n:"السويس",v:"Suez"}, {n:"بورسعيد",v:"Port Said"}, {n:"دمياط",v:"Damietta"},
        {n:"الزقازيق",v:"Zagazig"}, {n:"شبين الكوم",v:"Shibin El Kom"}, {n:"كفر الشيخ",v:"Kafr El Sheikh"},
        {n:"دمنهور",v:"Damanhur"}, {n:"قنا",v:"Qena"}, {n:"مرسى مطروح",v:"Marsa Matruh"}, {n:"العريش",v:"Arish"}, {n:"الغردقة",v:"Hurghada"}
    ];
    const worldCapitals = [
        {n:"السعودية - مكة", v:"Mecca", c:"Saudi Arabia"}, {n:"الكويت - العاصمة", v:"Kuwait City", c:"Kuwait"},
        {n:"قطر - الدوحة", v:"Doha", c:"Qatar"}, {n:"الإمارات - دبي", v:"Dubai", c:"United Arab Emirates"},
        {n:"فلسطين - القدس", v:"Jerusalem", c:"Palestine"}, {n:"ليبيا - طرابلس", v:"Tripoli", c:"Libya"},
        {n:"الجزائر - العاصمة", v:"Algiers", c:"Algeria"}, {n:"تونس - العاصمة", v:"Tunis", c:"Tunisia"},
        {n:"المغرب - الرباط", v:"Rabat", c:"Morocco"}, {n:"السودان - الخرطوم", v:"Khartoum", c:"Sudan"}
    ];
    const list = r === "Egypt" ? egyptCities : worldCapitals;
    list.forEach(c => {
        let o = document.createElement("option"); o.value = c.v; o.text = c.n;
        if(c.c) o.setAttribute("data-country", c.c);
        s.appendChild(o);
    });
    getPrayerTimes();
}

// 3. المواقيت
async function getPrayerTimes() {
    const r = document.getElementById('regionSelect').value;
    const s = document.getElementById('citySelect');
    const city = s.value;
    const country = r === "Egypt" ? "Egypt" : s.options[s.selectedIndex].getAttribute("data-country");
    const tb = document.getElementById('tableBody');
    tb.innerHTML = "<tr><td colspan='2'>جاري التحميل...</td></tr>";
    try {
        const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=4`);
        const d = await res.json();
        const t = d.data.timings;
        const pAr = {"Fajr":"الفجر","Sunrise":"الشروق","Dhuhr":"الظهر","Asr":"العصر","Maghrib":"المغرب","Isha":"العشاء"};
        tb.innerHTML = "";
        for(let k in pAr) tb.innerHTML += `<tr><td style="color:gold">${pAr[k]}</td><td class="time-cell">${t[k]}</td></tr>`;
    } catch(e) { tb.innerHTML = "<tr><td colspan='2'>خطأ في الاتصال</td></tr>"; }
}

// 4. تشغيل وإيقاف الأذان
function playAzan() {
    const btn = document.getElementById('playBtn');
    const selectedFile = document.getElementById('moazenSelect').value;
    if (currentAzanAudio && !currentAzanAudio.paused) {
        currentAzanAudio.pause(); currentAzanAudio.currentTime = 0;
        btn.innerText = "▶️ تجربة الأذان"; return;
    }
    currentAzanAudio = new Audio(selectedFile);
    btn.innerText = "⏳ جاري التحميل...";
    currentAzanAudio.play().then(() => btn.innerText = "⏸️ إيقاف الأذان")
    .catch(() => { btn.innerText = "▶️ تجربة الأذان"; alert("المس الشاشة لتفعيل الصوت"); });
    currentAzanAudio.onended = () => btn.innerText = "▶️ تجربة الأذان";
}

function monitorTime() {
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
    document.querySelectorAll(".time-cell").forEach(cell => {
        if (cell.innerText.trim() === currentTime && window.lastAzanTime !== currentTime) {
            playAzan(); window.lastAzanTime = currentTime;
        }
    });
}
setInterval(monitorTime, 30000);

function showPage(p) {
    document.getElementById('subhaPage').style.display = p==='subha'?'block':'none';
    document.getElementById('prayerPage').style.display = p==='prayer'?'block':'none';
    document.getElementById('navSubha').className = p==='subha'?'active':'';
    document.getElementById('navPrayer').className = p==='prayer'?'active':'';
}
window.onload = () => updateCityList();
