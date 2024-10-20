
//TODO
//ahora mismo nadie va a home, hayq ue hacer que cuandologges vayas aquo.!!!!!

import Link from 'next/link'; // no tiene, tendrá eventualmente cuando añadamos discotecas
import { useState, useEffect } from 'react';
import Head from 'next/head';
import RatingBox from '../components/RatingBox';
import NavBar from '../components/NavBar';
import { getSession, useSession } from 'next-auth/react';
import Coin from '../components/Coin';
import StandarButton from '../components/StandarBotton';

export async function getServerSideProps(context) {
  const session = await getSession(context);

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
  const [discotecas, setDiscotecas] = useState([]);
  const [city, setCity] = useState(null); // City of the logged-in user
  const [loadingCity, setLoadingCity] = useState(true); // Loading state for city fetch
  const [loadingDiscotecas, setLoadingDiscotecas] = useState(false); // Loading state for discotecas


  const fetchCiudad = async (email) => {
    try {
      const res = await fetch(`/api/returnciudad/${email}`);  // Fetch user city by email
      const data = await res.json();
      setCity(data.ciudad);
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
      const res = await fetch(`/api/discotecas/${city}`);
      const data = await res.json();
      setDiscotecas(data); // Set the discotecas once fetched
    } catch (error) {
      console.error('Error fetching discotecas:', error);
    } finally {
      setLoadingDiscotecas(false); // Finished fetching discotecas
    }
  };

  useEffect(() => {
    if (session) {
      console.log("Session detected:", session);  // Verifica si la sesión existe
      //fetchUsuario(session.user.email);  // Usa el email de la sesión
      fetchCiudad(session.user.email);
    } else {
      console.log("No session detected");  // Verifica si no hay sesión
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

      <h2 id="subtitulo">Discotecas</h2>

      <div id="box-info">
        <div className="container">
          <div className="button-container">
          <div className="fetch-section">
          {loadingCity ? (
                <p>Loading city...</p> // Display loading state for city
              ) : loadingDiscotecas ? (
                <p>Loading discotecas...</p> // Display loading state for discotecas
              ) : discotecas.length > 0 ? (
                <>
                console.log(discotecas)
                <ul>
                  {discotecas.map((discoteca) => (
                    <li key={discoteca.nombre}>
                      <RatingBox name={discoteca.nombre} rating={discoteca.calificacion} discoteca={discoteca.nombre} />
                    </li>
                  ))}
                </ul>
                </>
              ) : (
                <p>No discotecas found in {city}.</p>
              )}
          </div>
          </div>
          <Coin/>
        </div>
      </div>
      <div className='centereddiv'>      
        <StandarButton text="AQUI TIENES TUS ENTRADAS TONTAINA"/>
      </div>
    </>
  );
}

