import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import NavBar from '../../../../../../components/NavBar';
import EntradaBoxAdmin from '../../../../../../components/EntradasBoxAdmin';
import StandarButton from '../../../../../../components/StandarButton';

export default function EntradaDetail() {
  const router = useRouter();
  const {ciudad, discotecaID, fecha, eventoID} = router.query;
  const [entradas, setEntradas] = useState([]);
  const [loadingEntradas, setLoadingEntradas] = useState(true);

// Fetch events for the specific discoteca
const fetchEntradas = async () => {
  try {
    console.log(`Fetching entradas para evento con id: ${eventoID}`); // Log para ver el id antes de la petición
    const res = await fetch(`/api/entradas/${discotecaID}/${eventoID}`);

    // Verifica si la respuesta es correcta antes de intentar convertirla a JSON
    if (!res.ok) {
      console.error(`Error en la respuesta del servidor: ${res.status}`);
      setLoadingEntradas(false);
      return;
    }

    const data = await res.json();

    // Log para depurar el contenido de los datos recibidos
    console.log('Datos recibidos:', data);

    setEntradas(data);
    setLoadingEntradas(false);
  } catch (error) {
    console.error('Error fetching events:', error);
    setLoadingEvents(false);
  }
};


  useEffect(() => {
    if (router.isReady) {
      fetchEntradas();
    }
  }, [router.isReady]);


  return (
    <div>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Entradas en {eventoID}</title>
      </Head>
      <NavBar />
      <div className="gradient-background">
        <div className="container">
          <div className="centereddiv">
            <Link href={`/admin/discoteca/${ciudad}/${discotecaID}/${fecha}/${eventoID}/anyadirEntrada`}>
              <StandarButton text="AÑADIR UNA ENTRADA" />
            </Link>
          </div>
          <h2 className="subtitulo">Entradas en {eventoID}</h2>
          <div className="box-info">
            <div className="fetch-section">
              {loadingEntradas ? (
                <p>Cargando entradas...</p>
              ) : entradas.length > 0 ? (
                <ul className="scrollable-list">
                  {entradas.map((entrada) => (
                    <li key={entrada.nombre}>
                        <EntradaBoxAdmin entrada={entrada.nombre} evento={eventoID} fecha={fecha}  discoteca={discotecaID} city={ciudad} precio={entrada.precio} existencias={entrada.n_existencias}/>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No se encontraron entradas para {eventoID}.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
