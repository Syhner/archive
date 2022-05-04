import { useState, useEffect } from 'react';
import axios from 'axios';
import Languages from './Languages';
import Weather from './Weather';

const Countries = ({ filter, setFilter }) => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all').then(res => {
      setCountries(res.data);
    });
  }, []);

  const countriesFiltered = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  );

  const { length } = countriesFiltered;

  if (length > 10) {
    return <div>Too many matches, specify another filter</div>;
  } else if (length > 1) {
    return countriesFiltered.map(country => (
      <form
        key={country.cca3}
        onSubmit={e => {
          e.preventDefault();
          setFilter(country.name.common);
        }}
      >
        {country.name.common}
        <button type='submit'>show</button>
      </form>
    ));
  } else if (length === 1) {
    const country = countriesFiltered[0];
    const { name, capital = ['None'], area = '', flags } = country;

    return (
      <div>
        <h2>{name.common}</h2>
        <li>capital {capital}</li>
        <li>area {area}</li>
        <Languages country={country} />
        <img src={flags.png} alt={`flag of ${name.common}`} width='150' />
        <Weather country={country} />
      </div>
    );
  } else {
    return <div>None</div>;
  }
};

export default Countries;
