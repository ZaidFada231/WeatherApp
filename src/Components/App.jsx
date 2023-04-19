import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Grid,
  Button,
  TextField,
} from "@mui/material";

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
    <div className="weather-info">
      <h3>Weather App</h3>
      <div>
        <TextField
          id="outlined-basic"
          type="text"
          label="Enter Location :"
          onChange={inputHandler}
          value={getCity}
        />
      </div>
      <br></br>
      <Button variant="outlined" onClick={submitHandler}>
        Search: Hit 2 times
      </Button>
      <br></br>
      {weatherData.current && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "30vh",
            }}
          >
            <Card>
              <CardContent>
                <CardMedia
                  image={`https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`}
                  alt="weather status icon"
                  className="weather-icon-main"
                />
                <Typography>
                  Currently: {kelvinToC(weatherData.current.temp)}&deg; C
                </Typography>
                <Typography>
                  Feels like: {kelvinToC(weatherData.current.feels_like)}&deg; C
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div>
            <h4 className="weather-info">Hourly:</h4>
            <br></br>
            <Grid container spacing={1}>
              {weatherData.hourly.slice(0, 24).map((hour) => {
                console.log(hour);
                const date = new Date(hour.dt * 1000);
                const time = `${date.getHours()}:00`;
                return (
                  <Grid item xs={1} sm={1} md={1}>
                    <Card className="card" variant="outlined" key={hour.dt}>
                      <CardContent
                        style={{
                          justifyContent: "center",
                          height: 75,
                          width: 75,
                        }}
                      >
                        <Typography>{time}</Typography>
                        <CardMedia
                          image={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                          alt="weather status icon"
                          className="weather-icon"
                        />
                        <Typography>{kelvinToC(hour.temp)}&deg; C</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </div>
          <div>
            <h4 className="weather-info">This Week:</h4>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
