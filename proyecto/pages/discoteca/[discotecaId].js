import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar'; // Adjust if necessary

export default function DiscotecaPage() {
  const router = useRouter();
  const { discotecaId } = router.query; // Get the discotecaId from the URL
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch eventos for the selected discoteca
  const fetchEventos = async () => {
    try {
      const res = await fetch(`/api/eventos/${discotecaId}`);
      const data = await res.json();
      setEventos(data);
    } catch (error) {
      console.error('Error fetching eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (discotecaId) {
      fetchEventos();
    }
  }, [discotecaId]);

  return (
    <>
      <NavBar />
      <div className="eventos-container">
        {loading ? (
          <p>Loading events...</p>
        ) : eventos.length > 0 ? (
          <ul>
            {eventos.map((evento) => (
              <li key={evento.id}>
                <h3>{evento.name}</h3>
                <p>{evento.description}</p>
                <p>{evento.date}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No events found for this discoteca.</p>
        )}
      </div>
    </>
  );
}
