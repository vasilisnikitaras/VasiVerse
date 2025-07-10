console.log("Script loaded. Ready to go!");

const apiKey = "bd1a2e25b5af86632c1c461148512426";

// === DARK MODE ON LOAD ===
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark-mode");
}

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("dark-mode-toggle");
  const backToTopButton = document.getElementById("back-to-top");
  const searchBtn = document.getElementById("search-btn");

  // 🌙 Toggle Dark Mode
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark-mode");
      localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
      showToast(isDark ? "🌙 Dark Mode Enabled" : "☀️ Light Mode Enabled");
    });
  }

  // 🔎 Search Weather by City
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
      output.textContent = `Fetching weather for "${city}"...`;
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

  // 🧭 Smooth Scroll
 // document.querySelectorAll("nav a[href^='#']").forEach(link => {
//    link.addEventListener("click", e => {
 //     e.preventDefault();
 //     const target = document.querySelector(link.getAttribute("href"));
 //     if (target) target.scrollIntoView({ behavior: "smooth" });
 //   });
//  }

document.querySelectorAll("nav a[href^='#']").forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) target.scrollIntoView({ behavior: "smooth" });
    });
}); // ← THIS LINE closes forEach properly





  

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

// 🌇 Weather by City Name
function fetchWeatherByCity(city) {
  console.log("Fetching weather for city:", city);
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => {
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return res.json();
    })
    .then(data => {
      renderWeather(data);
    })
    .catch(err => {
      console.error("City weather error:", err.message);
      const output = document.getElementById("weather-output");
      if (output) {
        output.textContent = `❌ Could not fetch weather for "${city}".`;
      }
    });
}

// 🗺 Weather by Coordinates
function fetchWeatherByCoords(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => renderWeather(data))
    .catch(err => console.error("Coords weather error:", err.message));
}

// 🗓 5-Day Forecast
function fetchForecast(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("forecast");
      if (!container) return;
      const daily = data.list.filter((_, i) => i % 8 === 0).slice(1, 6);
      const forecastTitle = `<h3 id="forecast-title">📅 ${daily.length}-Day Forecast</h3>`;
      container.innerHTML = forecastTitle;
      setTimeout(() => {
        const titleEl = document.getElementById("forecast-title");
        if (titleEl) titleEl.classList.add("visible");
      }, 50);
      daily.forEach(day => {
        const date = new Date(day.dt_txt).toLocaleDateString("el-GR", {
          weekday: "long",
          day: "numeric",
          month: "short"
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
    .catch(err => console.error("Forecast error:", err.message));
}

// 🖼 Display Weather
function renderWeather(data) {
  const output = document.getElementById("weather-output");
  if (!output) return;
  output.innerHTML = `
    <p><strong>${data.name}</strong></p>
    <p>${getWeatherEmoji(data.weather[0].main)} ${data.weather[0].description}</p>
    <p>🌡️ ${data.main.temp}°C</p>
  `;
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

// 📍 Auto Load Weather by Geolocation
window.onload = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        fetchWeatherByCoords(latitude, longitude);
        fetchForecast(latitude, longitude);
      },
      err => {
        console.warn("Geolocation failed:", err.message);
        fetchWeatherByCity("Montreal");
      }
    );
  } else {
    fetchWeatherByCity("Montreal");
  }
};




// === Auto-Location Weather Forecast ===
window.onload = function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherByCoords(lat, lon);
      },
      error => {
        console.warn("Geolocation error:", error.message);
        fetchWeatherByCity("Montreal"); // fallback
      }
    );
  } else {
    console.log("Geolocation not supported.");
    fetchWeatherByCity("Montreal"); // fallback
  }
};

function fetchWeatherByCoords(lat, lon) {
  const apiKey = "bd1a2e25b5af86632c1c461148512426"; // <-- Replace with your actual OpenWeather API key
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
    .then(res => res.json())
    .then(data => displayForecast(data))
    .catch(err => console.error("Weather API error:", err));
}

function fetchWeatherByCity(city) {

 // const apiKey = "bd1a2e25b5af86632c1c461148512426"; // ✔️ Quotes needed

  const apiKey = "bd1a2e25b5af86632c1c461148512426"; // <-- Replace with your actual key
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
    .then(res => res.json())
    .then(data => displayForecast(data))
    .catch(err => console.error("City Weather error:", err));
}

function displayForecast(data) {
  const container = document.getElementById('forecast-container');
  if (!container) return console.warn("Missing container: #forecast-container");

  container.innerHTML = '';
  // Show 5 days only, spaced 1 per day (~8 data points per day)
  for (let i = 0; i < data.list.length; i += 8) {
    const item = data.list[i];
    const date = new Date(item.dt_txt);
    const temp = Math.round(item.main.temp);
    const icon = item.weather[0].icon;

    container.innerHTML += `
      <div class="forecast-card">
        <p>${date.toDateString()}</p>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon">
        <p>${temp}°C</p>
      </div>
    `;
  }
}


