import { useEffect, useState } from "react";
import News from "./News";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Grid,
  Button,
  TextField,
  CardHeader,
  FormGroup,
  FormControlLabel,
  Switch,
  CssBaseline,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./App.css";
const light = {
  palette: {
    mode: "light",
  },
};

const dark = {
  palette: {
    mode: "dark",
  },
};

function App() {
  const [apiData, setApiData] = useState({});
  const [weatherData, setWeatherData] = useState({});
  const [getCity, setGetCity] = useState("London");
  const [city, setCity] = useState("London");
  const [lat, setLat] = useState(51.5073219);
  const [lon, setLon] = useState(-0.1276474);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

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
  const changeTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  console.log(weatherData);

  return (
    <ThemeProvider theme={isDarkTheme ? createTheme(dark) : createTheme(light)}>
      <CssBaseline />

      <div className="weather-info">
        <CardHeader
          action={
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch checked={isDarkTheme} onChange={changeTheme} />
                }
                label="Dark Theme"
              />
            </FormGroup>
          }
        />
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
                <CardContent align="center">
                  <Typography variant="h5">Currently</Typography>

                  <CardMedia
                    image={`https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`}
                    alt="weather status icon"
                    className="weather-icon-main"
                  />
                  <Typography>
                    {kelvinToC(weatherData.current.temp)}&deg; C
                  </Typography>
                  <Typography>
                    Feels like: {kelvinToC(weatherData.current.feels_like)}&deg;
                    C
                  </Typography>
                </CardContent>
              </Card>
            </div>
            <div>
              <h4 className="weather-info">Hourly:</h4>
              <br></br>
              <Grid container spacing={1}>
                {weatherData.hourly.slice(0, 24).map((hour) => {
                  const date = new Date(hour.dt * 1000);
                  const time = `${date.getHours()}:00`;
                  return (
                    <Grid item xs={1} sm={1} md={1}>
                      <Card className="card" key={hour.dt}>
                        <CardContent align="center">
                          <Typography variant="h6">{time}</Typography>
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
              <br></br>
              <Grid container spacing={1}>
                {weatherData.daily.map((day) => {
                  const daysOfWeek = [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ];
                  const date = new Date(day.dt * 1000);
                  const currentDate = new Date();
                  let time = `${daysOfWeek[date.getDay()]}`;
                  if (date.getDate() === currentDate.getDate()) {
                    time = "Today";
                  }
                  return (
                    <Grid item xs={3} sm={3} md={3}>
                      <Card className="card" key={day.dt}>
                        <CardContent align="center">
                          <Typography variant="h6">{time}</Typography>
                          <CardMedia
                            image={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                            alt="weather status icon"
                            className="weather-icon"
                          />
                          <Typography>
                            Max: {kelvinToC(day.temp.max)}&deg; C
                          </Typography>
                          <Typography>
                            Min: {kelvinToC(day.temp.min)}&deg; C
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </div>
          </>
        )}
        <h4>Top news of the day:</h4>
        <News></News>
      </div>
    </ThemeProvider>
  );
}

export default App;
