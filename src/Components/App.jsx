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
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${API_key}`
    )
      .then((respone) => respone.json())
      .then((data) => setWeatherData(data))
      .catch((error) => console.log("Error: ", error));
  }, [lat, lon]);

  const kelvinToC = (k) => {
    return (k - 273.15).toFixed(2);
  };
  const getNext24HoursData = () => {
    const now = new Date();
    const next24HoursData = weatherData.hourly.slice(0, 24).map((hour) => {
      const time = new Date(now.getTime() + hour.dt * 1000);
      const formattedTime = time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      return {
        temp: kelvinToC(hour.temp),
        icon: hour.weather[0].icon,
        time: formattedTime,
      };
    });
    return next24HoursData;
  };

  console.log(weatherData);

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
      <br></br>
      {weatherData.current && (
        <>
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`}
            alt="weather status icon"
            className="weather-icon"
          />
          <p className="h2">
            Currently: {kelvinToC(weatherData.current.temp)}&deg; C
          </p>
          <p className="h3">
            Feels like: {kelvinToC(weatherData.current.feels_like)}&deg; C
          </p>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {weatherData.hourly.slice(0, 24).map((hour) => {
              console.log(hour);
              const date = new Date(hour.dt * 1000);
              const time = `${date.getHours()}:00`;
              return (
                <div key={hour.dt}>
                  <p>{kelvinToC(hour.temp)}&deg; C</p>
                  <p>{time}</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                    alt="weather status icon"
                    className="weather-icon"
                  />
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

export default App;
