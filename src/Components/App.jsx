import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [apiData, setApiData] = useState({});
  const [weatherData, setWeatherData] = useState({});
  const [getCity, setGetCity] = useState("London");
  const [city, setCity] = useState("London");
  const [lat, setLat] = useState(51.5073219);
  const [lon, setLon] = useState(-0.1276474);

  const API_key = process.env.REACT_APP_api_key;
  const API_url = new URL("http://api.openweathermap.org/geo/1.0/direct?");
  API_url.searchParams.append("q", city);
  API_url.searchParams.append("appid", API_key);

  useEffect(() => {
    fetch(API_url)
      .then((respone) => respone.json())
      .then((data) => setApiData(data))
      .catch((error) => console.log("Error: ", error));
  }, [city]);
  const inputHandler = (event) => {
    setGetCity(event.target.value);
  };
  const submitHandler = () => {
    setCity(getCity);
    API_url.searchParams.set("q", city);
    setLat(apiData[0].lat);
    setLon(apiData[0].lon);
  };
  useEffect(() => {
    if (lat && lon) {
      fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${API_key}`
      )
        .then((respone) => respone.json())
        .then((data) => setWeatherData(data))
        .catch((error) => console.log("Error: ", error));
    }
  }, [lat, lon]);

  const kelvinToFarenheit = (k) => {
    return (k - 273.15).toFixed(2);
  };

  return (
    <>
      <h3>Weather App</h3>
      <label class="col-form-label">Enter Location :</label>
      <div>
        <input
          type="text"
          id="location-name"
          onChange={inputHandler}
          value={getCity}
        />
      </div>
      <button className="btn btn-primary mt-2" onClick={submitHandler}>
        Search: Hit 2 times
      </button>

      {/* {weatherData && (
        <div>
          <img
            src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
            alt="weather status icon"
            className="weather-icon"
          />
          <p className="h2">
            Currently: {kelvinToFarenheit(weatherData.current.temp)}&deg; F
          </p>
          <p className="h3">
            Feels like: {kelvinToFarenheit(weatherData.current.feels_like)}&deg;
            F
          </p>
        </div>
      )} */}
    </>
  );
}

export default App;
