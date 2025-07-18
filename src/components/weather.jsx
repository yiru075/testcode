import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './weather.css';

function Weather() {
  const [input, setInput] = useState(''); // User input from the search field
  const [suggestions, setSuggestions] = useState([]); // Suggestions from location API
  const [weather, setWeather] = useState(null); // Weather data from weather API
  const [error, setError] = useState(''); // Error message state
  const debounceTimeout = useRef(null); // Timer reference for debouncing
  const inputRef = useRef(null); // Reference to input element
  const skipSuggestion = useRef(false); // Flag to skip suggestion logic after selection

  const [bgClass, setBgClass] = useState(''); // Background class to apply weather theme

  // Determine background class based on weather description
  const getBackgroundClassByDescription = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes('cloud')) return 'cloudy-bg';
    if (
      desc.includes('rain') ||
      desc.includes('drizzle') ||
      desc.includes('storm') ||
      desc.includes('thunder')
    )
      return 'rainy-bg';
    return 'sunny-bg';
  };

  // Update body background class when bgClass changes
  useEffect(() => {
    document.body.className = bgClass;
    return () => {
      document.body.className = '';
    };
  }, [bgClass]);

  // Debounced input watcher
  useEffect(() => {
    if (skipSuggestion.current) {
      skipSuggestion.current = false;
      return;
    }

    if (input.length < 2) {
      setSuggestions([]);
      return;
    }

    // Debounce logic: only fire API after typing stops for 300ms
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      fetchSuggestions(input);
    }, 300);

    return () => clearTimeout(debounceTimeout.current);
  }, [input]);

  // Fetch city or zip suggestions based on input
  const fetchSuggestions = async (query) => {
    try {
      const isZip = /^\d{3,10}$/.test(query.trim());
      const res = await axios.get(
        isZip ? `/api/location?zip=${query}` : `/api/location?q=${query}`
      );
      setSuggestions(res.data);
      setError('');
    } catch (e) {
      setError('Failed to fetch location suggestions.');
      setSuggestions([]);
    }
  };

  // When user selects a suggestion, fetch weather data
  const handleSelect = async (place) => {
    const label = `${place.name || ''}${place.state ? ', ' + place.state : ''}, ${place.country}`;
    setInput(label);
    skipSuggestion.current = true;
    setSuggestions([]);
    setWeather(null);
    setError('');

    try {
      const res = await axios.get(`/api/weather?lat=${place.lat}&lon=${place.lon}`);
      setWeather(res.data);
      const description = res.data.weather[0].description;
      setBgClass(getBackgroundClassByDescription(description));
    } catch (e) {
      setError('Failed to fetch weather data.');
    }

    // Blur the input after selection to hide keyboard on mobile
    if (inputRef.current) inputRef.current.blur();
  };

  return (
    <div className="weather-container">
      <h1 className="title">Climate Now</h1>
      <h2>Real-time weather information</h2>

      <div className="input-wrapper">
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter city or postal code"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setWeather(null); // Clear old weather
            setError('');     // Clear old error
          }}
          onBlur={() => {
            if (suggestions.length === 0 && !weather && input.trim().length > 0) {
              setError('No matching location found.');
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (suggestions.length === 0 && !weather && input.trim().length > 0) {
                setError('No matching location found.');
              }
            }
          }}
          className="input-field"
        />

        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((place, i) => (
              <li key={i} onClick={() => handleSelect(place)} className="suggestion-item">
                {place.name || `Lat: ${place.lat}, Lon: ${place.lon}`}
                {place.state ? `, ${place.state}` : ''}, {place.country}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <div className="error-msg">{error}</div>}

      {weather && (
        <div className="weather-result">
          <h2>{weather.name}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
            className="weather-icon"
          />
          <p className="description">{weather.weather[0].description}</p>
          <p>Temperature: {weather.main.temp} °C</p>
          <p>Humidity: {weather.main.humidity} %</p>
          <p>Wind speed: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
}

export default Weather;
