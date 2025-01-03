import Head from 'next/head';
import NavBar from '../components/NavBar'
import { useState, useEffect } from 'react';
import { getSession, useSession } from 'next-auth/react';
import EntradaUser from '../components/EntradaUser'

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
            <div className="gradient-background">
              <div className="container">
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
                                       <EntradaUser 
                                      key={`${entrada.evento}-${entrada.fecha}-${entrada.entrada}-${entrada.ciudad}`}
                                      entrada={entrada.entrada} 
                                      evento={entrada.evento}
                                         fecha={new Date(entrada.fecha).toISOString().slice(0, 10).split('-').reverse().join('-')} 
                                         discoteca={entrada.discoteca} 
                                      ciudad={entrada.ciudad}
                                         seguroDev={entrada.seguro_devolucion} 
                                      nEntradas={entrada.n_entradas}
                                        />
                                        ))}
                                            </ul>
                                        </>
                                    )
                                    : <>
                                      <img src='/img/rengar.png' /> 
                                      <p>Vaya...parece que no tienes ninguna entrada.</p>
                                      </>
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      <div>
                    </div>
                  </div>
              </div>
        </>
    )
}