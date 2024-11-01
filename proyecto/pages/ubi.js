import Head from 'next/head';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import NavBar from '../components/NavBar'
import {getSession, useSession} from 'next-auth/react'

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
    const { data: clientSession, status } = useSession();
    const [usuario, setUsuario] = useState(null);
    const [email, setEmail] = useState(null);
    const session = clientSession;

    // Fetch user data from the API when the component loads
    const fetchUsuario = async (email) => {
        const res = await fetch(`/api/returnciudad/${email}`); 
        const data = await res.json();
        setUsuario(data);
    };

    useEffect(() => {
      if (session) {
        console.log("Session detected:", session);  // Verifica si la sesión existe
        //fetchUsuario(session.user.email);  // Usa el email de la sesión
        fetchUsuario(session.user.email);
      } else {
        console.log("No session detected");  // Verifica si no hay sesión
      }
    }, [session]);

    return (
        <>
          <Head>
            <meta charSet="utf-8" />
            <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Nébula</title>
          </Head>
          <NavBar />
            <h2 id="subtitulo">Ubicación del Usuario</h2>
            <div className="box-info">
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