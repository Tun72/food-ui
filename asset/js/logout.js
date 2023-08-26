const body = document.querySelector("body");

body.addEventListener("click", function (e) {
  if (e.target.classList.contains("logout")) {
    const token = localStorage.getItem("token") || null;

    if (token) {
      localStorage.removeItem("token");
      window.location.href = "index.html";
    }
  }
});
