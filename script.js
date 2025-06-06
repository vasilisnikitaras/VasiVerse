/* Global Styling */
body {
    background: linear-gradient(to bottom, #f7f7f7, #e0e0e0);
    font-family: Arial, sans-serif;
    text-align: center;
    margin: 0;
    transition: background 0.3s ease, color 0.3s ease;
}

/* Dark Mode */
body.dark-mode {
    background: #222;
    color: #f5f5f5;
}

.container.dark-mode {
    background: rgba(50, 50, 50, 0.9);
    color: #f5f5f5;
}

/* Header */
header {
    background: #0288d1;
    color: white;
    padding: 20px;
    font-size: 24px;
}

/* Dark Mode Button */
#dark-mode-toggle {
    background: #444;
    color: white;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
}

#dark-mode-toggle:hover {
    background: #555;
}

/* Navigation Bar */
nav ul {
    list-style-type: none;
    padding: 0;
}

nav ul li {
    display: inline;
    margin: 15px;
}

nav ul li a {
    text-decoration: none;
    font-size: 18px;
    color: #0288d1;
    padding: 10px;
    border-radius: 5px;
    background: #e0f7fa;
}

nav ul li a:hover {
    background: #0288d1;
    color: white;
}

/* Sections */
section {
    padding: 20px;
    background: #ffffff;
    border-radius: 10px;
}

/* Back to Top Button */
#back-to-top {
    display: block;
    background: #ffcc00;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    text-decoration: none;
}

#back-to-top:hover {
    background: #ffaa00;
}

/* Footer */
footer {
    background: #333;
    color: white;
    padding: 15px;
    margin-top: 20px;
}

/* Weather Icon Animations */
.weather-icon {
    width: 50px;
    height: 50px;
    display: inline-block;
}

.sunny {
    animation: sun-glow 3s infinite ease-in-out;
}

@keyframes sun-glow {
    0% { filter: brightness(100%); }
    50% { filter: brightness(120%); }
    100% { filter: brightness(100%); }
}

.cloudy {
    animation: cloud-drift 4s infinite linear;
}

@keyframes cloud-drift {
    0% { transform: translateX(0px); }
    100% { transform: translateX(10px); }
}

.rainy {
    animation: rain-fall 2s infinite linear;
}

@keyframes rain-fall {
    0% { transform: translateY(0px); opacity: 1; }
    100% { transform: translateY(15px); opacity: 0; }
}

/* Dark Mode - Only Changes Background */
body.dark-mode {
    background-color: #2E2E2E; /* Soft dark gray */
    color: #f5f5f5; /* Light text color */
}

/* Ensure all sections and containers are affected by dark mode */
section.dark-mode, .container.dark-mode {
    background: rgba(50, 50, 50, 0.9);
    color: #f5f5f5;
}



//document.addEventListener("DOMContentLoaded", function () {
  //  const toggleDarkMode = document.getElementById("dark-mode-toggle");
    // const backToTopButton = document.getElementById("back-to-top");

    // Restore dark mode if previously enabled
/*    if (localStorage.getItem("darkMode") === "enabled") {
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
