import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import NavBar from '../../../components/NavBar';
import StandarButton from '../../../components/StandarBotton';

export default function EventoDetail() {
    const router = useRouter();
    const { discotecaId, eventoId } = router.query; // Uso directo de router.query
    const [loadingEntradas, setLoadingEntradas] = useState(true);
    const [entradas, setEntradas] = useState([]);

    const fetchEntradas = async (id, id2) => {
        try {
            const res = await fetch(`/api/entradas/${id2}/${id}`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            setEntradas(data);
            setLoadingEntradas(false);
        } catch (error) { // Recibir el error como parámetro
            console.error('Error fetching entradas:', error);
            setLoadingEntradas(false);
        }
    };

    useEffect(() => {
        if (router.isReady && eventoId && discotecaId) {
            fetchEntradas(eventoId, discotecaId);
        }
    }, [router.isReady, eventoId]);

    if (!router.isReady || !eventoId) {
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
                <title>Entradas de {eventoId}</title>
            </Head>

            <NavBar />

            <h2 id="subtitulo">Entradas de {eventoId}</h2>

            <div id="box-info">
                <div className="container">
                    <div className="fetch-section">
                        {loadingEntradas ? (
                            <p>Cargando entradas...</p>
                        ) : entradas.length > 0 ? (
                            <ul>
                                {entradas.map((entrada) => (
                                    <li key={entrada.nombre}>
                                        <Link href={`/entradas/${entrada.nombre}`}>
                                            <p>{entrada.nombre}</p>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No se encontraron entradas para {eventoId}.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="centereddiv">
                <StandarButton text={`Compra tus entradas para ${eventoId}`} />
            </div>
        </div>
    );
}
