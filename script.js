document.addEventListener("DOMContentLoaded", function () {
    const toggleDarkMode = document.getElementById("dark-mode-toggle");
    const backToTopButton = document.getElementById("back-to-top");

    // Restore dark mode if previously enabled
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
    }

    // Dark Mode Toggle
    toggleDarkMode.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        // Save preference in localStorage
        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
        } else {
            localStorage.setItem("darkMode", "disabled");
        }
    });

    // Back to Top Button Functionality
    backToTopButton.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // Function to fetch weather data with animated icons
    async function fetchWeather() {
        let city = document.getElementById("city-input").value.trim();
        if (!city) {
            document.getElementById("weather-output").innerHTML = "⚠️ Please enter a city name.";
            return;
        }

        try {
            let apiKey = "1f1742f46396f018ec07cab6f270841a"; // OpenWeatherMap API Key
            let url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

            let response = await fetch(url);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} - ${response.statusText}`);
            }

            let data = await response.json();
            let weatherCondition = data.weather[0].main.toLowerCase();
            let weatherIcon = "";

            // Assign icons based on weather condition
            if (weatherCondition.includes("clear")) {
                weatherIcon = `<div class="weather-icon sunny">☀️</div>`;
            } else if (weatherCondition.includes("clouds")) {
                weatherIcon = `<div class="weather-icon cloudy">☁️</div>`;
            } else if (weatherCondition.includes("rain")) {
                weatherIcon = `<div class="weather-icon rainy">🌧️</div>`;
            } else {
                weatherIcon = `<div class="weather-icon">🌍</div>`;
            }

            document.getElementById("weather-output").innerHTML = `
                <h3>🌍 ${data.name}, ${data.sys.country}</h3>
                ${weatherIcon}
                <p>🌡️ Temperature: ${data.main.temp}°C</p>
                <p>🌤️ Condition: ${data.weather[0].description}</p>
            `;

        } catch (error) {
            console.error("Weather API Error:", error);
            document.getElementById("weather-output").innerHTML = "⚠️ Failed to retrieve weather data.";
        }
    }

    // Add event listener to search button
    document.getElementById("search-btn").addEventListener("click", fetchWeather);

    // Function to load ads dynamically
    function loadAds() {
        let adContainer = document.getElementById("ad-container");
        adContainer.innerHTML = `
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                 data-ad-slot="YYYYYYYYYY"
                 data-ad-format="auto"></ins>
            <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
        `;
    }

    // Run ad loading function & auto-load weather on page load
    loadAds();
});
