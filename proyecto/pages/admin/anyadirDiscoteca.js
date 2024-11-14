// pages/addDiscoteca.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
import NavBar from '../../components/NavBar';
import Head from 'next/head';

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
export default function AddDiscoteca() {
  const [nombre, setNombre] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [aforo, setAforo] = useState('');
  const [cities, setCities] = useState([]);
  const router = useRouter();
  const { data: clientSession } = useSession();
  const session = clientSession; // Prefer client-side session if available, fallback to server-side session

  useEffect(() => {
    async function fetchCities() {
      try {
        const res = await fetch('/api/ciudades');
        const data = await res.json();
        setCities(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching cities:', error);
        setCities([]);
      }
    }
    fetchCities();
  }, []);

  const handleSubmit = async (e) => { // NON FUNCTIONAL, TODO -> hacer que realmente ahaña discoteca
    e.preventDefault();

    try {
      
      const res = await fetch('/api/discotecas/gestor/anyadirDiscoteca', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
          name: nombre,
          city: ciudad,
          capacity: aforo,
        }),
      });

      if (res.ok) {
        alert('Discoteca añadida exitosamente');
        router.push('/admin/admin'); // Redirige a la página principal o a una lista de discotecas
      } else {
        alert('Error al añadir la discoteca');
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      alert('Error al añadir la discoteca');
    }
  };

  if (session?.user.tipo !== 'Admin') {
    return (
      <>
        <Head>
          <meta charSet="utf-8" />
          <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Nébula</title>
        </Head>
        <NavBar/>
        <p>No tienes acceso a esta página</p>
      </> 
    )
  } 

return (
  <>
    <Head>
     <meta charSet="utf-8" />
     <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     <title>Nébula</title>
    </Head>
    <NavBar/>
    <div className="gradient-background">
      <div className="container">
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <h1>Añadir Discoteca</h1>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label>Nombre:</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            <div className="centereddiv">
              <select value={ciudad} onChange={(e) => setCiudad(e.target.value)} required>
                <option value="">Select city</option>
                  {cities.map((city) => (
                  <option key={city} value={city}>
                  {city}
                  </option>
              ))}
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Aforo:</label>
              <input
                type="number"
                value={aforo}
                onChange={(e) => setAforo(e.target.value)}
                required
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
              Añadir Discoteca
            </button>
          </form>
        </div>
      </div>
    </div>
  </>
  );
}
