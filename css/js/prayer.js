// ===================
// توليد جدول الأيام والصلوات تلقائياً
// ===================
const days = ["الأربعاء","الخميس","الجمعة","السبت","الأحد","الإثنين","الثلاثاء"];
const prayers = ["إمساك","فجر","ظهر","عصر","مغرب","عشاء"];
const tableBody = document.getElementById("prayerTable");

days.forEach(day => {
  const tr = document.createElement("tr");
  const tdDay = document.createElement("td");
  tdDay.innerText = day;
  tr.appendChild(tdDay);
  prayers.forEach(() => {
    const td = document.createElement("td");
    td.innerText = "-";
    tr.appendChild(td);
  });
  tableBody.appendChild(tr);
});

// ===================
// إضافة وقت الصلاة حسب الاختيار
// ===================
function addPrayer() {
  const daySelected = document.getElementById("daySelect").value;
  const timeSelected = document.getElementById("timeSelect").value;
  const inputTime = document.getElementById("prayerInput").value;

  if(!inputTime) return alert("أدخل الوقت أولاً");

  const rowIndex = days.indexOf(daySelected);
  const colIndex = prayers.indexOf(timeSelected) + 1; // العمود الأول لاسم اليوم

  const table = document.getElementById("prayerTable");
  table.rows[rowIndex].cells[colIndex].innerText = inputTime;
}
