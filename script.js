let count = 0;
const daysList = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];

// بصمة المبرمج SAMEHELNADY
console.log("%cDeveloped by SAMEHELNADY", "color:gold; font-size:20px; font-weight:bold;");

function addCount() { 
    count++; 
    document.getElementById('counter').innerText = count; 
    
    // تشغيل الصوت والاهتزاز
    const snd = document.getElementById('clickSound');
    if(snd) { snd.currentTime = 0; snd.play(); }
    if(navigator.vibrate) navigator.vibrate(40); 
}

function resetCounter() { 
    count = 0; 
    document.getElementById('counter').innerText = 0; 
}

function setZekr(z) { 
    document.getElementById('zekrName').innerText = z; 
    resetCounter(); 
}

function showPage(p) {
    document.getElementById('subhaPage').style.display = p === 'subha' ? 'block' : 'none';
    document.getElementById('prayerPage').style.display = p === 'prayer' ? 'block' : 'none';
}

function toggleSettings() {
    let s = document.getElementById('settingsPanel');
    if(s) s.style.display = (s.style.display === 'block') ? 'none' : 'block';
}

// توليد الجدول عند تحميل الصفحة
window.onload = function() {
    const tableBody = document.getElementById('tableBody');
    if(tableBody) {
        tableBody.innerHTML = ""; // مسح المحتوى القديم أولاً
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

// حماية الكود ومنع كليك يمين
document.addEventListener('contextmenu', e => e.preventDefault());
