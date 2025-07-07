document.addEventListener("DOMContentLoaded", function () {
  const toggleDarkMode = document.getElementById("dark-mode-toggle");
  const backToTopButton = document.getElementById("back-to-top");
  const searchBtn = document.getElementById("search-btn");
  const weatherOutput = document.getElementById("weather-output");

  // === Load Theme from Storage ===
  const mode = localStorage.getItem("darkMode");
  if (mode === "enabled") {
    applyDarkMode(true);
  }

  // === Dark Mode Toggle with Toast ===
  toggleDarkMode.addEventListener("click", function () {
    const isDark = document.body.classList.toggle("dark-mode");
    document.querySelectorAll("section, .container").forEach(el =>
      el.classList.toggle("dark-mode")
    );
    localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
    showToast(isDark ? "🌙 Dark Mode Enabled" : "☀️ Light Mode Enabled");
  });

  function applyDarkMode(enable) {
    document.body.classList.toggle("dark-mode", enable);
    document.querySelectorAll("section, .container").forEach(el =>
      el.classList.toggle("dark-mode", enable)
    );
  }

  function showToast(message) {
    const oldToast = document.querySelector(".vasiverse-toast");
    if (oldToast) oldToast.remove();

    const toast = document.createElement("div");
    toast.className = "vasiverse-toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    void toast.offsetWidth;
    toast.style.opacity = "1";

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.addEventListener("transitionend", () => toast.remove());
    }, 3000);
  }

  // === Smooth Scroll for Nav Links ===
  document.querySelectorAll("nav a[href^='#']").forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // === Back to Top Button ===
  backToTopButton.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  window.addEventListener("scroll", () => {
    backToTopButton.classList.toggle("visible", window.scrollY > 400);
  });

  // === Weather Search by City ===
  searchBtn.addEventListener("click", fetchWeather);

  async function fetchWeather() {
    const city = document.getElementById("city-input
