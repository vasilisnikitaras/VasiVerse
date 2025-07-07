document.addEventListener("DOMContentLoaded", function () {
  // === DOM Elements ===
  const backToTopButton = document.getElementById("back-to-top");
  const searchBtn = document.getElementById("search-btn");

  // === Dark Mode Toggle Buttons ===
  const darkButtons = document.querySelectorAll(".dark-mode-toggle");

  darkButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark-mode");

      document.querySelectorAll("section, .container").forEach(el =>
        el.classList.toggle("dark-mode")
      );

      localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
      showToast(isDark ? "🌙 Dark Mode Enabled" : "☀️ Light Mode Enabled");
    });
  });

  // === Load Theme from Storage ===
  const mode = localStorage.getItem("darkMode");
  if (mode === "enabled") {
    applyDarkMode(true);
  }

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
    const cityInput = document.getElementById("city-input");
    const weatherOutput = document.getElementById("weather-output");

    if (!cityInput || !weatherOutput) return;

    const city = cityInput.value.trim();
    if (!city) {
      weatherOutput.textContent = "Please enter a city name.";
      return;
    }

    // You can integrate with a real API here
    weatherOutput.textContent = `Fetching weather for "${city}"...`;
  }
});
