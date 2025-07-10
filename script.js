console.log("✅ VasiVerse Weather Script Loaded");

const apiKey = "bd1a2e25b5af86632c1c461148512426";
let debugMode = false; // 🐛 Press "D" to toggle debug mode

// 🐛 Global debug key listener
window.addEventListener("keydown", e => {
  if (e.key.toLowerCase() === "d") {
    debugMode = !debugMode;
    showToast(debugMode ? "🐛 Debug Mode: ON" : "🧼 Debug Mode: OFF");
    if (debugMode) console.clear();
  }
});

// 🌙 Dark Mode on load
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark-mode");
}

// === DOM READY ===
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("dark-mode-toggle");
  const searchBtn = document.getElementById("search-btn");
  const backToTopBtn = document.getElementById("back-to-top");

  // 🌙 Dark Mode toggle
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark-mode");
      localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
      showToast(isDark ? "🌙 Dark Mode Enabled" : "☀️ Light Mode Enabled");
    });
  }

  // 🔍 City forecast search
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const cityInput = document.getElementById("city-input");
      const output = document.getElementById("weather-output");
      const container = document.getElementById("forecast-container");

      if (!cityInput || !output || !container) return;

      const city = cityInput.value.trim();
      if (!city) {
        output.textContent = "Please enter a city name.";
        return;
      }

      output.innerHTML = `🌩️ Loading forecast for <strong>${city}</strong>...`;
      container.innerHTML = "";
      fetchWeatherByCity(city);
    });
  }

  // ⬆️ Back to top scroll
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    window.addEventListener("scroll", () => {
      backToTopBtn.classList.toggle("visible", window.scrollY > 400);
    });
  }

  // 🧭 Smooth navigation
  document.querySelectorAll("nav a[href^='#']").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });
});

// 🔔 Toast helper
function showToast(message) {
  const oldToast = document.querySelector(".vasiverse-toast");
  if (oldToast) oldToast.remove();

  const toast = document.createElement("div");
  toast.className = "vasiverse-toast";
  toast.textContent = message;
  Object.assign(toast.style, {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#333",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "6px",
    fontSize: "14px",
    zIndex: "9999",
    opacity: "0",
    transition: "opacity 0.3s ease"
  });

  document.body.appendChild(toast);
  requestAnimationFrame(() => (toast.style.opacity = "1"));
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.addEventListener("transitionend", () => toast.remove());
  }, 3000);
}

// 🌇 Fetch weather on page load
window.onload = () => {
  const container = document.getElementById("forecast-container");
  if (!container) return console.warn("Missing #forecast-container");

  container.innerHTML = "🌩️ Loading local forecast...";
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        if (debugMode) console.log("🔍 Location:", latitude, longitude);
        fetchWeatherByCoords(latitude, longitude);
      },
      err => {
        console.warn("Geolocation error:", err.message);
        fetchWeatherByCity("Montreal");
      }
    );
  } else {
    fetchWeatherByCity("Montreal");
  }
};

// 📡 Fetch by coordinates
function fetchWeatherByCoords(lat, lon) {
  const container = document.getElementById("forecast-container");
  container.innerHTML = "🌩️ Loading forecast...";

  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  if (debugMode) console.log("📡 Fetching:", url);

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => displayForecast(data))
    .catch(err => {
      console.error("❌ Weather API error:", err.message);
      container.textContent = "☁️ Forecast unavailable.";
    });
}

// 🏙️ Fetch by city name
function fetchWeatherByCity(city) {
  const container = document.getElementById("forecast-container");
  container.innerHTML = `🌩️ Loading forecast for "${city}"...`;

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
  if (debugMode) console.log("🏙️ Fetching:", url);

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => displayForecast(data))
    .catch(err => {
      console.error("❌ City Weather error:", err.message);
      container.textContent = `⚠️ Could not load forecast for "${city}".`;
    });
}

// 🖼️ Render forecast cards
function displayForecast(data) {
  const container = document.getElementById("forecast-container");
  if (!container) return;

  if (debugMode) {
    console.log("🧪 Forecast entries:", data.list?.length);
    console.log("💾 Raw forecast data:", data);
  }

  container.innerHTML = "";
  const daily = data.list.filter((_, i) => i % 8 === 0).slice(0, 5);

  if (daily.length === 0) {
    container.innerHTML = "⚠️ No forecast data available.";
    return;
  }

  daily.forEach(item => {
    const date = new Date(item.dt_txt);
    const temp = Math.round(item.main.temp);
    const icon = item.weather[0].icon;
    const condition = item.weather[0].description;
    const emoji = getWeatherEmoji(item.weather[0].main);

    container.innerHTML += `
      <div class="forecast-card">
        <p><strong>${date.toDateString()}</strong></p>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${condition}">
        <p>${emoji} ${condition}</p>
        <p>🌡️ ${temp}°C</p>
      </div>
    `;
  });

  if (debugMode) console.log("✅ Forecast rendered successfully");
}

// 🌈 Emoji selector
function getWeatherEmoji(condition) {
  const c = condition.toLowerCase();
  if (c.includes("clear")) return "☀️";
  if (c.includes("cloud")) return "☁️";
  if (c.includes("rain")) return "🌧️";
  if (c.includes("snow")) return "❄️";
  if (c.includes("thunder")) return "⛈️";
  if (c.includes("drizzle")) return "🌦️";
  if (c.includes("fog") || c.includes("mist")) return "🌫️";
  return "🌡️";
}
