import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import NavBar from '../../../../components/NavBar';
import EventoBoxAdmin from '../../../../components/EventosBoxAdmin';
import StandarButton from '../../../../components/StandarButton';

export default function EventoDetail() {
  const router = useRouter();
  const {ciudad, discotecaID} = router.query;
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

// Fetch events for the specific discoteca
const fetchEvents = async () => {
  try {
    console.log(`Fetching eventos para discoteca con id: ${discotecaID}`); // Log para ver el id antes de la petición
    const res = await fetch(`/api/eventos/${discotecaID}`);

    // Verifica si la respuesta es correcta antes de intentar convertirla a JSON
    if (!res.ok) {
      console.error(`Error en la respuesta del servidor: ${res.status}`);
      setLoadingEvents(false);
      return;
    }

    const data = await res.json();

    // Log para depurar el contenido de los datos recibidos
    console.log('Datos recibidos:', data);

    setEvents(data);
    setLoadingEvents(false);
  } catch (error) {
    console.error('Error fetching events:', error);
    setLoadingEvents(false);
  }
};


  useEffect(() => {
    if (router.isReady) {
      fetchEvents();
    }
  }, [router.isReady]);


  return (
    <div>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Eventos en {discotecaID}</title>
      </Head>
      <NavBar />
      <div className="gradient-background">
      <Link href={`/admin/discoteca/${ciudad}/${discotecaID}/anyadirEvento`}>
        <StandarButton text="AÑADIR UN EVENTO" />
      </Link>
        <div className="container">
          <h2 className="subtitulo">Eventos en {discotecaID}</h2>

          <div className="box-info">
            <div className="container">
              <div className="fetch-section">
                {loadingEvents ? (
                  <p>Cargando eventos...</p>
                ) : events.length > 0 ? (
                  <ul className="scrollable-list">
                    {events.map((event) => (
                      <li key={event.nombre}>
                        <Link href={`/admin/discoteca/${ciudad}/${discotecaID}/${event.fecha}/${event.nombre}`}>
                          <EventoBoxAdmin evento={event.nombre} fecha={new Date(event.fecha).toISOString().slice(0, 10).split('-').reverse().join('-')}  discoteca={discotecaID} city={ciudad} fechaFetch={event.fecha}/>   
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No se encontraron eventos para {discotecaID}.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
