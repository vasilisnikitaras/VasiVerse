document.addEventListener("DOMContentLoaded", function () {
  const toggleDarkMode = document.getElementById("dark-mode-toggle");
  const backToTopButton = document.getElementById("back-to-top");
  const searchBtn = document.getElementById("search-btn");
  const weatherOutput = document.getElementById("weather-output");

  // === Restore Dark Mode from LocalStorage ===
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    document.querySelectorAll("section, .container").forEach(el => el.classList.add("dark-mode"));
  }

  // === Dark Mode Toggle ===
  toggleDarkMode.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    document.querySelectorAll("section, .container").forEach(el => el.classList.toggle("dark-mode"));
    const mode = document.body.classList.contains("dark-mode") ? "enabled" : "disabled";
    localStorage.setItem("darkMode", mode);
  });

  // === Smooth Scroll for Nav Links ===
  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // === Back to Top Scroll
  backToTopButton.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    backToTopButton.classList.toggle("visible", scrollY > 400);
  });

  // === Weather Fetch Function
  async function fetchWeather() {
    const city = document.getElementById("city-input").value.trim();
    if (!city) {
      weatherOutput.innerHTML = "⚠️ Please enter a city name.";
      return;
    }

    try {
      const apiKey = "1f1742f46396f018ec07cab6f270841a";
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response error");
      const data = await response.json();

      const condition = data.weather[0].main.toLowerCase();
      let icon = "🌍";
      if (condition.includes("clear")) icon = `<div class="weather-icon sunny">☀️</div>`;
      else if (condition.includes("cloud")) icon = `<div class="weather-icon cloudy">☁️</div>`;
      else if (condition.includes("rain")) icon = `<div class="weather-icon rainy">🌧️</div>`;

      weatherOutput.innerHTML = `
        <h3>📍 ${data.name}, ${data.sys.country}</h3>
        ${icon}
        <p>🌡️ Temperature: ${data.main.temp}°C</p>
        <p>🌤️ Condition: ${data.weather[0].description}</p>
      `;
    } catch (error) {
      console.error("Weather Fetch Error:", error);
      weatherOutput.innerHTML = "⚠️ Failed to retrieve weather data.";
    }
  }

  // === Trigger Button for Weather
  searchBtn.addEventListener("click", fetchWeather);

  // === Escape Key Closes Modal
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const modal = document.getElementById("image-modal");
      if (modal && modal.style.display === "block") {
        modal.style.display = "none";
      }
    }
  });

  // === Load AdSense (Optional – Customize IDs)
  function loadAds() {
    const adContainer = document.getElementById("ad-container");
    if (adContainer) {
      adContainer.innerHTML = `
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
             data-ad-slot="YYYYYYYYYY"
             data-ad-format="auto"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      `;
    }
  }

  loadAds();
});
