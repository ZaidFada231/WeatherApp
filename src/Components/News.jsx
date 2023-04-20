import React, { useState, useEffect } from "react";

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
      .then((data) => setNews(data))
      .catch((error) => console.log("Error: ", error));
  }, []);
  console.log(API_url_news);
  console.log(news.results);
  return (
    <div>
      {news.results.map((article, index) => (
        <div key={index}>
          <h3>{article.title}</h3>
          <p>{article.abstract}</p>
        </div>
      ))}
    </div>
  );
};

export default News;
