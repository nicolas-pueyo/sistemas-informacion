
import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import CityDropdown from './CityDropdown';
import { useCityContext } from '../contexts/CityContext'; // Import combined context

const NavBar = () => {
  const { data: session, status } = useSession();
  const { userCity, setUserCity, cities } = useCityContext(); // Access userCity and cities from context
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const updateCity = async (selectedCity) => {
    try {
      const res = await fetch('/api/updateCity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email, city: selectedCity }),
      });

      if (res.ok) {
        setUserCity(selectedCity);
        setIsDropdownOpen(false);
      } else {
        console.error('Failed to update city');
      }
    } catch (error) {
      console.error('Error updating city:', error);
    }
  };

    // Determinar la ruta de redirección según el tipo de usuario
    const redirectPath = session?.user?.tipo === 'User' ? '/home' : '/admin/admin';

  return (
    <div className="home">
      <div className="left">
        <Link href={redirectPath} className="home-icon">
          <img className="pres-logo" src="/img/logo-trans.png" alt="Logo" />
        </Link>
      </div>
      <div className="center">
        <h1 className="main-title">NÉBULA</h1>
      </div>
      <div className="right">
        {status === 'authenticated' && (
          <>
            <Link href="/account" className="home-icon">
              <img className="session" src="/img/session.png" alt="Account" />
            </Link>
            <div className="dropdown-container">
              <img
                className="ubi home-icon"
                src="/img/ubi.png"
                alt="Location"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />
              {isDropdownOpen && (
                <div className="dropdown-content">
                  <CityDropdown cities={cities} onSelectCity={updateCity} />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
