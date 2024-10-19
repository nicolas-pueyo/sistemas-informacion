import Head from 'next/head';
import { useState, useEffect } from 'react';
import Link from 'next/link';
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


const Ubi = () => {

    const [usuario, setUsuario] = useState(null);

    // Fetch user data from the API when the component loads
    const fetchUsuario = async () => {
        const res = await fetch('/api/usuarios/2'); // Assuming you fetch user by ID
        const data = await res.json();
        setUsuario(data);
    };

    useEffect(() => {
        fetchUsuario();
    }, []);

    return (
        <>
          <Head>
            <meta charSet="utf-8" />
            <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Nébula</title>
          </Head>
    
          <div id="home">
            <div id="left">
                <Link href="/" className="home-icon">
                    <img className="home-icon" id="pres-logo" src="/img/logo-trans.png" alt="Logo" />
                </Link>
              
            </div>
            <div id="center">
              <h1 id="main-title">NÉBULA</h1>
            </div>
            <div id="right">
              <Link href="/account" className="home-icon">
                <img id="session" className="session" src="/img/session.png" alt="Account" />
              </Link>
              <Link href="/ubi" className="home-icon">
                <img id="ubi" className="ubi" src="/img/ubi.png" alt="Location" />
              </Link>
            </div>
    
          </div>
    
            <h2 id="subtitulo">Ubicación del Usuario</h2>

            <div id="box-info">
                {usuario ? (
                    <div>
                        <p><strong>Nombre:</strong> {usuario.name}</p>
                        <p><strong>Email:</strong> {usuario.email}</p>
                        <p><strong>Ciudad:</strong> {usuario.Ciudad ? usuario.Ciudad.name : 'No disponible'}</p> {/* Display city name */}
                    </div>
                ) : (
                    <p>Cargando datos de usuario...</p>
                )}
            </div>
    
          
    
        </>
      );
  };
  
  export default Ubi;