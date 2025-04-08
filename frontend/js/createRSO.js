document.addEventListener("DOMContentLoaded", function () {
  loadNavbar();
  setupCreateRSO();
  setupBackButton();
});

function loadNavbar() {
  fetch("../navbar.html")
    .then((response) => {
      if (!response.ok) throw new Error("Network response error");
      return response.text();
    })
    .then((html) => {
      document.getElementById("navbar-placeholder").innerHTML = html;
      adjustNavbar();
    })
    .catch((error) => console.error("Error loading navbar:", error));
}

function adjustNavbar() {
  const userType = localStorage.getItem("userType");
  const homeBtn = document.getElementById("homeBtn");
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  if (userType) {
    if (homeBtn) homeBtn.style.display = "none";
    if (loginBtn) loginBtn.style.display = "none";
    if (registerBtn) registerBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
  } else {
    if (homeBtn) homeBtn.style.display = "inline-block";
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (registerBtn) registerBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
  }
}

function logoutUser() {
  localStorage.removeItem("username");
  localStorage.removeItem("userType");
  fetch("../api/logout.php", {
    method: "GET",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      window.location.href = "../index.html";
    })
    .catch((error) => {
      console.error("Error during logout:", error);
      window.location.href = "../index.html";
    });
}

function setupCreateRSO() {
  const createRSOForm = document.getElementById("createRSOForm");
  if (!createRSOForm) {
    console.error("Create RSO form not found");
    return;
  }
  createRSOForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(createRSOForm);
    fetch("../api/createRSO.php", {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("RSO created successfully!");
          window.location.href = "dashboard.html";
        } else {
          alert("RSO creation failed: " + data.message);
        }
      })
      .catch((error) => console.error("Error during RSO creation:", error));
  });
}

function setupBackButton() {
  const backBtn = document.getElementById("backBtn");
  if (backBtn) {
    backBtn.addEventListener("click", function () {
      window.location.href = "dashboard.html";
    });
  }
}
