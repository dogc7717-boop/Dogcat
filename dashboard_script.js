// التحقق من وجود مستخدم مسجل دخول
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
  window.location.href = "login_page.html";
}

// عرض اسم المستخدم
const welcomeText = document.getElementById("welcomeUser");
if (welcomeText && currentUser) {
  welcomeText.innerText = "مرحباً، " + currentUser.name;
}

// تسجيل خروج
function logoutUser() {
  localStorage.removeItem("currentUser");
  window.location.href = "login_page.html";
}