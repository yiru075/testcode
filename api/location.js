export default async function handler(req, res) {

    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const { q, zip } = req.query;
    const country = 'AU';
    const apiKey = process.env.OPENWEATHER_API_KEY;

    try {
        if (zip) {
        const zipRes = await fetch(
            `https://api.openweathermap.org/geo/1.0/zip?zip=${zip},${country}&appid=${apiKey}`
        );
        const zipData = await zipRes.json();
        const zipPlace = {
            name: `Postal code ${zip}`,
            lat: zipData.lat,
            lon: zipData.lon,
            country: zipData.country,
        };
        return res.status(200).json([zipPlace]);
        }

        if (q) {
        const cityRes = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
            q
            )}&limit=5&appid=${apiKey}`
        );
        const data = await cityRes.json();
        return res.status(200).json(data);
        }

        res.status(400).json({ error: 'Missing query' });
    } catch (e) {
        res.status(500).json({ error: 'Location fetch failed' });
    }
}
