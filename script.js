/**
 * ISKAR - Ramadan Application
 * Developed by: ISKAR
 */

let count = 0;
window.lastAzanTime = ""; // لمنع تكرار الأذان في نفس الدقيقة

// بصمة التطبيق في الكونسول
console.log("%cDeveloped by ISKAR", "color:gold; font-size:25px; font-weight:bold; text-shadow: 2px 2px 5px black;");

// --- 1. وظيفة التسبيح (تكة اهتزاز + صوت نظام داخلي) ---
function addCount() { 
    count++; 
    const counterElement = document.getElementById('counter');
    if(counterElement) counterElement.innerText = count; 
    
    // اهتزاز الهاتف (تكة ملموسة)
    if(navigator.vibrate) navigator.vibrate(40); 

    // توليد صوت تكة (Beep) برمجياً لسرعة الأداء وعدم الحاجة لملفات
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.05);
    } catch(e) { console.log("الصوت يحتاج تفاعل المستخدم"); }
}

// --- 2. وظيفة اختيار وتشغيل الأذان ---
function playAzan() {
    const selector = document.getElementById('azanSelector');
    // إذا لم يوجد اختيار، سيتم تشغيل "مصر.mp3" كافتراضي
    const soundFile = selector ? selector.value : "مصر.mp3";
    
    const audio = new Audio(soundFile);
    audio.play().catch(err => {
        console.log("يجب على المستخدم لمس الصفحة مرة واحدة لتفعيل الأذان التلقائي");
    });
}

// وظيفة زر "تجربة الصوت" في الإعدادات
function testAzanSound() {
    playAzan();
}

// --- 3. مراقبة مواقيت الصلاة من الجدول ---
function monitorPrayerTimes() {
    const now = new Date();
    // تنسيق الوقت الحالي (HH:mm) مثل 04:15
    const currentTime = now.getHours().toString().padStart(2, '0') + ":" + 
                        now.getMinutes().toString().padStart(2, '0');

    // قراءة الأوقات من الجدول (الخانات القابلة للتعديل)
    const timeCells = document.querySelectorAll("td[contenteditable='true']");
    timeCells.forEach(cell => {
        const prayerTime = cell.innerText.trim();
        
        if (prayerTime === currentTime) {
            // التأكد من تشغيل الأذان مرة واحدة فقط في هذه الدقيقة
            if (window.lastAzanTime !== currentTime) {
                playAzan();
                window.lastAzanTime = currentTime;
            }
        }
    });
}

// فحص الوقت كل 30 ثانية لضمان الدقة العالية
setInterval(monitorPrayerTimes, 30000);

// --- 4. الدوال المساعدة (التنقل وتصفير العداد) ---
function showPage(pageId) {
    const subhaPage = document.getElementById('subhaPage');
    const prayerPage = document.getElementById('prayerPage');
    
    if(pageId === 'subha') {
        subhaPage.style.display = 'block';
        prayerPage.style.display = 'none';
    } else {
        subhaPage.style.display = 'none';
        prayerPage.style.display = 'block';
    }
}

function resetCounter() { 
    count = 0; 
    const counterElement = document.getElementById('counter');
    if(counterElement) counterElement.innerText = 0; 
}

// منع القائمة المنسدلة (كليك يمين) لحماية التصميم
document.addEventListener('contextmenu', e => e.preventDefault());
