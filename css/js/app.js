function addPrayer() {
    const day = document.getElementById('daySelect').value;
    const type = document.getElementById('timeSelect').value;
    const time = document.getElementById('prayerInput').value;

    if (!time) {
        alert("يرجى اختيار الوقت أولاً ⚠️");
        return;
    }

    // إضافة صف جديد للجدول بشكل ديناميكي
    const table = document.getElementById('prayerTable');
    const newRow = table.insertRow();
    
    // ملاحظة: هنا بنملى البيانات كنموذج تجريبي
    for(let i=0; i<7; i++) {
        let cell = newRow.insertCell(i);
        cell.innerHTML = (i === 0) ? day : "--:--";
        if((i === 1 && type === "إمساك") || (i === 2 && type === "فجر")) cell.innerHTML = time;
        // يمكن تطوير المنطق لملء الخلية المحددة بالضبط
    }

    alert(`تم تحديث وقت ${type} ليوم ${day}`);
}

function toggleSettings() {
    alert("الإعدادات ستتوفر في التحديث القادم ⚙️");
    }
