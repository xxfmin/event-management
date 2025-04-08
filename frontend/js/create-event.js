document.addEventListener("DOMContentLoaded", function () {
  loadNavbar();
  setupCreateEvent();
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

function setupCreateEvent() {
  const createEventForm = document.getElementById("createEventForm");
  if (!createEventForm) {
    console.error("Create Event form not found");
    return;
  }
  createEventForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(createEventForm);
    fetch("http://localhost:8888/api/getEvents.php", {
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
