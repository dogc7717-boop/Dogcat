// ===== حماية الصفحة (لازم يكون مسجل دخول) =====
let currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) {
  window.location.href = "login_page.html";
}

// ===== بيانات الآيات =====
const quranTable = [
  { verse: "يا أيها الذين آمنوا كتب عليكم الصيام كما كتب على الذين من قبلكم لعلكم تتقون" },
  { verse: "شهر رمضان الذي أنزل فيه القرآن هدى للناس وبينات من الهدى والفرقان" },
  { verse: "وإذا سألك عبادي عني فإني قريب أجيب دعوة الداع إذا دعان" },
  { verse: "إن الله يحب التوابين ويحب المطهرين" },
  { verse: "إن رحمة الله قريب من المحسنين" },
  { verse: "واسجد واقترب" },
  { verse: "واذكر ربك في نفسك تضرعا وخيفة" },
  { verse: "إن أكرمكم عند الله أتقاكم" }
];

// ===== عناصر الصفحة =====
let sessionCount = 0;
let totalCount = Number(localStorage.getItem("totalCount")) || 0;

const sessionSpan = document.getElementById("sessionCount");
const totalSpan = document.getElementById("totalCount");
const resetTotal = document.getElementById("resetTotal");
const popup = document.getElementById("popup");

const btn = document.getElementById("btn");
const input = document.getElementById("textInput");
const resultDiv = document.getElementById("result");
const verseListDiv = document.getElementById("verseList");

const tasbeehBtns = document.querySelectorAll(".tasbeeh-btn");
const subCounters = [
  document.getElementById("subCount0"),
  document.getElementById("subCount1"),
  document.getElementById("subCount2")
];

// ===== عرض الأرقام بشكل مربعات =====
function updateCounter(n, container){
  container.innerHTML = "";
  const digits = n.toString().split('');
  digits.forEach(d => {
    const box = document.createElement("span");
    box.className = "counter-box";
    box.innerText = d;
    container.appendChild(box);
  });
}

updateCounter(sessionCount, sessionSpan);
updateCounter(totalCount, totalSpan);

// ===== أزرار التسبيح =====
tasbeehBtns.forEach((btn,index)=>{
  let subCount = 0;
  btn.onclick = () => {
    subCount++;
    subCounters[index].innerText = subCount;

    sessionCount++;
    totalCount++;

    updateCounter(sessionCount, sessionSpan);
    updateCounter(totalCount, totalSpan);

    localStorage.setItem("totalCount", totalCount);

    if(sessionCount === 99){
      popup.style.display = "flex";
      setTimeout(()=>{
        popup.style.display = "none";
        sessionCount = 0;
        updateCounter(sessionCount, sessionSpan);
      },2000);
    }
  };
});

// ===== مسح العداد الدائم =====
resetTotal.onclick = () => {
  totalCount = 0;
  localStorage.setItem("totalCount", 0);
  updateCounter(totalCount, totalSpan);
};

// ===== البحث بدون تشكيل =====
btn.onclick = () => {
  const val = input.value.trim().toLowerCase();
  if (!val) return;

  verseListDiv.innerHTML = "";
  resultDiv.innerText = "";

  const foundItems = quranTable.filter(item => 
    item.verse.replace(/[\u064B-\u0652]/g, '').toLowerCase().includes(val)
  );

  if (foundItems.length > 0) {
    foundItems.forEach((item) => {
      if (resultDiv.innerText === "") resultDiv.innerText = item.verse;

      const div = document.createElement("div");
      div.className = "verse-item";
      div.innerText = item.verse;
      verseListDiv.appendChild(div);
    });
  } else {
    resultDiv.innerText = "لا يوجد نتيجة";
  }
};