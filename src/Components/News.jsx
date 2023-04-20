import React, { useState, useEffect } from "react";
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

const News = () => {
  const [news, setNews] = useState([]);

  const API_key_news = process.env.REACT_APP_api_key_news;
  const API_url_news = new URL(
    "https://api.nytimes.com/svc/topstories/v2/home.json?"
  );
  API_url_news.searchParams.append("api-key", API_key_news);

  useEffect(() => {
    fetch(API_url_news)
      .then((respone) => respone.json())
      .then((data) => setNews(data.results.slice(0, 12)))
      .catch((error) => console.log("Error: ", error));
  }, []);
  console.log(API_url_news);
  console.log(news);
  return (
    <div>
      <br></br>
      <Grid container spacing={1}>
        {news.map((article, index) => (
          <Grid item xs={2} sm={4} md={3}>
            <Card className="card" key={index}>
              <CardContent align="center">
                <Typography variant="h5">{article.title}</Typography>
                <Typography> {article.per_facet[0]} </Typography>
                <br></br>
                <Typography>{article.abstract}</Typography>
                <br></br>
                <CardMedia
                  style={{ height: 300 }}
                  component="img"
                  src={article.multimedia[0].url}
                  alt="Article Image"
                />
                <form action={article.url}>
                  <Button type="submit">Learn More</Button>
                </form>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

{
  /* <Grid container spacing={1}>
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
              </Grid> */
}

export default News;
