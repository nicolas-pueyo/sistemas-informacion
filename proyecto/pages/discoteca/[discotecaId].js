import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import NavBar from '../../components/NavBar';
import StandarButton from '../../components/StandarBotton';

export default function DiscotecaDetail() {
  const router = useRouter();
  const { discotecaId } = router.query; // Get the discoteca ID from the URL
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  

  
  // Fetch events for the specific discoteca
  const fetchEvents = async (id) => {
    try {
      const res = await fetch(`/api/eventos/${id}`);
      const data = await res.json();
      setEvents(data);
      setLoadingEvents(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    if (discotecaId) {
      fetchEvents(discotecaId); // Fetch events when discotecaId is available
    }
  }, [discotecaId]);

  return (
    <div>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Eventos en {discotecaId}</title>
      </Head>

      <NavBar />

      <h2 id="subtitulo">Eventos en {discotecaId}</h2>

      <div id="box-info">
        <div className="container">
          <div className="fetch-section">
            {loadingEvents ? (
              <p>Cargando eventos...</p> // Display loading state
            ) : events.length > 0 ? (
              <ul>
                {events.map((event) => (
                  <li key={event.nombre}>
                    <Link href={'/discotecas/${discoteca.nombre}'}>
                    <p>{event.nombre}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No se encontraron eventos para {discotecaId}.</p>
            )}
          </div>
        </div>
      </div>

      <div className="centereddiv">
        <StandarButton text="Compra tus entradas para {discotecaId}" />
      </div>
    </div>
  );
}
