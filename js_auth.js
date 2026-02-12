// ===== تسجيل مستخدم جديد =====
function signupUser() {
  const name = document.getElementById("signupName").value.trim();
  const phone = document.getElementById("signupPhone").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const code = document.getElementById("signupCode").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("signupConfirm").value;

  if (!name || !phone || !email || !code || !password) {
    alert("أكمل جميع البيانات");
    return;
  }

  if (password !== confirm) {
    alert("كلمة المرور غير متطابقة");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.find(u => u.phone === phone)) {
    alert("رقم الهاتف مسجل مسبقاً");
    return;
  }

  const user = {
    name,
    phone,
    email,
    code,
    password,
    accepted_policy: false,
    subscriptions: []
  };

  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));

  alert("تم التسجيل بنجاح");
  window.location.href = "index.html";
}

// ===== تسجيل دخول =====
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const phone = document.getElementById("loginPhone").value.trim();
    const password = document.getElementById("loginPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.phone === phone && u.password === password);

    if (!user) {
      alert("بيانات غير صحيحة");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));

    if (!user.accepted_policy) {
      window.location.href = "policy.html";
    } else {
      window.location.href = "dashboard.html";
    }
  });
}