document.addEventListener("DOMContentLoaded", function () {
  loadNavbar();
  loadRSOs();
});

function loadNavbar() {
  fetch("http://localhost:8888/frontend/navbar.html")
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

function loadRSOs() {
  fetch("http://localhost:8888/api/getRSOs.php", {
    method: "GET",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        displayRSOs(data.rsos);
      } else {
        alert("Error loading RSOs: " + data.message);
      }
    })
    .catch((error) => console.error("Error fetching RSOs:", error));
}

function displayRSOs(rsos) {
  const rsosList = document.getElementById("rsosList");
  rsosList.innerHTML = "";
  if (!rsos || rsos.length === 0) {
    rsosList.innerHTML = "<p>No RSOs available.</p>";
    return;
  }
  rsos.forEach((rso) => {
    const div = document.createElement("div");
    div.className = "rso-item";
    div.innerHTML = `
        <h2>${rso.name}</h2>
        <p>${rso.description}</p>
        <button onclick="joinRSO(${rso.rsoID})">Join RSO</button>
      `;
    rsosList.appendChild(div);
  });
}

function joinRSO(rsoID) {
  const formData = new FormData();
  formData.append("rsoID", rsoID);
  fetch("http://localhost:8888/api/joinRequest.php", {
    method: "POST",
    body: formData,
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
    })
    .catch((error) => console.error("Error sending join request:", error));
}
