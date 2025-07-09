// === Persisted Dark Mode on Page Load ===
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark-mode");
}

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("dark-mode-toggle");
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
    const old = document.querySelector(".vasiverse-toast");
    if (old) old.remove();
    const toast = document.createElement("div");
    toast.className = "vasiverse-toast";
    toast.textContent = message;
    Object.assign(toast.style, {
      position: "fixed",
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(0,0,0,0.85)",
      color: "#fff",
      padding: "8px 14px",
      borderRadius: "6px",
      fontSize: "14px",
      opacity: "0",
      transition: "opacity 0.3s ease",
      zIndex: "9999"
    });
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.style.opacity = "1");
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.addEventListener("transitionend", () => toast.remove());
    }, 3000);
  }

  // 🧭 Smooth Scroll
  document.querySelectorAll("nav a[href^='#']").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // ⬆️ Back to Top Button
  if (backToTopButton) {
    backToTopButton.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
    window.addEventListener("scroll", () => {
      backToTopButton.classList.toggle("visible", window.scrollY > 400);
    });
  }

  // 🔍 Search Weather by City
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

// 🌎 Geolocation Weather on Load
window.onload = function () {
  console.log("🟢 window.onload triggered");
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        console.log("📍 Location:", lat, lon);
        fetchWeatherByCoords(lat, lon);
        fetchForecast(lat, lon);
      },
      (err) => {
        console.warn("⚠️ Geolocation failed:", err.message);
        fetchWeatherByCity("Montreal");
      }
    );
  } else {
    console.warn("⚠️ Geolocation not supported.");
    fetchWeatherByCity("Montreal");
  }
};

// 🔐 OpenWeather API Key
const apiKey = "bd1a2e25b5af86632c1c461148512426";

// 🌤 Weather by Coordinates
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

// 🏙 Weather by City Name
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

// 📅 5-Day Forecast
function fetchForecast(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("forecast");
      if (!container) return;
      container.innerHTML = "<h3 id='forecast-title'>5-Day Forecast</h3>";
      const daily = data.list.filter((_, i) => i % 8 === 0).slice(1, 6);
      daily.forEach(day => {
        const date = new Date(day.dt_txt).toLocaleDateString("el-GR", {
          weekday: "long", day: "numeric", month: "short"
        });
        container.innerHTML += `
          <div class="forecast-day">
            <p><strong>${date}</strong></p>
            <p>${getWeatherEmoji(day.weather[0].main)} ${day.weather[0].description}</p>
            <p>🌡️ ${Math.round(day.main.temp)}°C</p>
          </div>
        `;
      });
    })
    .catch(err => console.error("Forecast fetch error:", err.message));
}

// 🌈 Weather Condition → Emoji
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
