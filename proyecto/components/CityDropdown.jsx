// components/CityDropdown.js

import { useState } from 'react';
import { useCityContext } from '../contexts/CityContext';

const CityDropdown = ({ onSelectCity }) => {
  const { cities } = useCityContext();
  const [search, setSearch] = useState('');

  const filteredCities = cities.filter(city =>
    city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="city-dropdown">
      <input
        type="text"
        placeholder="Search for a city..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="city-search-input"
      />
      <ul className="city-list">
        {filteredCities.map((city) => (
          <li key={city} onClick={() => onSelectCity(city)} className="city-item">
            {city}
          </li>
        ))}
      </ul>

      {/* CSS for styling */}
      <style jsx>{`
        .city-dropdown {
          width: 250px; /* Increase width */
          background-color: black;
          padding: 10px;
          border-radius: 8px;
        }

        .city-search-input {
          width: 100%;
          padding: 8px;
          margin-bottom: 10px;
          background-color: #333;
          color: white;
          border: none;
          border-radius: 4px;
          outline: none;
        }

        .city-list {
          list-style-type: none;
          padding: 0;
          margin: 0;
          max-height: 200px; /* Limit dropdown height */
          overflow-y: auto;
        }

        .city-item {
          padding: 10px;
          cursor: pointer;
          color: white;
          background-color: black;
          border-bottom: 1px solid #444;
          transition: background-color 0.2s;
        }

        .city-item:hover {
          background-color: #444;
        }
      `}</style>
    </div>
  );
};

export default CityDropdown;
