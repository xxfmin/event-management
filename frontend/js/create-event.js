document.addEventListener("DOMContentLoaded", function () {
  loadNavbar();
  setupCreateEvent();
  setupBackButton();
});

function loadNavbar() {
  fetch("http://localhost:8888/frontend/navbar.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response error");
      }
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

// Global logout function
function logoutUser() {
  localStorage.removeItem("username");
  localStorage.removeItem("userType");

  fetch("http://localhost:8888/api/logout.php", {
    method: "GET",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      window.location.href = "http://localhost:8888/frontend/index.html";
    })
    .catch((error) => {
      console.error("Error during logout:", error);
      window.location.href = "http://localhost:8888/frontend/index.html";
    });
}

// Setup the Create Event form submission
function setupCreateEvent() {
  const createEventForm = document.getElementById("createEventForm");
  if (!createEventForm) {
    console.error("Create Event form not found");
    return;
  }
  createEventForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(createEventForm);
    fetch("http://localhost:8888/api/createEvent.php", {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Event created successfully!");
          window.location.href = "dashboard.html";
        } else {
          alert("Event creation failed: " + data.message);
        }
      })
      .catch((error) => console.error("Error during event creation:", error));
  });
}

// ---------- Back Button Functionality ----------
function setupBackButton() {
  const backBtn = document.getElementById("backBtn");
  if (backBtn) {
    backBtn.addEventListener("click", function () {
      window.location.href = "http://localhost:8888/frontend/dashboard.html";
    });
  }
}
