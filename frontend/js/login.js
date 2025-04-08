document.addEventListener("DOMContentLoaded", function () {
  loadNavbar();
  setupLogin();
});

function loadNavbar() {
  fetch("navbar.html")
    .then((response) => {
      if (!response.ok) throw new Error("Network response error");
      return response.text();
    })
    .then((data) => {
      document.getElementById("navbar-placeholder").innerHTML = data;
    })
    .catch((error) => console.error("Error loading navbar:", error));
}

// function loadNavbar() {
//   fetch("http://localhost:8888/frontend/navbar.html")
//     .then((response) => {
//       if (!response.ok) throw new Error("Network response error");
//       return response.text();
//     })
//     .then((data) => {
//       document.getElementById("navbar-placeholder").innerHTML = data;
//     })
//     .catch((error) => console.error("Error loading navbar:", error));
// }

function setupLogin() {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) {
    console.error("Login form not found");
    return;
  }
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(loginForm);
    fetch("http://localhost:8888/api/login.php", {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Save both username and userType in localStorage
          localStorage.setItem("username", data.user.username);
          localStorage.setItem("userType", data.user.userType);
          window.location.href = "dashboard.html";
        } else {
          alert("Login failed: " + data.message);
        }
      })
      .catch((error) => console.error("Error during login:", error));
  });
}
