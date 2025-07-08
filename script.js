// === DARK MODE ON LOAD ===
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark-mode");
}

document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.querySelector(".dark-mode-toggle");
  const backToTopButton = document.getElementById("back-to-top");
  const searchBtn = document.getElementById("search-btn");

  // 🌙 Dark Mode Toggle
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark-mode");
      localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
      showToast(isDark ? "🌙 Dark Mode Enabled" : "☀️ Light Mode Enabled");
    });
  }

  // 🔔 Toast Notification
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

  // 🧭 Smooth Scroll
  document.querySelectorAll("nav a[href^='#']").forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // ⬆️ Back to Top
  if (backToTopButton) {
    backToTopButton.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
    window.addEventListener("scroll", () => {
      backToTopButton.classList.toggle("visible", window.scrollY > 400);
    });
  }

  // 🔎 Search Weather by City
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
      weatherOutput.textContent = `Fetching weather for "${city}"...`;
      fetchWeatherByCity(city);
    });
  }
});

// 🌍 === AUTO GEOLOCATION WEATHER ===
window.onload = function () {
  console.log("🟢 window.onload triggered");
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        console.log("📍 Location:", lat, lon);
        fetchWeatherByCoords(lat, lon);
        fetchForecast(lat, lon);
      },
      (err) => {
        console.warn("⚠️ Geolocation failed:", err.message);
        fetchWeatherByCity("New York");
      }
    );
  } else {
    console.warn("⚠️ Geolocation not available.");
    fetchWeatherByCity("New York");
  }
};

// 🔐 API Key (One global)
const apiKey = "bd1a2e25b5af86632c1c461148512426";

// 🌡️ Current Weather by Coords
function fetchWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const output = document.getElementById("weather-output");
      if (output) {
        output.innerHTML = `
          <p><strong>${data.name}</strong></p>
          <p>${getWeatherEmoji(data.weather[0].main)} ${data.weather[0].description}</p>
          <p>🌡️ ${data.main.temp}°C</p>
        `;
      }
    })
    .catch(err => console.error("Weather fetch error:", err.message));
}

// 🌆 Current Weather by City
function fetchWeatherByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const output = document.getElementById("weather-output");
      if (output) {
        output.innerHTML = `
          <p><strong>${data.name}</strong></p>
          <p>${getWeatherEmoji(data.weather[0].main)} ${data.weather[0].description}</p>
          <p>🌡️ ${data.main.temp}°C</p>
        `;
      }
    })
    .catch(err => console.error("City weather fetch error:", err.message));
}

// 📅 Forecast Function
function fetchForecast(lat, lon) {
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${apiKey}`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("forecast");
      if (!container) return;
      container.innerHTML = "<h3>Πρόγνωση 5 Ημερών</h3>";
      const days = data.daily.slice(1, 6);
      days.forEach(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString("el-GR", {
          weekday: "long", day: "numeric", month: "short"
        });
        container.innerHTML += `
          <div class="forecast-day">
            <p><strong>${date}</strong></p>
            <p>${getWeatherEmoji(day.weather[0].main)} ${day.weather[0].description}</p>
            <p>🌡️ ${day.temp.day}°C</p>
          </div>
        `;
      });
    })
    .catch(err => console.error("Forecast fetch error:", err.message));
}

// 🌈 Emoji Helper
function getWeatherEmoji(condition) {
  const c = condition.toLowerCase();
  if (c.includes("clear")) return "☀️";
  if (c.includes("cloud")) return "☁️";
  if (c.includes("rain")) return "🌧️";
  if (c.includes("snow")) return "❄️";
  if (c.includes("thunder")) return "⛈️";
  if (c.includes("drizzle")) return "🌦️";
  if (c.includes("mist") || c.includes("fog")) return "🌫️";
  return "🌡️";
}
