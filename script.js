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
    const city = document.getElementById("city-input").value.trim();
    if (!city) {
      weatherOutput.innerHTML = "⚠️ Please enter a city name.";
      return;
    }

    try {
      const apiKey = "1f1742f46396f018ec07cab6f270841a";
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network error");
      const data = await response.json();

      const icon = getWeatherIcon(data.weather[0].main.toLowerCase());

      weatherOutput.innerHTML = `
        <h3>📍 ${data.name}, ${data.sys.country}</h3>
        <div class="weather-icon">${icon}</div>
        <p>🌡️ Temperature: ${data.main.temp}°C</p>
        <p>🌤️ Condition: ${data.weather[0].description}</p>
      `;
      weatherOutput.classList.add("show");
      fetchForecast(data.name);
    } catch (err) {
      console.error("Weather error:", err);
      weatherOutput.innerHTML = "⚠️ Failed to retrieve weather.";
    }
  }

  function getWeatherIcon(condition) {
    const icons = { clear: "☀️", cloud: "☁️", rain: "🌧️" };
    return icons[condition] || "🌍";
  }

  // === Auto Weather by Geolocation ===
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(async pos => {
      const { latitude: lat, longitude: lon } = pos.coords;
      try {
        const apiKey = "1f1742f46396f018ec07cab6f270841a";
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok || !data.name) throw new Error("Invalid location");

        const icon = getWeatherIcon(data.weather[0].main.toLowerCase());

        weatherOutput.innerHTML = `
          <h3>📍 ${data.name}, ${data.sys.country}</h3>
          <div class="weather-icon">${icon}</div>
          <p>🌡️ Temperature: ${data.main.temp}°C</p>
          <p>🌤️ Condition: ${data.weather[0].description}</p>
        `;
        weatherOutput.classList.add("show");

        fetchForecast(data.name);
      } catch (err) {
        console.warn("Geolocation failed:", err);
      }
    });
  }

  // === 3-Day Forecast ===
  async function fetchForecast(city) {
    const container = document.getElementById("forecast-container");
    if (!container) return;
    container.innerHTML = "⏳ Loading forecast...";

    try {
      const apiKey = "1f1742f46396f018ec07cab6f270841a";
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) throw new Error("Forecast fetch error");

      const days = {};
      data.list.forEach(item => {
        const date = item.dt_txt.split(" ")[0];
        if (!days[date]) days[date] = [];
        days[date].push(item);
      });

      const keys = Object.keys(days).slice(1, 4);
      let html = '<div class="forecast-grid">';
      keys.forEach(date => {
        const day = days[date][0];
        const icon = getWeatherIcon(day.weather[0].main.toLowerCase());
        html += `
          <div class="forecast-card">
            <h4>${new Date(date).toDateString()}</h4>
            <div class="forecast-icon">${icon}</div>
            <p>${day.main.temp.toFixed(1)}°C</p>
            <p style="font-size: 14px;">${day.weather[0].description}</p>
          </div>
        `;
      });
      html += "</div>";
      container.innerHTML = html;
    } catch (err) {
      console.error("Forecast error:", err);
      container.innerHTML = "⚠️ Unable to load forecast.";
    }
  }

  // === Close Modal on Escape ===
  window.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      const modal = document.getElementById("image-modal");
      if (modal?.style.display === "block") modal.style.display = "none";
    }
  });

  // === Load AdSense ===
  function loadAds() {
    const adContainer = document.getElementById("ad-container");
    if (adContainer) {
      adContainer.innerHTML = `
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        <ins class="adsbygoogle" style="display:block"
             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
             data-ad-slot="YYYYYYYYYY"
             data-ad-format="auto"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      `;
    }
  }

  loadAds();

  // === Register Service Worker ===
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
      .then(() => console.log("🛰️ VasiVerse SW Registered!"))
      .catch(err => console.error("Service Worker registration failed:", err));
  }
});
