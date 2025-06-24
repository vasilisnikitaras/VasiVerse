document.addEventListener("DOMContentLoaded", function () {
    const toggleDarkMode = document.getElementById("dark-mode-toggle");
    const backToTopButton = document.getElementById("back-to-top");

    // === Restore Dark Mode from LocalStorage ===
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        document.querySelectorAll('section, .container').forEach(el => el.classList.add('dark-mode'));
    }

    // === Dark Mode Toggle ===
    toggleDarkMode.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
        document.querySelectorAll('section, .container').forEach(el => el.classList.toggle('dark-mode'));

        const mode = document.body.classList.contains("dark-mode") ? "enabled" : "disabled";
        localStorage.setItem("darkMode", mode);
    });

    // === Back to Top Smooth Scroll ===
    backToTopButton.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // === Weather Fetching with Emoji Animation ===
    async function fetchWeather() {
        const city = document.getElementById("city-input").value.trim();
        const output = document.getElementById("weather-output");

        if (!city) {
            output.innerHTML = "⚠️ Please enter a city name.";
            return;
        }

        try {
            const apiKey = "1f1742f46396f018ec07cab6f270841a";
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

            const response = await fetch(url);
            if (!response.ok) throw new Error(`API Error ${response.status}`);

            const data = await response.json();
            const condition = data.weather[0].main.toLowerCase();
            let icon = "🌍";

            if (condition.includes("clear")) icon = `<div class="weather-icon sunny">☀️</div>`;
            else if (condition.includes("cloud")) icon = `<div class="weather-icon cloudy">☁️</div>`;
            else if (condition.includes("rain")) icon = `<div class="weather-icon rainy">🌧️</div>`;

            output.innerHTML = `
                <h3>🌍 ${data.name}, ${data.sys.country}</h3>
                ${icon}
                <p>🌡️ Temperature: ${data.main.temp}°C</p>
                <p>🌤️ Condition: ${data.weather[0].description}</p>
            `;
        } catch (err) {
            console.error("Weather Fetch Error:", err);
            output.innerHTML = "⚠️ Failed to retrieve weather data.";
        }
    }

    // === Button Trigger for Weather ===
    document.getElementById("search-btn").addEventListener("click", fetchWeather);

    // === Load AdSense Ads ===
    function loadAds() {
        const adContainer = document.getElementById("ad-container");
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

    loadAds(); // Run on page load
});
// === Show/Hide Back to Top Button on Scroll ===
window.addEventListener("scroll", () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const backToTop = document.getElementById("back-to-top");

    if (scrollY > 400) {
        backToTop.classList.add("visible");
    } else {
        backToTop.classList.remove("visible");
    }
});
// Allow closing modal with Escape key
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const modal = document.getElementById("image-modal");
    if (modal.style.display === "block") {
      modal.style.display = "none";
    }
  }
});
