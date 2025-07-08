// Restore dark mode class immediately if saved
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark-mode");
}

document.addEventListener("DOMContentLoaded", function () {
  // === DOM Elements ===
  const toggleBtn = document.querySelector(".dark-mode-toggle");
  const backToTopButton = document.getElementById("back-to-top");
  const searchBtn = document.getElementById("search-btn");

  // === Load Dark Mode from localStorage ===
  // if (localStorage.getItem("darkMode") === "enabled") {
  //  document.body.classList.add("dark-mode");
 // }

  // === Dark Mode Toggle ===
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark-mode");
      localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
      showToast(isDark ? "🌙 Dark Mode Enabled" : "☀️ Light Mode Enabled");
    });
  }

  // === Toast Notification ===
  function showToast(message) {
    const oldToast = document.querySelector(".vasiverse-toast");
    if (oldToast) oldToast.remove();

    const toast = document.createElement("div");
    toast.className = "vasiverse-toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    void toast.offsetWidth; // Force reflow
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
  if (backToTopButton) {
    backToTopButton.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );

    window.addEventListener("scroll", () => {
      backToTopButton.classList.toggle("visible", window.scrollY > 400);
    });
  }

  // === Weather Search (Placeholder) ===
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const cityInput = document.getElementById("city-input");
      const weatherOutput = document.getElementById("weather-output");

      if (!cityInput || !weatherOutput) return;

      const city = cityInput.value.trim();
      if (!city) {
        weatherOutput.textContent = "Please enter a city name.";
        return;
      }

      // Placeholder logic — replace with real API later
      weatherOutput.textContent = `Fetching weather for "${city}"...`;
    });
  }
});
