// contexts/CityContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const CityContext = createContext();

export const useCityContext = () => useContext(CityContext);

export const CityProvider = ({ children }) => {
  const { data: session } = useSession();
  const [userCity, setUserCity] = useState(null);
  const [cities, setCities] = useState([]); // Start with an empty list

  // Load initial user city from session or database if available
  useEffect(() => {
    if (session?.user?.city) {
      setUserCity(session.user.city);
    }
  }, [session]);

  // Fetch cities from the API on mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('/api/ciudades');
        if (response.ok) {
          const cityList = await response.json();
          setCities(cityList);
        } else {
          console.error('Failed to fetch cities:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities();
  }, []); // Empty dependency array ensures this only runs once on mount

  return (
    <CityContext.Provider value={{ userCity, setUserCity, cities }}>
      {children}
    </CityContext.Provider>
  );
};
