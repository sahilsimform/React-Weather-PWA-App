import { useEffect, useState, useRef } from "react";
import { fetchWeather } from "./api/fetchWeather";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState("");
  const [error, setError] = useState(""); // Add error state
  const debounceRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchWeather(query);
        setWeather(data);
        setError(""); // Clear error if fetch is successful
      } catch (error) {
        setError("City not found"); // Set error message
        console.log(error.response.data.message);
        setWeather("");
      }
    };

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (query) {
        fetchData();
      }
    }, 500); // Adjust the debounce delay as needed

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  return (
    <div className="main-container">
      <input
        type="text"
        className="search"
        placeholder="Search City"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Display error message */}
      {weather.main ? (
        <div className="city">
          <h2 className="city-name">
            <span>{weather.name}</span>
            <sup>{weather.sys.country}</sup>
          </h2>
          <div className="city-temp">
            {Math.round(weather.main.temp)}
            <sup>&deg;C</sup>
          </div>
          <div className="info">
            <img
              className="city-icon"
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
            <p>{weather.weather[0].description}</p>
          </div>
        </div>
      ) : (
        error && <div className="error">{error}</div>
      )}
    </div>
  );
}

export default App;
