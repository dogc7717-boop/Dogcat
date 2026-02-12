// ===== الآيات =====
const quranTable = [
  { verse: "شهر رمضان الذي أنزل فيه القرآن هدى للناس وبينات من الهدى والفرقان ۚ فمن شهد منكم الشهر فليصمه ۖ ومن كان مريضا أو على سفر فعدة من أيام أخرى ۗ يريد الله بكم اليسر ولا يريد بكم العسر ولتُكملوا العدة ولتكبروا الله على ما هداكم ولعلّكم تشكرون" },
  { verse: "يا أيها الذين آمنوا كتب عليكم الصيام كما كتب على الذين من قبلكم لعلكم تتقون" },
  { verse: "أياما معدودات ۚ فمن كان منكم مريضا أو على سفر فعدة من أيام أخرى وعلى الذين يطيقونه فدية طعام مسكين ۖ فمن تطوع خيرا فهو خير له وإن تصوموا خير لكم إن كنتم تعلمون" },
  { verse: "وإذا سألَك عبادي عني فإني قريب أجيب دعوة الداع إذا دعان" },
  { verse: "أحل لكم ليلة الصيام الرفث إلى نسائكم وكلوا واشربوا حتى يتبين لكم الخيط الأبيض من الخيط الأسود من الفجر ثم أتِموا الصيام إلى الليل" },
  { verse: "ويطعمون الطعام على حبه مسكينا ويتيما أسيرا" },
  { verse: "وآت ذا القربى حقه والمسكين وابن السبيل ولا تبذر تبذيرا" },
  { verse: "فات ذا القربى حقه والمسكين وابن السبيل ذلك خير للذين يريدون وجه الله وأولئك هم المفلحون" },
  { verse: "ما أفاء الله على رسوله من أهل القرى فلله وللرسول ولذي القربى واليتمى والمساکين وابن السبيل" },
  { verse: "أو إطعام في يوم ذي مسغبة يتيم ذا مقرابة أو مسكينا ذا مترية" },
  { verse: "وآت ذا القربى حقه والمسكين وابن السبيل ولا تبذر تبذيرا" },
  { verse: "أنه كان لا يؤمن بالله العظيم ولا يحض على طعام المسكين" },
  { verse: "إنه إذا سألك عبادي عني فإني قريب أجيب دعوة الداع إذا دعان" },
  { verse: "إن رحمة الله قريب من المحسنين" },
  { verse: "قل إن كنتم تحبون الله فاتبعوني يحببكم الله ويغفر لكم ذنوبكم" },
  { verse: "إن أكرمكم عند الله أتقاكم" },
  { verse: "واسجد واقترب" },
  { verse: "واذكر ربك في نفسك تضرعا وخيفة" },
  { verse: "إن الله يحب التوابين ويحب المطهرين" },
  { verse: "وما أموالكم ولا أولادكم التي تقربكم عندنا زلفى إلا من آمن وعمل صالحا" },
  { verse: "تتجافى جنوبهم عن المضاجع يدعون ربهم خوفا وطمعا" }
];

// ===== العدادات =====
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
  localStorage.setItem("totalCount",0);
  updateCounter(totalCount, totalSpan);
};

// ===== البحث داخل نصوص الآيات بدون تشكيل =====
btn.onclick = () => {
  const val = input.value.trim().toLowerCase();
  if (!val) return;

  verseListDiv.innerHTML = "";
  resultDiv.innerText = "";

  const foundItems = quranTable.filter(item => 
    item.verse.replace(/[\u064B-\u0652]/g, '').toLowerCase().includes(val)
  );

  if (foundItems.length > 0) {
    foundItems.forEach((item, i) => {
      if (resultDiv.innerText === "") resultDiv.innerText = item.verse;

      const div = document.createElement("div");
      div.className = "verse-item";
      div.innerText = item.verse;
      div.onclick = () => div.classList.toggle("expanded");
      verseListDiv.appendChild(div);
    });
  } else {
    resultDiv.innerText = "لا يوجد نتيجة";
  }
};