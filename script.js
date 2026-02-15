/**
 * ISKAR - Ramadan Application 2026
 * Developed by: ISKAR (Sameh Elnady)
 */

let count = 0;
let audioCtx;
let currentAzanAudio = null; // لتخزين صوت الأذان الحالي للتحكم به
window.lastAzanTime = "";

// 1. وظيفة التسبيح (تكة + اهتزاز)
function addCount() {
    count++;
    document.getElementById('counter').innerText = count;
    
    if(document.getElementById('vibrateToggle').checked && navigator.vibrate) {
        navigator.vibrate(40);
    }

    if(document.getElementById('soundToggle').checked) {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        
        try {
            let osc = audioCtx.createOscillator();
            let gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.05);
        } catch(e) { console.log("Audio Error"); }
    }
}

function resetCounter() { count = 0; document.getElementById('counter').innerText = 0; }
function setZekr(z) { document.getElementById('zekrName').innerText = z; resetCounter(); }

// 2. تحديث قائمة المدن
function updateCityList() {
    const r = document.getElementById('regionSelect').value;
    const s = document.getElementById('citySelect');
    s.innerHTML = "";

    const egyptCities = [
        {n:"القاهرة",v:"Cairo"}, {n:"الإسكندرية",v:"Alexandria"}, {n:"الجيزة",v:"Giza"},
        {n:"المنصورة",v:"Mansoura"}, {n:"المحلة الكبرى",v:"El Mahalla El Kubra"}, {n:"طنطا",v:"Tanta"},
        {n:"أسيوط",v:"Asyut"}, {n:"سوهاج",v:"Sohag"}, {n:"الأقصر",v:"Luxor"},
        {n:"أسوان",v:"Aswan"}, {n:"المنيا",v:"Minya"}, {n:"بني سويف",v:"Beni Suef"},
        {n:"الفيوم",v:"Faiyum"}, {n:"الإسماعيلية",v:"Ismailia"}, {n:"السويس",v:"Suez"},
        {n:"بورسعيد",v:"Port Said"}, {n:"دمياط",v:"Damietta"}, {n:"الزقازيق",v:"Zagazig"},
        {n:"شبين الكوم",v:"Shibin El Kom"}, {n:"كفر الشيخ",v:"Kafr El Sheikh"}, {n:"دمنهور",v:"Damanhur"},
        {n:"قنا",v:"Qena"}, {n:"مرسى مطروح",v:"Marsa Matruh"}, {n:"العريش",v:"Arish"}
    ];

    const worldCapitals = [
        {n:"السعودية - مكة", v:"Mecca", c:"Saudi Arabia"},
        {n:"الكويت - العاصمة", v:"Kuwait City", c:"Kuwait"},
        {n:"قطر - الدوحة", v:"Doha", c:"Qatar"},
        {n:"الإمارات - دبي", v:"Dubai", c:"United Arab Emirates"},
        {n:"فلسطين - القدس", v:"Jerusalem", c:"Palestine"},
        {n:"ليبيا - طرابلس", v:"Tripoli", c:"Libya"},
        {n:"الجزائر - العاصمة", v:"Algiers", c:"Algeria"},
        {n:"تونس - العاصمة", v:"Tunis", c:"Tunisia"},
        {n:"المغرب - الرباط", v:"Rabat", c:"Morocco"},
        {n:"السودان - الخرطوم", v:"Khartoum", c:"Sudan"}
    ];

    const list = r === "Egypt" ? egyptCities : worldCapitals;
    list.forEach(c => {
        let o = document.createElement("option");
        o.value = c.v; o.text = c.n;
        if(c.c) o.setAttribute("data-country", c.c);
        s.appendChild(o);
    });
    getPrayerTimes();
}

// 3. جلب مواقيت الصلاة
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
        for(let k in pAr) {
            tb.innerHTML += `<tr><td style="color:gold">${pAr[k]}</td><td class="time-cell">${t[k]}</td></tr>`;
        }
    } catch(e) { tb.innerHTML = "<tr><td colspan='2'>خطأ في الاتصال</td></tr>"; }
}

// 4. وظيفة الأذان (تجربة + إيقاف + تلقائي)
function playAzan() {
    const btn = document.getElementById('playBtn');

    // إذا كان الأذان يعمل بالفعل، قم بإيقافه
    if (currentAzanAudio && !currentAzanAudio.paused) {
        currentAzanAudio.pause();
        currentAzanAudio.currentTime = 0;
        if(btn) btn.innerText = "▶️ تجربة الأذان";
        return;
    }

    // اختيار ملف عشوائي وتشغيله
    const azanFiles = ["Egypt.mp3", "Egypt_1.mp3", "Egypt_2.mp3", "Egypt_3.mp3"];
    const randomAzan = azanFiles[Math.floor(Math.random() * azanFiles.length)];
    
    currentAzanAudio = new Audio(randomAzan);
    
    if(btn) btn.innerText = "⏳ جاري التحميل...";

    currentAzanAudio.play().then(() => {
        if(btn) btn.innerText = "⏸️ إيقاف الأذان";
    }).catch(() => {
        if(btn) btn.innerText = "▶️ تجربة الأذان";
        console.log("تنبيه: المس الشاشة لتفعيل الصوت");
    });

    // إعادة شكل الزر عند انتهاء الصوت تلقائياً
    currentAzanAudio.onended = () => {
        if(btn) btn.innerText = "▶️ تجربة الأذان";
    };
}

function monitorTime() {
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
    const cells = document.querySelectorAll(".time-cell");
    
    cells.forEach(cell => {
        if (cell.innerText.trim() === currentTime && window.lastAzanTime !== currentTime) {
            playAzan(); // سيتم التشغيل التلقائي هنا
            window.lastAzanTime = currentTime;
        }
    });
}
setInterval(monitorTime, 30000);

// 5. التحكم في الواجهة
function showPage(p) {
    document.getElementById('subhaPage').style.display = p==='subha'?'block':'none';
    document.getElementById('prayerPage').style.display = p==='prayer'?'block':'none';
    document.getElementById('navSubha').className = p==='subha'?'active':'';
    document.getElementById('navPrayer').className = p==='prayer'?'active':'';
}

document.addEventListener('contextmenu', e => e.preventDefault());

window.onload = () => {
    updateCityList();
};
