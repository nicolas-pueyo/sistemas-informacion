// pages/addDiscoteca.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
import NavBar from '../../../../../../../components/NavBar';
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
export default function AddEntrada() {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [existencias, setExistencias] = useState('');
  const router = useRouter();
  const {ciudad, discotecaID, fecha, eventoID} = router.query;
  const { data: clientSession } = useSession();
  const session = clientSession; // Prefer client-side session if available, fallback to server-side session

  useEffect(() => {
  }, []);

  const handleSubmit = async (e) => { // NON FUNCTIONAL, TODO -> hacer que realmente ahaña discoteca
    e.preventDefault();


    try {
      
      const res = await fetch('/api/discotecas/gestor/anyadirEntrada', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entrada: nombre,
          evento: eventoID,
          discoteca: discotecaID,
          city: ciudad,
          fecha: fecha,
          precio: precio,
          existencias: existencias,
        }),
      });

      if (res.ok) {
        alert('Entrada añadida exitosamente');
        router.push(`/admin/discoteca/${ciudad}/${discotecaID}/${fecha}/${eventoID}`);
      } else {
        alert('Error al añadir la entrada');
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      alert('Error al añadir la entrada');
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
          <div className="box-info">
            <h1>Añadir Entrada</h1>
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
              <div style={{ marginBottom: '15px' }}>
                <label>Precio:</label>
                <input
                  type="text"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label>Existencias:</label>
                <input
                  type="text"
                  value={existencias}
                  onChange={(e) => setExistencias(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
              <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
                Añadir Entrada
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>
  );
}
