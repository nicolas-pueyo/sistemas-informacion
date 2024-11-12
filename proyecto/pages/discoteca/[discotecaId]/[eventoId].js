// pages/[discotecaId]/[eventoId]/index.js

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import NavBar from '../../../components/NavBar';
import StandarButton from '../../../components/StandarButton';
import EntryCounter from '../../../components/EntryCounter';

export default function EventoDetail() {
  const { data: session } = useSession(); // Access the session
  const router = useRouter();
  const { discotecaId, eventoId } = router.query;
  const [loadingEntradas, setLoadingEntradas] = useState(true);
  const [entradas, setEntradas] = useState([]);
  const [counts, setCounts] = useState({});
  const [seguros, setSeguros] = useState({});
  

  const fetchEntradas = async (eventoId, discotecaId) => {
    try {
      const res = await fetch(`/api/entradas/${discotecaId}/${eventoId}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setEntradas(data);
      setLoadingEntradas(false);
    } catch (error) {
      console.error('Error fetching entradas:', error);
      setLoadingEntradas(false);
    }
  };

  useEffect(() => {
    if (router.isReady && eventoId && discotecaId) {
      fetchEntradas(eventoId, discotecaId);
    }
  }, [router.isReady, eventoId]);

  const handleCountChange = (id, count, hasSeguro) => {
    setCounts(prev => ({
      ...prev,
      [id]: count
    }));
    setSeguros(prev => ({
      ...prev,
      [id]: hasSeguro
    }));
  };

  const handleDownloadPDF = async () => {
    const totalSelected = Object.values(counts).reduce((sum, count) => sum + count, 0);
    if (totalSelected < 1) {
      alert('Por favor, selecciona al menos una entrada.');
      return;
    }

    try {
      const res = await fetch('/api/generarEntrada', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entradas,
          counts,
          eventoId,
          discotecaId,
          userEmail: session?.user?.email,
          seguros
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate PDF');
      }

      const { fileUrl, fileName } = await res.json();

      // Download the PDF
      const safeDiscotecaName = discotecaId.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const safeEventoName = eventoId.replace(/[^a-z0-9]/gi, '_').toLowerCase();

      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', `${safeDiscotecaName}_${safeEventoName}_entradas.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Redirect to pagarEntradas route with fileName as query parameter
      setTimeout(() => {
        router.push({
          pathname: `/discoteca/${discotecaId}/${eventoId}/pagarEntradas`,
          query: { fileName },
        });
      }, 500);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  // Check if at least one entrada has more than zero selected
  const isPurchaseEnabled = Object.values(counts).some(count => count > 0);

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

      <h2 id="subtitulo" className="centereddiv">Entradas de {eventoId}</h2>

      <div className="gradient-background">
        <div className="container">
          <div className="box-info">
            <div className="container">
              <div className="button-container">
                <div className="fetch-section">
                  {loadingEntradas ? (
                    <p>Cargando entradas...</p>
                  ) : entradas.length > 0 ? (
                    <ul className="scrollable-list">
                      {entradas.map((entrada) => (
                        <li key={entrada.nombre}>
                          <EntryCounter
                            entradaId={entrada.id}
                            discoteca={discotecaId}
                            entradaName={entrada.nombre}
                            onCountChange={handleCountChange}
                          />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No se encontraron entradas para {eventoId}.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div style={{ margin: "10px" }}>
            <div className="centereddiv">
              <StandarButton className="buy-entradas" // hacer que escale a mas pequeño? diría
                text={`Compra tus entradas para ${eventoId}`} onClick={handleDownloadPDF}
                disabled={!isPurchaseEnabled} // Disable button if no entradas are selected
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
