document.addEventListener("DOMContentLoaded", function () {
  loadNavbar();
});

function loadNavbar() {
  fetch("http://localhost:8888/frontend/navbar.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response error");
      }
      return response.text();
    })
    .then((data) => {
      document.getElementById("navbar-placeholder").innerHTML = data;
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
    // If the user is logged in, hide Home, Log In, and Register buttons; show Log Out.
    if (homeBtn) homeBtn.style.display = "none";
    if (loginBtn) loginBtn.style.display = "none";
    if (registerBtn) registerBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
  } else {
    // If not logged in, show Home, Log In, and Register; hide Log Out.
    if (homeBtn) homeBtn.style.display = "inline-block";
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (registerBtn) registerBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
  }
}

function logoutUser() {
  // Clear the stored login information from localStorage
  localStorage.removeItem("username");
  localStorage.removeItem("userType");

  // Call the logout API (adjust relative path: from "frontend/js", API is two levels up in "api")
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
