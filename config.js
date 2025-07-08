fetch(url)
  .then(res => {
    if (!res.ok) throw new Error("Weather API failed");
    return res.json();
  })
  .then(data => updateWeather(data))
  .catch(err => console.error("Weather fetch error:", err));
const apiKey = "1f1742f46396f018ec07cab6f270841a"; // or your new one
// NEW API KEY//

const apiKey = "bd1a2e25b5af86632c1c461148512426";
