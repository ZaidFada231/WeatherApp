import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [apiData, setApiData] = useState({});
  const [getCity, setGetCity] = useState('London');
  const [city, setCity] = useState('London');
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
      .catch((error) => console.log("Error: ", error))
  }, [])
  const inputHandler = (event) =>{
    setGetCity(event.target.value);
  };
  const submitHandler = () => {
    setCity(getCity);
    setLat(apiData[0].lat);
    setLon(apiData[0].lon);
  };
  console.log(apiData);
  console.log(city);
  return (
    <>
      <h3>Weather App</h3>
      <label for="location-name" class="col-form-label">
            Enter Location :
          </label>
        <div class="col-auto">
          <input
            type="text"
            id="location-name"
            class="form-control"
            onChange={inputHandler}
            value={getCity}
          />
        </div>
        <button className="btn btn-primary mt-2" onClick={submitHandler}>
          Search
        </button>
    </>
  );
}

export default App;
