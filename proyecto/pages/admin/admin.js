import Link from 'next/link'; // no tiene, tendrá eventualmente cuando añadamos discotecas
import { useState, useEffect } from 'react';
import Head from 'next/head';
import RatingBoxAdmin from '../../components/RatingBoxAdmin';
import NavBar from '../../components/NavBar';
import { getSession, useSession } from 'next-auth/react';
import StandarButton from '../../components/StandarButton';
import { useCityContext } from '../../contexts/CityContext';


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



export default function Home({}) {
  const { userCity } = useCityContext();
  const { data: clientSession, status } = useSession();
  const session = clientSession;
  const [discotecas, setDiscotecas] = useState([]);
  const [city, setCity] = useState(null); // City of the logged-in user
  const [discotecasConCiudad, setDiscotecasConCiudad] = useState([]);
  const [loadingCity, setLoadingCity] = useState(true); // Loading state for city fetch
  const [loadingDiscotecas, setLoadingDiscotecas] = useState(true); // Loading state for discotecas


  
  const fetchCiudad = async (email) => {
    try {
      const res = await fetch(`/api/returnciudad/${email}`);  // Fetch user city by email
      const data = await res.json();
      setCity(data.ciudad);
    } catch (error) {
      console.error('Error fetching user city:', error);
    } finally {
      setLoadingCity(false); // Finished fetching city
    }
  };


  const fetchDiscotecas = async (email) => {
    try {
      console.log("Fetching discotecas for email:", email);
      const res = await fetch(`/api/discotecas/gestor/${email}`);
      const data = await res.json();
      if (res.ok) {
        console.log("Discotecas fetched:", data);
        // Transformar los datos para incluir la ciudad
        const discotecasTransformadas = data.map(discoteca => ({
          nombre: discoteca.nombre,
          ciudad: discoteca.ciudad,
          calificacion: discoteca.calificacion // Asegúrate de incluir la calificación
        }));
        setDiscotecasConCiudad(discotecasTransformadas);
        //setDiscotecas(data);
      } else {
        console.error("Error fetching discotecas:", data.error);
      }
    } catch (error) {
      console.error("Error fetching discotecas:", error);
    } finally {
      setLoadingDiscotecas(false);
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

  useEffect(() => {
    if (session) {
      console.log("Session detected:", session);  // Verifica si la sesión existe
      fetchDiscotecas(session.user.email)
      //fetchUsuario(session.user.email);  // Usa el email de la sesión
    } else {
      console.log("No session detected");  // Verifica si no hay sesión
    }
  }, [session]);

  
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
          <title>Nébula Admin</title>
        </Head>
        <NavBar/>
          <div className='centereddiv'> 
            <Link href="anyadirDiscoteca">     
              <StandarButton text="AÑADIR UNA DISCOTECA"/>
              </Link>
          </div>
        <h2 className="subtitulo">Mis discotecas</h2>
        <div className="box-info">
          <div className="container">
            <div className="button-container">
              <div className="fetch-section">
                {loadingDiscotecas ? (
                  <p>Loading discotecas...</p>
                ) : discotecasConCiudad.length > 0 ? (
                  <ul className="scrollable-list">
                    {discotecasConCiudad.map((discoteca) => (
                      <li key={discoteca.nombre}>
                        <RatingBoxAdmin
                          name={discoteca.nombre}
                          rating={discoteca.calificacion}
                          discoteca={discoteca.nombre}
                          city={discoteca.ciudad}
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No gestionas ninguna discoteca.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );

  }