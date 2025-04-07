document.addEventListener("DOMContentLoaded", function () {
  loadNavbar();
});

function loadNavbar() {
  fetch("navbar.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response error");
      }
      return response.text();
    })
    .then((data) => {
      document.getElementById("navbar-placeholder").innerHTML = data;
    })
    .catch((error) => console.error("Error loading navbar:", error));
}
