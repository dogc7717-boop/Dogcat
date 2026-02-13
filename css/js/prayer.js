document.addEventListener("DOMContentLoaded", function(){

  let prayers = JSON.parse(localStorage.getItem("prayers")) || {};

  const days = ["الأربعاء","الخميس","الجمعة","السبت","الأحد","الإثنين","الثلاثاء"];
  const times = ["إمساك","فجر","ظهر","عصر","مغرب","عشاء"];

  function renderTable(){
    days.forEach(day=>{
      times.forEach(time=>{
        const cellId = `${day}-${time}`;
        const cell = document.getElementById(cellId);
        if(cell) cell.innerText = prayers[cellId] || "";
      });
    });
  }
  renderTable();

  window.addPrayer = function(){
    const day = document.getElementById("daySelect").value;
    const time = document.getElementById("timeSelect").value;
    const input = document.getElementById("prayerInput").value;
    if(!input) return alert("أدخل وقت الصلاة");
    const cellId = `${day}-${time}`;
    prayers[cellId] = input;
    localStorage.setItem("prayers", JSON.stringify(prayers));
    renderTable();
  }

  // تشغيل صوت مرتبط بالصلاة (يجب الضغط مرة أولى لتفعيل المتصفح)
  window.playAudio = function(){
    if(window.audio) window.audio.play();
  }

});
