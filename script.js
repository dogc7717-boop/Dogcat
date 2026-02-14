let count = 0;
const daysList = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];

// بصمة التطبيق ISKAR
console.log("%cDeveloped by ISKAR", "color:gold; font-size:25px; font-weight:bold;");

// 1. وظيفة التسبيح (تكة اهتزاز + صوت نظام) بدلاً من الملفات المرفوعة
function addCount() { 
    count++; 
    document.getElementById('counter').innerText = count; 
    
    // اهتزاز الموبايل
    if(navigator.vibrate) navigator.vibrate(40); 

    // توليد صوت تكة برمجياً (Beep) لسرعة الأداء
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.05);
    } catch(e) { console.log("التكة الصوتية مدعومة في الموبايل عند التفاعل"); }
}

// 2. وظيفة الأذان المرتبطة بأسماء الملفات اللي حددتها
function playAzan() {
    // الأسماء كما طلبتها بالضبط
    const azanFiles = ["مصر.mp3", "مصر 1.mp3", "مصر 2.mp3", "مصر 3.mp3"];
    const randomAzan = azanFiles[Math.floor(Math.random() * azanFiles.length)];
    const audio = new Audio(randomAzan);
    audio.play().catch(err => console.log("تطلب المتصفح تفاعل المستخدم أولاً"));
}

// 3. مراقبة مواقيت الصلاة في الجدول كل دقيقة
function monitorPrayerTimes() {
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ":" + 
                        now.getMinutes().toString().padStart(2, '0');

    // قراءة كل الخلايا القابلة للتعديل في الجدول (المواقيت)
    const timeCells = document.querySelectorAll("td[contenteditable='true']");
    timeCells.forEach(cell => {
        if (cell.innerText.trim() === currentTime) {
            playAzan();
        }
    });
}

// فحص الوقت كل دقيقة (60000 مللي ثانية)
setInterval(monitorPrayerTimes, 60000);

function resetCounter() { 
    count = 0; 
    document.getElementById('counter').innerText = 0; 
}

function showPage(p) {
    document.getElementById('subhaPage').style.display = p === 'subha' ? 'block' : 'none';
    document.getElementById('prayerPage').style.display = p === 'prayer' ? 'block' : 'none';
}

window.onload = function() {
    const tableBody = document.getElementById('tableBody');
    if(tableBody) {
        tableBody.innerHTML = ""; 
        daysList.forEach(d => {
            tableBody.innerHTML += `
            <tr>
                <td style="font-weight:bold; color:gold;">${d}</td>
                <td contenteditable="true">04:15</td> 
                <td contenteditable="true">04:30</td> 
                <td contenteditable="true">12:05</td> 
                <td contenteditable="true">03:20</td> 
                <td contenteditable="true">06:10</td> 
                <td contenteditable="true">07:30</td> 
            </tr>`;
        });
    }
};

document.addEventListener('contextmenu', e => e.preventDefault());
