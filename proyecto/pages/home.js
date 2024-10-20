
//TODO
//ahora mismo nadie va a home, hayq ue hacer que cuandologges vayas aquo.!!!!!

import Link from 'next/link'; // no tiene, tendrá eventualmente cuando añadamos discotecas
import { useState, useEffect } from 'react';
import Head from 'next/head';
import RatingBox from '../components/RatingBox';
import NavBar from '../components/NavBar';
import { getSession } from 'next-auth/react';

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if(!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  }
}




export default function Home() {
  const [discotecas, setDiscotecas] = useState([]);
  const [city, setCity] = useState(null); // City of the logged-in user
  const [loading, setLoading] = useState(true);

  const fetchUserCity = async () => {
    try {
      const res = await fetch('/api/returnciudad/ciudad'); // Call the API to get the user's city
      const data = await res.json();
      setCity(data.ciudad); // Set the city once it's fetched
    } catch (error) {
      console.error('Error fetching user city:', error);
    }
  };

  const fetchDiscotecas = async (city) => {
    try {
      const res = await fetch(`/api/discotecas/${city}`);
      const data = await res.json();
      setDiscotecas(data);
    } catch (error) {
      console.error('Error fetching discotecas:', error);
    } finally {
      setLoading(false); // Set loading to false after the fetch completes
    }
  };

  // UseEffect to fetch the user's city on component mount
  useEffect(() => {
    fetchUserCity(); // Fetch the city when the component mounts
  }, []);

  // UseEffect to fetch discotecas when the city is available
  useEffect(() => {
    if (city) {
      fetchDiscotecas(city); // Fetch discotecas for the fetched city
    }
  }, [city]);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Nébula</title>
      </Head>

      <NavBar/>

      <h2 id="subtitulo">Let the show begin</h2>

      <div id="box-info">
        <div className="container">
          <div className="button-container">
          <div className="fetch-section">
          {loading ? (
                <p>Loading discotecas...</p> // Display loading state
              ) : discotecas.length > 0 ? (
                <ul>
                  {discotecas.map((discoteca) => (
                    <li key={discoteca.id}>
                      <RatingBox name={discoteca.name} rating={discoteca.rating} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No discotecas found in {city}.</p>
              )}
          </div>
          </div>
        </div>
      </div>
    </>
  );
}

