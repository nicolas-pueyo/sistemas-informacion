
//TODO
//ahora mismo nadie va a home, hayq ue hacer que cuandologges vayas aquo.!!!!!

import Link from 'next/link'; // no tiene, tendrá eventualmente cuando añadamos discos
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

      <NavBar/>

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

