document.addEventListener("DOMContentLoaded", function () {
  loadNavbar();

  // Get the eventID from the URL, e.g., ?eventID=123
  const urlParams = new URLSearchParams(window.location.search);
  const eventID = urlParams.get("eventID");
  if (!eventID) {
    alert("No event ID provided in URL.");
    return;
  }

  // Set the hidden rating input value to the current eventID
  document.getElementById("ratingEventID").value = eventID;

  // Fetch event details, comments, and average rating
  fetchEventDetails(eventID);

  // Setup the comment and rating form handlers
  setupCommentForm(eventID);
  setupRatingForm(eventID);
});

// ---------- Navbar Functions (Optional) ----------
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
  // Clear client-side session info from localStorage
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

// ---------- Event Details Functions ----------
function fetchEventDetails(eventID) {
  fetch(`http://localhost:8888/api/getEventDetails.php?eventID=${eventID}`, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        displayEventInfo(data.event, data.avgRating);
        displayComments(data.comments);
      } else {
        alert("Error retrieving event details: " + data.message);
      }
    })
    .catch((error) => console.error("Error fetching event details:", error));
}

function displayEventInfo(eventData, avgRating) {
  if (!eventData) return;

  // Capitalize first letter of eventCategory
  const category = eventData.eventCategory
    ? eventData.eventCategory.charAt(0).toUpperCase() +
      eventData.eventCategory.slice(1)
    : "";

  document.getElementById("eventTitle").textContent =
    eventData.eventName || "Untitled Event";
  document.getElementById("eventCategory").textContent = category;
  document.getElementById("eventDescription").textContent =
    eventData.description || "";

  document.getElementById("eventDate").textContent =
    "Date: " + (eventData.eventDate || "");
  document.getElementById("eventTime").textContent = `Time: ${
    eventData.startTime || ""
  } - ${eventData.endTime || ""}`;
  document.getElementById("eventLocation").textContent =
    "Location: " + (eventData.locationName || "");

  const ratingEl = document.getElementById("ratingDisplay");
  if (avgRating && avgRating > 0) {
    ratingEl.textContent = `Avg. Rating: ${avgRating}/5`;
  } else {
    ratingEl.textContent = "Avg. Rating: N/A";
  }
}

function displayComments(comments) {
  const commentsList = document.getElementById("commentsList");
  commentsList.innerHTML = ""; // Clear previous comments

  if (!comments || comments.length === 0) {
    commentsList.innerHTML = "<p>No comments yet.</p>";
    return;
  }

  comments.forEach((comment) => {
    const commentDiv = document.createElement("div");
    commentDiv.className = "comment-item";
    commentDiv.innerHTML = `
        <h4>${comment.username}</h4>
        <p>${comment.commentText}</p>
        <div class="comment-timestamp">${comment.commentTimestamp}</div>
      `;
    commentsList.appendChild(commentDiv);
  });
}

// ---------- Comment Form Handler ----------
function setupCommentForm(eventID) {
  const commentForm = document.getElementById("commentForm");
  if (!commentForm) return;

  commentForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const commentText = document.getElementById("commentText").value.trim();
    if (!commentText) {
      alert("Please enter a comment.");
      return;
    }
    const formData = new FormData();
    formData.append("eventID", eventID);
    formData.append("commentText", commentText);

    fetch("http://localhost:8888/api/comment.php", {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Re-fetch event details to update the comment list
          fetchEventDetails(eventID);
          commentForm.reset();
        } else {
          alert("Error posting comment: " + data.message);
        }
      })
      .catch((error) => console.error("Error posting comment:", error));
  });
}

// ---------- Rating Form Handler ----------
function setupRatingForm(eventID) {
  const ratingForm = document.getElementById("ratingForm");
  if (!ratingForm) return;

  ratingForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const ratingValue = document.getElementById("ratingInput").value;
    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      alert("Please enter a valid rating between 1 and 5.");
      return;
    }
    const formData = new FormData();
    formData.append("eventID", eventID);
    formData.append("rating", ratingValue);

    fetch("http://localhost:8888/api/rating.php", {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          fetchEventDetails(eventID);
        } else {
          alert("Error submitting rating: " + data.message);
        }
      })
      .catch((error) => console.error("Error submitting rating:", error));
  });
}
