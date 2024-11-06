import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import NavBar from '../../components/NavBar';
import StandarButton from '../../components/StandarButton';
import EventoBox from '../../components/EventosBox';

export default function DiscotecaDetail() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [discotecaId, setDiscotecaId] = useState('');

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
    if (router.isReady && router.query.discotecaId) {
      const id = router.query.discotecaId;
      setDiscotecaId(id);
      fetchEvents(id);
    }
  }, [router.isReady, router.query.discotecaId]);

  if (!router.isReady || !discotecaId) {
    return (
      <div>
        <Head>
          <meta charSet="utf-8" />
          <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Cargando...</title>
        </Head>
        <NavBar />
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Eventos en {discotecaId}</title>
      </Head>

      <NavBar />

      <h2 className="subtitulo">Eventos en {discotecaId}</h2>

      <div className="box-info">
        <div className="container">
          <div className="fetch-section">
            {loadingEvents ? (
              <p>Cargando eventos...</p>
            ) : events.length > 0 ? (
              <ul className="scrollable-list">
                {events.map((event) => (
                  <li key={event.nombre}>
                    <Link href={`/discoteca/${discotecaId}/${event.nombre}`}>
                      <EventoBox evento={event.nombre} fecha={new Date(event.fecha).toISOString().slice(0, 10).split('-').reverse().join('-')} />   
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
        <StandarButton text={`Compra tus entradas para ${discotecaId}`} />
      </div>
    </div>
  );
}
