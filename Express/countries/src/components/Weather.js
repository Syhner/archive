import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = ({ country }) => {
  const [weather, setWeather] = useState();

  useEffect(() => {
    const { latlng } = country.capitalInfo;

    axios
      .get('http://api.openweathermap.org/data/2.5/weather', {
        params: {
          lat: latlng[0],
          lon: latlng[1],
          units: 'metric',
          appid: process.env.REACT_APP_API_KEY,
        },
      })
      .then(({ data }) => {
        const temp = data.main.temp;
        const wind = data.wind.speed;
        const icon = data.weather[0].icon;

        setWeather({ temp, wind, icon });
      });
  }, [country]);

  if (weather) {
    return (
      <div>
        <h3>Weather in {country.capital}</h3>
        <li>temperature {weather.temp} Celsius</li>
        <img
          src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt='weather icon'
        />
        <li>wind {weather.wind} m/s</li>
      </div>
    );
  } else {
    return null;
  }
};

export default Weather;
