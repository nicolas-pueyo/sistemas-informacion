import Head from 'next/head';
import NavBar from '../components/NavBar'
import { useState, useEffect } from 'react';
import { getSession, useSession } from 'next-auth/react';

//hay que pillar el nombre de usuario y hacer la query

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

export default function Entradas() {
    const { data: clientSession, status } = useSession();
    const session = clientSession; 
    const [loadingEntradas, setLoadingEntradas] = useState(true);
    const [entradas, setEntradas] = useState([])

    const fetchEntradas = (async (email) => {
        try {
            setLoadingEntradas(true) //Comienza a fetchear entradas
            console.log(`/api/entradasUser/${email}`);
            const res = await fetch(`/api/entradasUser/${email}`);
            const data = await res.json();
            setEntradas(data);
        } catch(error) {
            console.log("Error fetching entradas", email);
        }
        finally {
            setLoadingEntradas(false)
        }
    });


    useEffect(() => {
        if (session) {
          console.log("Session detected:", session);  // Verifica si la sesión existe
          //fetchUsuario(session.user.email);  // Usa el email de la sesión
          console.log(session.user.email);
          fetchEntradas(session.user.email);
        } else {
          console.log("No session detected");  // Verifica si no hay sesión
        }
      }, [session]);


    return(
        <>
            <Head>
                <meta charSet="utf-8" />
                <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Nébula - Entradas</title>
            </Head>
            <NavBar />
            <h2 className="subtitulo">Mis entradas</h2>
            <div className="box-info">
                <div className="container">
                    <div className="button-container">
                        <div className="fetch-section">
                            {loadingEntradas ? (
                                <p>Cargando entradas...</p> )
                                : entradas.length > 0 ? (
                                    <>
                                    <ul>
                                        {entradas.map((entrada) => (
                                           <li key={entrada.evento}>
                                                {entrada.evento}
                                            </li>
                                        ))}
                                        </ul>
                                    </>
                                )
                                : <p>No tienes ninguna entrada.</p>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div>
            </div>
        </>
    )
}