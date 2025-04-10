document.addEventListener("DOMContentLoaded", function () {
  loadNavbar();
  displayUsername();
  displayRSOAndEventActions();
  displayStudentAction();
  loadEvents();
  setupFilters();
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

function logoutUser() {
  localStorage.removeItem("username");
  localStorage.removeItem("userType");
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

function displayUsername() {
  const email = localStorage.getItem("email");
  if (email) {
    document.getElementById("welcome-message").textContent =
      "Welcome, " + localStorage.getItem("email");
  }
}

function displayRSOAndEventActions() {
  if (localStorage.getItem("userType") !== "admin") return;
  fetch("http://localhost:8888/api/getMyRSO.php", {
    method: "GET",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      const rsoActionDiv = document.getElementById("rsoAction");
      const eventActionDiv = document.getElementById("eventAction");
      if (data.success) {
        if (data.rso === null) {
          rsoActionDiv.innerHTML = `<button class="btn" onclick="window.location.href='createRSO.html'">Create RSO</button>`;
          eventActionDiv.innerHTML = "";
        } else {
          rsoActionDiv.innerHTML = `<button class="btn" onclick="window.location.href='rso-requests.html'">View Join Requests</button>`;
          eventActionDiv.innerHTML = `<button class="btn" onclick="window.location.href='create-event.html'">Create Event</button>`;
        }
      } else {
        rsoActionDiv.innerHTML = "";
        eventActionDiv.innerHTML = "";
      }
    })
    .catch((error) => console.error("Error getting admin RSO:", error));
}

function displayStudentAction() {
  if (localStorage.getItem("userType") === "student") {
    const studentActionDiv = document.getElementById("studentAction");
    studentActionDiv.innerHTML = `<button class="btn" onclick="window.location.href='view-rsos.html'">View RSOs</button>`;
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
  const currentUserID = localStorage.getItem("userID");
  const userType = localStorage.getItem("userType");
  events.forEach((event) => {
    let deleteButtonHTML = "";
    if (
      userType === "admin" &&
      currentUserID &&
      parseInt(currentUserID) === event.createdBy
    ) {
      deleteButtonHTML = `<button class="btn btn-danger" onclick="deleteEvent(${event.eventID})">Delete</button>`;
    }
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
        <button class="btn btn-secondary" onclick="viewEventDetails(${event.eventID})">View Details</button>
        ${deleteButtonHTML}
      </div>
    `;
    eventsList.appendChild(card);
  });
}

function deleteEvent(eventID) {
  if (
    !confirm(
      "Are you sure you want to delete this event? This action cannot be undone."
    )
  )
    return;
  const formData = new FormData();
  formData.append("eventID", eventID);
  fetch("http://localhost:8888/api/deleteEvent.php", {
    method: "POST",
    body: formData,
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Event deleted successfully.");
        loadEvents();
      } else {
        alert("Error deleting event: " + data.message);
      }
    })
    .catch((error) => console.error("Error during event deletion:", error));
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
  window.location.href = `http://localhost:8888/frontend/event-details.html?eventID=${eventID}`;
}
