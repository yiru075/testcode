export default async function handler(req, res) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Extract latitude and longitude query parameters
    const { lat, lon } = req.query;

    const apiKey = process.env.VITE_OPENWEATHER_API_KEY;

    // Validate presence of lat and lon parameters
    if (!lat || !lon) {
        return res.status(400).json({ error: 'Missing lat/lon' });
    }

    try {
        // Fetch current weather data from OpenWeather API with metric units and English language
        const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=en`
        );
        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Weather fetch failed' });
    }
}
