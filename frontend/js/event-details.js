document.addEventListener("DOMContentLoaded", function () {
  loadNavbar();
  const urlParams = new URLSearchParams(window.location.search);
  const eventID = urlParams.get("eventID");
  if (!eventID) {
    alert("No event ID provided in URL.");
    return;
  }
  document.getElementById("ratingEventID").value = eventID;
  fetchEventDetails(eventID);
  setupCommentForm(eventID);
  setupRatingForm(eventID);
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
  commentsList.innerHTML = "";
  if (!comments || comments.length === 0) {
    commentsList.innerHTML = "<p>No comments yet.</p>";
    return;
  }
  const currentUserID = localStorage.getItem("userID");
  comments.forEach((comment) => {
    console.log(
      "comment userID:",
      comment.userID,
      "currentUserID:",
      currentUserID
    );
    let actionButtons = "";
    if (parseInt(currentUserID) === parseInt(comment.userID)) {
      actionButtons = `
    <button class="btn btn-secondary"
            onclick="editComment(${comment.commentID}, '${encodeURIComponent(
        comment.commentText
      )}')">
      Edit
    </button>
    <button class="btn btn-danger"
            onclick="deleteComment(${comment.commentID})">
      Delete
    </button>
  `;
    }

    const commentDiv = document.createElement("div");
    commentDiv.className = "comment-item";
    commentDiv.innerHTML = `
      <h4>${comment.username}</h4>
      <p id="comment-text-${comment.commentID}">${comment.commentText}</p>
      <div class="comment-timestamp">${comment.commentTimestamp}</div>
      ${actionButtons}
    `;
    commentsList.appendChild(commentDiv);
  });
}

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
          fetchEventDetails(eventID);
          commentForm.reset();
        } else {
          alert("Error posting comment: " + data.message);
        }
      })
      .catch((error) => console.error("Error posting comment:", error));
  });
}

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
          alert("Rating submitted successfully.");
          fetchEventDetails(eventID);
        } else {
          alert("Error submitting rating: " + data.message);
        }
      })
      .catch((error) => console.error("Error submitting rating:", error));
  });
}

function editComment(commentID, encodedCommentText) {
  const originalText = decodeURIComponent(encodedCommentText);
  const newText = prompt("Edit your comment:", originalText);
  if (newText === null || newText.trim() === "" || newText === originalText)
    return;
  const formData = new FormData();
  formData.append("commentID", commentID);
  formData.append("commentText", newText.trim());
  fetch("http://localhost:8888/api/updateComment.php", {
    method: "POST",
    body: formData,
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Comment updated successfully.");
        fetchEventDetails(document.getElementById("ratingEventID").value);
      } else {
        alert("Error updating comment: " + data.message);
      }
    })
    .catch((error) => console.error("Error updating comment:", error));
}

function deleteComment(commentID) {
  if (!confirm("Are you sure you want to delete this comment?")) return;
  const formData = new FormData();
  formData.append("commentID", commentID);
  fetch("http://localhost:8888/api/deleteComment.php", {
    method: "POST",
    body: formData,
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Comment deleted successfully.");
        fetchEventDetails(document.getElementById("ratingEventID").value);
      } else {
        alert("Error deleting comment: " + data.message);
      }
    })
    .catch((error) => console.error("Error deleting comment:", error));
}
