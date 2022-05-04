import React from 'react';

const Languages = ({ country }) => {
  const { languages } = country;

  return (
    <div>
      <h4>
        <b>languages:</b>
      </h4>
      <ul>
        {Object.values(languages).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>
    </div>
  );
};

export default Languages;
