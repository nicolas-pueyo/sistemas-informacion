
//TODO
//ahora mismo nadie va a home, hayq ue hacer que cuandologges vayas aquo.!!!!!

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import RatingBox from '../components/RatingBox';

export default function Home() {
  const [discotecas, setDiscotecas] = useState([]);
  

  // Fetch discotecas from the API when the component loads
  const fetchDiscotecas = async () => {
    try {
      const res = await fetch('/api/discotecas');
      const text = await res.text();
      console.log('Raw response:', text);  // Imprime la respuesta cruda
      const data = JSON.parse(text);
      setDiscotecas(data);
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  };

   // useEffect to fetch discotecas when the component loads
   useEffect(() => {
    fetchDiscotecas(); // Fetch discotecas when the component mounts
  }, []); // Empty dependency array to run the effect only once on component mount

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Nébula</title>
      </Head>

      <div id="home">
        <div id="left">
                <Link href="/" className="home-icon">
                <img className="home-icon" id="pres-logo" src="/img/logo-trans.png" alt="Logo" />
                </Link>
              
        </div>
        <div id="center">
          <h1 id="main-title">NÉBULA</h1>
        </div>
        <div id="right">
          <Link href="/account" className="home-icon">
            <img id="session" className="session" src="/img/session.png" alt="Account" />
          </Link>
          <Link href="/ubi" className="home-icon">
            <img id="ubi" className="ubi" src="/img/ubi.png" alt="Location" />
          </Link>
        </div>

      </div>

      <h2 id="subtitulo">Let the show begin</h2>

      <div id="box-info">
        <div className="container">
          <div className="button-container">
          <div className="fetch-section">
            {discotecas.length > 0 ? (
              <ul>
              {discotecas.map((discoteca) => (
                <li key={discoteca.id}>
                  <RatingBox name={discoteca.name} rating={discoteca.rating} />
                </li>
              ))}
              </ul>
            ) : (
              <p>No discotecas found.</p>
            )}
          </div>
          </div>
        </div>
      </div>
    </>
  );
}

