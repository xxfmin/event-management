document.addEventListener("DOMContentLoaded", function () {
  loadNavbar();
  displayUsername();
  showAdminActions();
  loadEvents();
  setupFilters();
});

// ----- Navbar and Logout Functions -----

function loadNavbar() {
  fetch("http://localhost:8888/frontend/navbar.html")
    .then((response) => {
      if (!response.ok) throw new Error("Network response error");
      return response.text();
    })
    .then((html) => {
      document.getElementById("navbar-placeholder").innerHTML = html;
      adjustNavbar(); // Once the navbar is loaded, adjust it based on login status
    })
    .catch((error) => console.error("Error loading navbar:", error));
}

function adjustNavbar() {
  // Read the userType from localStorage to decide which buttons to show
  const userType = localStorage.getItem("userType");
  const homeBtn = document.getElementById("homeBtn");
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (userType) {
    // If logged in, hide Home, Log In, and Register; show Log Out
    if (homeBtn) homeBtn.style.display = "none";
    if (loginBtn) loginBtn.style.display = "none";
    if (registerBtn) registerBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
  } else {
    // Otherwise, show non-authenticated buttons; hide logout
    if (homeBtn) homeBtn.style.display = "inline-block";
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (registerBtn) registerBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
  }
}

function logoutUser() {
  // Clear client-side session info from localStorage
  localStorage.removeItem("username");
  localStorage.removeItem("userType");

  // Fetch the logout API endpoint (from dashboard.html, "../api/logout.php" should be correct)
  fetch("http://localhost:8888/api/logout.php", {
    method: "GET",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      window.location.href = "http://localhost:8888/frontend/index.html";
    })
    .catch((error) => {
      console.error("Error during logout:", error);
      window.location.href = "http://localhost:8888/frontend/index.html";
    });
}

// ----- Dashboard-specific Functions -----

function displayUsername() {
  const username = localStorage.getItem("username");
  if (username) {
    // Assuming dashboard.html contains an element with id "welcome-message"
    document.getElementById("welcome-message").textContent =
      "Welcome, " + username;
  }
}

function showAdminActions() {
  const userType = localStorage.getItem("userType");
  const adminActions = document.querySelector(".admin-actions");
  if (adminActions) {
    // Show "Create Event" only if userType is "admin"
    adminActions.style.display = userType === "admin" ? "block" : "none";
  }
}

function loadEvents() {
  fetch("http://localhost:8888/api/getEvents.php", {
    method: "GET",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        displayEvents(data.events);
      } else {
        console.error("Error loading events: " + data.message);
      }
    })
    .catch((error) => console.error("Error fetching events:", error));
}

function displayEvents(events) {
  const eventsList = document.querySelector(".events-list");
  if (!eventsList) return;
  eventsList.innerHTML = "";
  events.forEach((event) => {
    const card = document.createElement("div");
    card.className = "event-card";
    card.setAttribute("data-type", event.eventType);
    card.innerHTML = `
      <h2 class="event-title">${event.eventName}</h2>
      <p class="event-description">${event.description}</p>
      <div class="event-meta">
        <span class="event-date">Date: ${event.eventDate}</span>
        <span class="event-time">Time: ${event.startTime}</span>
      </div>
      <div class="event-actions">
        <button class="btn btn-secondary" onclick="viewEventDetails(${event.eventID})">
          View Details
        </button>
      </div>
    `;
    eventsList.appendChild(card);
  });
}

function setupFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");
      filterEvents(filter);
    });
  });
}

function filterEvents(filter) {
  const eventCards = document.querySelectorAll(".event-card");
  eventCards.forEach((card) => {
    if (filter === "all" || card.getAttribute("data-type") === filter) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

function viewEventDetails(eventID) {
  // Redirect to the event details page with the event ID as a query parameter.
  window.location.href = `http://localhost:8888/frontend/event-details.html?eventID=${eventID}`;
}