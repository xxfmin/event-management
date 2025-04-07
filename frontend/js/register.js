document.addEventListener("DOMContentLoaded", function () {
  loadNavbar();
  setupRegister();
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

function setupRegister() {
  const registerForm = document.getElementById("registerForm");
  if (!registerForm) {
    console.error("Register form not found");
    return;
  }
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    // Validate that password and confirm_password match
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById(
      "register-confirm-password"
    ).value;
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    const formData = new FormData(registerForm);
    fetch("../api/register.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Registration successful!");
          window.location.href = "login.html";
        } else {
          alert("Registration failed: " + data.message);
        }
      })
      .catch((error) => console.error("Error during registration:", error));
  });
}
