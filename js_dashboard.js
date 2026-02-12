// ===== حماية الصفحة =====
function protect() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) { window.location.href = "index.html"; return; }
  if (!user.accepted_policy) { window.location.href = "policy.html"; return; }
}
protect();

// ===== تسجيل خروج =====
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

// ===== تبديل التبويبات =====
function showTab(id) {
  document.querySelectorAll(".tab").forEach(t => t.style.display = "none");
  document.querySelectorAll(".navbar button").forEach(b => b.classList.remove("active"));
  document.getElementById(id).style.display = "block";
  document.querySelector(`.navbar button[onclick="showTab('${id}')"]`).classList.add("active");

  if (id === "game") loadGame();
}

// ===== بيانات الاشتراكات =====
const subscriptionsData = [
  {name:"200ج",price:200,days:3},
  {name:"500ج",price:500,days:4},
  {name:"750ج",price:750,days:7},
  {name:"1000ج",price:1000,days:7},
  {name:"5000ج",price:5000,days:15},
  {name:"10000ج",price:10000,days:30},
  {name:"VIP1",price:25000,days:40},
  {name:"VIP2",price:50000,days:40},
];

// ===== تحميل البيانات =====
function load() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user.subscriptions) user.subscriptions = [];

  user.subscriptions = user.subscriptions.filter(s => new Date(s.end) > new Date());
  localStorage.setItem("currentUser", JSON.stringify(user));

  document.getElementById("userInfo").innerText =
`الاسم: ${user.name}
الهاتف: ${user.phone}
البريد: ${user.email}`;

  const subList = document.getElementById("subscriptionList");
  subList.innerHTML = "";
  user.subscriptions.forEach(s => {
    subList.innerHTML += `
      <div class="card">
        <h4>${s.name}</h4>
        <p class="count" data-end="${s.end}"></p>
      </div>`;
  });

  const available = document.getElementById("availableSubs");
  available.innerHTML = "";
  subscriptionsData.forEach((s,i) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<h4>${s.name}</h4><p>${s.price} جنيه</p><p>${s.days} يوم</p>`;
    div.onclick = () => buy(i);
    available.appendChild(div);
  });

  startCountdown();
}

// ===== شراء الاشتراك =====
function buy(index) {
  let user = JSON.parse(localStorage.getItem("currentUser"));
  const s = subscriptionsData[index];

  let end = new Date();
  end.setDate(end.getDate() + s.days);

  user.subscriptions.push({...s, end});
  localStorage.setItem("currentUser", JSON.stringify(user));

  load();
}

// ===== العد التنازلي للاشتراكات =====
function startCountdown() {
  document.querySelectorAll(".count").forEach(el => {
    const end = new Date(el.dataset.end);
    setInterval(() => {
      const diff = end - new Date();
      if (diff <= 0) { load(); return; }

      const d = Math.floor(diff/86400000);
      const h = Math.floor(diff/3600000)%24;
      const m = Math.floor(diff/60000)%60;
      const s = Math.floor(diff/1000)%60;

      el.innerText = `${d}ي ${h}س ${m}د ${s}ث`;
    }, 1000);
  });
}

// ===== تحميل اللعبة داخل iframe =====
function loadGame() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if(!user.subscriptions || user.subscriptions.length===0){
    document.getElementById("gameContainer").innerHTML =
      "<h3 style='text-align:center;padding:20px'>يجب الاشتراك أولاً للدخول للعبة</h3>";
    return;
  }

  document.getElementById("gameContainer").innerHTML =
    `<iframe src="game/index.html"></iframe>`;
}

load();