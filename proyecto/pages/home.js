
//TODO
//ahora mismo nadie va a home, hayq ue hacer que cuandologges vayas aquo.!!!!!

import Link from 'next/link'; // no tiene, tendrá eventualmente cuando añadamos discotecas
import { useState, useEffect } from 'react';
import Head from 'next/head';
import RatingBox from '../components/RatingBox';
import NavBar from '../components/NavBar';
import { getSession, useSession } from 'next-auth/react';

export async function getServerSideProps(context) {
  const session = await getSession(context);
  console.log('Server-side session:', session); // Log session here to check if it's available

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}



export default function Home({  }) {
  const { data: clientSession, status } = useSession();
  const session = clientSession; // Prefer client-side session if available, fallback to server-side session
  console.log('Client-side session:', session); // This should now log the correct session both client-side and server-side
  const [discotecas, setDiscotecas] = useState([]);
  const [city, setCity] = useState(null); // City of the logged-in user
  const [loadingCity, setLoadingCity] = useState(true); // Loading state for city fetch
  const [loadingDiscotecas, setLoadingDiscotecas] = useState(false); // Loading state for discotecas

  // Fetch user's city from the API
  const fetchUserCity = async (email) => {
    try {
      console.log(`Fetching city for user email: ${email}`);
      const res = await fetch(`/api/returnciudad/${email}`); // Call the API with the user's email
      const data = await res.json();
      console.log(`Fetched city: ${data.ciudad}`);
      setCity(data.ciudad); // Set the city once it's fetched
    } catch (error) {
      console.error('Error fetching user city:', error);
    } finally {
      setLoadingCity(false); // Finished fetching city
    }
  };

  // Fetch discotecas from the API when the user's city is available
  const fetchDiscotecas = async (city) => {
    try {
      setLoadingDiscotecas(true); // Start loading discotecas
      console.log(`Fetching discotecas for city: ${city}`);
      const res = await fetch(`/api/discotecas/${city}`);
      const data = await res.json();
      console.log('Fetched discotecas:', data); // Log the response to check the structure
      setDiscotecas(data); // Set the discotecas once fetched
    } catch (error) {
      console.error('Error fetching discotecas:', error);
    } finally {
      setLoadingDiscotecas(false); // Finished fetching discotecas
    }
  };

  // UseEffect to fetch the user's city on component mount
  useEffect(() => {
    if (session?.user?.email) {
      fetchUserCity(session.user.email);
    }
  }, [session]);

  // UseEffect to fetch discotecas when the city is available
  useEffect(() => {
    if (city && !loadingCity) {
      fetchDiscotecas(city); // Fetch discotecas once the city is fetched
    }
  }, [city, loadingCity]); // Re-fetch when the city is set and city loading is finished


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
          {loadingCity ? (
                <p>Loading city...</p> // Display loading state for city
              ) : loadingDiscotecas ? (
                <p>Loading discotecas...</p> // Display loading state for discotecas
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

