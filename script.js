let count = 0, subhan = 0, alhamd = 0, akbar = 0;
let adhanAudio = new Audio();

function showPage(p) {
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    document.querySelectorAll('nav span').forEach(s => s.classList.remove('active'));
    document.getElementById(p + 'Page').style.display = 'block';
    document.getElementById('nav' + p.charAt(0).toUpperCase() + p.slice(1)).classList.add('active');
}

function specificZekr(type) {
    if(type === 'subhan') { 
        subhan++; 
        document.getElementById('subhanCount').innerText = subhan; 
    } else if(type === 'alhamd') { 
        alhamd++; 
        document.getElementById('alhamdCount').innerText = alhamd; 
    } else if(type === 'akbar') { 
        akbar++; 
        document.getElementById('akbarCount').innerText = akbar; 
    }
    
    count++;
    document.getElementById('counter').innerText = count;
    
    if(navigator.vibrate) navigator.vibrate(50);
}

function resetAllCounters() {
    if(confirm("هل تريد تصفير جميع العدادات؟")) {
        count = 0; subhan = 0; alhamd = 0; akbar = 0;
        document.getElementById('counter').innerText = 0;
        document.getElementById('subhanCount').innerText = 0;
        document.getElementById('alhamdCount').innerText = 0;
        document.getElementById('akbarCount').innerText = 0;
    }
}

async function getPrayerTimes() {
    const city = document.getElementById('citySelect').value;
    try {
        const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Egypt&method=4`);
        const data = await res.json();
        const t = data.data.timings;
        window.timings = t;
        document.getElementById('prayerTable').innerHTML = `
            <table>
                <tr><td>الفجر</td><td>${t.Fajr}</td></tr>
                <tr><td>الظهر</td><td>${t.Dhuhr}</td></tr>
                <tr style="color:gold"><td>المغرب</td><td>${t.Maghrib}</td></tr>
                <tr><td>العشاء</td><td>${t.Isha}</td></tr>
            </table>`;
    } catch(e) { console.error("خطأ في جلب البيانات"); }
}

function playAdhan() {
    adhanAudio.src = "./" + document.getElementById('adhanSelect').value;
    adhanAudio.play().catch(e => alert("اضغط على الشاشة أولاً لتشغيل الصوت"));
}

function stopAdhan() { adhanAudio.pause(); adhanAudio.currentTime = 0; }
function saveAdhan() { localStorage.setItem('myAdhan', document.getElementById('adhanSelect').value); }

setInterval(() => {
    if(!window.timings) return;
    const now = new Date();
    const time = now.getHours().toString().padStart(2,'0') + ":" + now.getMinutes().toString().padStart(2,'0');
    if(now.getSeconds() === 0) {
        const prayerTimes = [window.timings.Fajr, window.timings.Dhuhr, window.timings.Asr, window.timings.Maghrib, window.timings.Isha];
        if(prayerTimes.includes(time)) {
            const sound = localStorage.getItem('myAdhan') || 'Egypt.mp3';
            new Audio("./" + sound).play();
        }
    }
}, 1000);

window.onload = () => {
    getPrayerTimes();
    const saved = localStorage.getItem('myAdhan');
    if(saved) document.getElementById('adhanSelect').value = saved;
};
