console.log("✅ VasiVerse Weather Script Loaded");

const apiKey = "bd1a2e25b5af86632c1c461148512426";

// === DARK MODE ON LOAD ===
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark-mode");
}

// === DOM READY ===
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

// 🔍 City Search
//  if (searchBtn) {
//  searchBtn.addEventListener("click", () => {
//   const cityInput = document.getElementById("city-input");
//     const output = document.getElementById("weather-output");
//     if (!cityInput || !output) return;
//      const city = cityInput.value.trim();
//     if (!city) {
//       output.textContent = "Please enter a city name.";
//    return;
//   }
//   output.textContent = `Fetching weather for "${city}"...`;
//     fetchWeatherByCity(city);
//    });
//  }

if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    const cityInput = document.getElementById("city-input");
    const output = document.getElementById("weather-output");
    if (!cityInput || !output) return;

    const city = cityInput.value.trim();
    if (!city) {
      output.textContent = "Please enter a city name.";
      return;
    }

    // 🌩️ Show loading message before fetching
    output.innerHTML = "🌩️ Fetching forecast for <strong>" + city + "</strong>...";

    fetchWeatherByCity(city);
  });
}







  

  // ⬆️ Back to Top Button
  if (backToTopButton) {
    backToTopButton.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
    window.addEventListener("scroll", () => {
      backToTopButton.classList.toggle("visible", window.scrollY > 400);
    });
  }

  // 🧭 Smooth Scroll Links
  document.querySelectorAll("nav a[href^='#']").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // 🔔 Toast Function
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
      background: "rgba(0, 0, 0, 0.8)",
      color: "#fff",
      padding: "8px 14px",
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
});

// 🌇 Load Weather Automatically
window.onload = () => {
  const container = document.getElementById("forecast-container");
  if (!container) return console.warn("Missing #forecast-container");

  console.log("📍 Detecting location...");
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        console.log("🔍 Location:", latitude, longitude);
        fetchWeatherByCoords(latitude, longitude);
      },
      err => {
        console.warn("Geolocation error:", err.message);
        fetchWeatherByCity("Montreal"); // fallback
      }
    );
  } else {
    console.log("Geolocation not supported.");
    fetchWeatherByCity("Montreal");
  }
};

// 📡 Fetch by Coordinates
function fetchWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  console.log("📡 Fetching:", url);
  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => displayForecast(data))
    .catch(err => {
      console.error("❌ Weather API error:", err.message);
      const container = document.getElementById("forecast-container");
      if (container) container.textContent = "☁️ Forecast unavailable.";
    });
}

// 🏙️ Fetch by City Name
function fetchWeatherByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
  console.log("🏙️ Fetching:", url);
  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => displayForecast(data))
    .catch(err => {
      console.error("❌ City Weather error:", err.message);
      const container = document.getElementById("forecast-container");
      if (container) container.textContent = `⚠️ Could not load forecast for "${city}".`;
    });
}

// 🖼️ Display Forecast
function displayForecast(data) {
  const container = document.getElementById("forecast-container");
  if (!container) return console.warn("Missing container: #forecast-container");

  container.innerHTML = '';
  const daily = data.list.filter((_, i) => i % 8 === 0).slice(0, 5);

  daily.forEach(item => {
    const date = new Date(item.dt_txt);
    const temp = Math.round(item.main.temp);
    const icon = item.weather[0].icon;
    const condition = item.weather[0].description;

    container.innerHTML += `
      <div class="forecast-card">
        <p><strong>${date.toDateString()}</strong></p>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${condition}">
        <p>${getWeatherEmoji(item.weather[0].main)} ${condition}</p>
        <p>🌡️ ${temp}°C</p>
      </div>
    `;
  });
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
  if (c.includes("fog") || c.includes("mist")) return "🌫️";
  return "🌡️";
}
