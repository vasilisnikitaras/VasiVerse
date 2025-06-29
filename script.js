document.addEventListener("DOMContentLoaded", function () {
  const toggleDarkMode = document.getElementById("dark-mode-toggle");
  const backToTopButton = document.getElementById("back-to-top");
  const searchBtn = document.getElementById("search-btn");
  const weatherOutput = document.getElementById("weather-output");

  // === Restore Dark Mode from LocalStorage ===
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    document.querySelectorAll("section, .container").forEach(el =>
      el.classList.add("dark-mode")
    );
  }

  // === Dark Mode Toggle ===
  toggleDarkMode.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    document.querySelectorAll("section, .container").forEach(el =>
      el.classList.toggle("dark-mode")
    );
    const mode = document.body.classList.contains("dark-mode") ? "enabled" : "disabled";
    localStorage.setItem("darkMode", mode);
  });
  

  // === Smooth Scroll for Nav Links ===
//  document.querySelectorAll("nav a").forEach(link => {
 //   link.addEventListener("click", function (e) {
  //    e.preventDefault();
 //     const target = document.querySelector(this.getAttribute("href"));
 //     if (target) {
 //       target.scrollIntoView({ behavior: "smooth" });
 //     }
 //   });
//  }); 

document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
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

  // === Weather Fetch by City Name ===
  async function fetchWeather() {
    const city = document.getElementById("city-input").value.trim();
    if (!city) {
      weatherOutput.innerHTML = "⚠️ Please enter a city name.";
      return;
    }

    try {
      const apiKey = "1f1742f46396f018ec07cab6f270841a";
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric`;

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
      weatherOutput.classList.add("show");

      fetchForecast(data.name); // NEW: fetch 3-day forecast
    } catch (error) {
      console.error("Weather Fetch Error:", error);
      weatherOutput.innerHTML = "⚠️ Failed to retrieve weather data.";
    }
  }

  searchBtn.addEventListener("click", fetchWeather);

  // === Auto-Fetch Weather by Geolocation ===
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      async position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const apiKey = "1f1742f46396f018ec07cab6f270841a";
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
          const response = await fetch(url);
          if (!response.ok) throw new Error("Weather fetch failed");

          const data = await response.json();
          if (data.cod === "404" || data.cod === "400") {
            weatherOutput.innerHTML = "⚠️ City not found. Please check the spelling.";
            return;
          }

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
          weatherOutput.classList.add("show");

          fetchForecast(data.name); // NEW: show forecast on auto-load too
        } catch (err) {
          console.warn("🌐 Auto-location failed:", err);
        }
      },
      error => {
        console.log("📍 User denied location access.");
      }
    );
  }

  // === 3-Day Forecast Function ===
  async function fetchForecast(city) {
    const forecastContainer = document.getElementById("forecast-container");
    if (!forecastContainer) return;
    forecastContainer.innerHTML = "⏳ Loading forecast...";

    try {
      const apiKey = "1f1742f46396f018ec07cab6f270841a";
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Forecast fetch failed");
      const data = await response.json();

      const days = {};
      data.list.forEach(item => {
        const date = item.dt_txt.split(" ")[0];
        if (!days[date]) days[date] = [];
        days[date].push(item);
      });

      const dayKeys = Object.keys(days).slice(1, 4);
      let html = '<div class="forecast-grid">';
      dayKeys.forEach(date => {
        const day = days[date][0];
        const condition = day.weather[0].main.toLowerCase();
        let icon = "🌍";
        if (condition.includes("clear")) icon = "☀️";
        else if (condition.includes("cloud")) icon = "☁️";
        else if (condition.includes("rain")) icon = "🌧️";

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
      forecastContainer.innerHTML = html;
    } catch (err) {
      console.error("Forecast error:", err);
      forecastContainer.innerHTML = "⚠️ Unable to load forecast.";
    }
  }

  // === Escape Key Closes Modal ===
  window.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      const modal = document.getElementById("image-modal");
      if (modal && modal.style.display === "block") {
        modal.style.display = "none";
      }
    }
  });

  // === Load AdSense (Optional – Customize IDs) ===
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
