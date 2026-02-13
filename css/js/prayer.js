const days=["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
const prayers=["الفجر","الظهر","العصر","المغرب","العشاء"];

const tbody=document.querySelector("#prayerTable tbody");
let data=JSON.parse(localStorage.getItem("prayers")||"{}");

days.forEach(day=>{
let tr=document.createElement("tr");
let td=document.createElement("td");
td.innerText=day;
tr.appendChild(td);

prayers.forEach(p=>{
let td2=document.createElement("td");
let input=document.createElement("input");
input.type="time";
input.value=(data[day]&&data[day][p])||"";
input.id=day+p;
td2.appendChild(input);
tr.appendChild(td2);
});
tbody.appendChild(tr);
});

function savePrayers(){
let newData={};
days.forEach(day=>{
newData[day]={};
prayers.forEach(p=>{
newData[day][p]=document.getElementById(day+p).value;
});
});
localStorage.setItem("prayers",JSON.stringify(newData));
alert("تم الحفظ");
  }
