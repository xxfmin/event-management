document.addEventListener("DOMContentLoaded", function () {
  loadNavbar();
  loadRSORequests();
});

function loadNavbar() {
  fetch("http://localhost:8888/navbar.html")
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

function loadRSORequests() {
  fetch("http://localhost:8888/api/viewRSORequests.php", {
    method: "GET",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        displayRequests(data.requests);
      } else {
        alert("Error loading requests: " + data.message);
      }
    })
    .catch((error) => console.error("Error fetching requests:", error));
}

function displayRequests(requests) {
  const requestsList = document.getElementById("requestsList");
  requestsList.innerHTML = "";
  if (!requests || requests.length === 0) {
    requestsList.innerHTML = "<p>No join requests at this time.</p>";
    return;
  }
  requests.forEach((req) => {
    const div = document.createElement("div");
    div.className = "request-item";
    div.innerHTML = `
        <h2>${req.username} requests to join RSO ID ${req.rsoID}</h2>
        <p>Requested on: ${req.requestDate}</p>
        <button onclick="updateRequest(${req.requestID}, 'accepted')">Accept</button>
        <button onclick="updateRequest(${req.requestID}, 'rejected')">Reject</button>
      `;
    requestsList.appendChild(div);
  });
}

function updateRequest(requestID, action) {
  const formData = new FormData();
  formData.append("requestID", requestID);
  formData.append("action", action);
  fetch("http://localhost:8888/api/updateRSORequest.php", {
    method: "POST",
    body: formData,
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      loadRSORequests();
    })
    .catch((error) => console.error("Error updating request:", error));
}
