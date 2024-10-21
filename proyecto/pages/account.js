import Head from 'next/head';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSession, useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import NavBar from '../components/NavBar';


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



const Account = () => {
    const { data: clientSession, status } = useSession();
    const session = clientSession; // Prefer client-side session if available, fallback to server-side session
    //const [userName, setUserName] = useState(null);
    const [userCity, setUserCity] = useState(null);

    /*
    const fetchUsuario = async (email) => {
        try {
          console.log("Fetching user name for email:", email);  // Verifica que el correo sea correcto
          const res = await fetch(`/api/returnnombre/${email}`);  // Fetch user real name by email
          const data = await res.json();
          console.log("Received user name data:", data);  // Imprime lo que devuelve la API
          setUserName(data);
        } catch (error) {
          console.error('Error fetching user name:', error);
        }
      };
      */

      const fetchCiudad = async (email) => {
        try {
          console.log("Fetching user city for email:", email);  // Verifica que el correo sea correcto
          const res = await fetch(`/api/returnciudad/${email}`);  // Fetch user city by email
          const data = await res.json();
          console.log("Received user city data:", data);  // Imprime lo que devuelve la API
          setUserCity(data);
        } catch (error) {
          console.error('Error fetching user city:', error);
        }
      };
    
      useEffect(() => {
        if (session) {
          console.log("Session detected:", session);  // Verifica si la sesión existe
          //fetchUsuario(session.user.email);  // Usa el email de la sesión
          fetchCiudad(session.user.email);
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
                <title>Nébula - Account</title>
            </Head>

            <NavBar/>

            
            <h2 id="subtitulo">Mis Datos de Cuenta</h2>

            <div id="box-info">
            {userCity ? (
                    <div>
                        <p><strong>Nombre:</strong> {session.user.name}</p>
                        <p><strong>Email:</strong> {session.user.email}</p>
                        <p><strong>Ciudad:</strong> {userCity.ciudad}</p>
                    </div>
                ) : (
                    <p>Cargando datos de cuenta...</p>
                )}

                <div>
                    <button onClick={() => signOut({ callbackUrl: '/' })}>Sign Out</button>
                </div>
            </div>
        </>
    );
};

export default Account;
