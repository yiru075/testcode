 # CLIMATE NOW
 
 A simple React application that provides real-time weather information based on user-input city names or postal codes. The background dynamically changes according to current weather conditions (sunny, cloudy, rainy).


## Deployed on Vercel
https://climatenow.vercel.app


## Tech Stack
Frontend: React + Vite
API: OpenWeatherMap API
Deployment: Vercel
Serverless Function:
    - api/location.js(Fetch geolocation data (city name or postal code))
    - api/weather.js(Fetch weather data by latitude/longitude)


## Installation and Run Locally
### Clone the Repostory
```bash
https://github.com/yiru075/testcode.git
cd weather
```

### Install Dependencies
`npm install`

### Set Up Environment Variables
Create a .env.local file in the root folder with:
VITE_OPENWEATHER_API_KEY=your_api_key_here


### Start the App Locally
`npm run dev`
