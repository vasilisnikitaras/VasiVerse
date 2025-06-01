// Toggle Dark Mode
document.getElementById("dark-mode-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

// Function to fetch weather data
async function fetchWeather() {
    let city = document.getElementById("city-input").value.trim();
    if (!city) {
        document.getElementById("weather-output").innerHTML = "⚠️ Please enter a city name.";
        return;
    }

    try {
        let apiKey = "1f1742f46396f018ec07cab6f270841a"; // Your OpenWeatherMap API Key
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        let data = await response.json();

        if (data.cod === 200) {
            document.getElementById("weather-output").innerHTML = `
                <h3>🌍 ${data.name}, ${data.sys.country}</h3>
                <p>🌡️ Temperature: ${data.main.temp}°C</p>
                <p>🌤️ Condition: ${data.weather[0].description}</p>
            `;
        } else {
            document.getElementById("weather-output").innerHTML = `❌ City not found! Try another.`;
        }
    } catch (error) {
        document.getElementById("weather-output").innerHTML = "⚠️ Failed to retrieve data.";
    }
}

// Add event listener to search button
document.getElementById("search-btn").addEventListener("click", fetchWeather);

// Smooth scrolling for Back to Top
document.getElementById("back-to-top").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// Function to load ads
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

// Run ad loading function on page load
document.addEventListener("DOMContentLoaded", () => {
    loadAds();
});
