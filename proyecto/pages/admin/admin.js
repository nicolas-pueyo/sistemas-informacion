import Link from 'next/link';
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

export default function Home() {
  const { userCity } = useCityContext();
  const { data: clientSession } = useSession();
  const session = clientSession;
  const [discotecasConCiudad, setDiscotecasConCiudad] = useState([]);
  const [loadingCity, setLoadingCity] = useState(true);
  const [loadingDiscotecas, setLoadingDiscotecas] = useState(true);

  const fetchCiudad = async (email) => {
    try {
      const res = await fetch(`/api/returnciudad/${email}`);
      const data = await res.json();
    } catch (error) {
      console.error('Error fetching user city:', error);
    } finally {
      setLoadingCity(false);
    }
  };

  const fetchDiscotecas = async (email) => {
    try {
      const res = await fetch(`/api/discotecas/gestor/${email}`);
      const data = await res.json();
      if (res.ok) {
        const discotecasTransformadas = data.map(discoteca => ({
          nombre: discoteca.nombre,
          ciudad: discoteca.ciudad,
          calificacion: discoteca.calificacion
        }));
        setDiscotecasConCiudad(discotecasTransformadas);
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
      fetchCiudad(session.user.email);
      fetchDiscotecas(session.user.email);
    }
  }, [session]);

  if (session?.user.tipo !== 'Admin') {
    return (
      <>
        <Head>
          <meta charSet="utf-8" />
          <title>Nébula - No Autorizado</title>
        </Head>
        <NavBar />
        <div className="container">
          <p>No tienes acceso a esta página</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>Nébula Admin</title>
      </Head>
      <NavBar />
      <div className="gradient-background">
        <div className="container">
          <div className="centereddiv">
            <Link href="/admin/anyadirDiscoteca">
              <StandarButton text="AÑADIR UNA DISCOTECA" />
            </Link>
          </div>
          <h2 className="subtitulo">Mis discotecas</h2>
          <div className="box-info">
            <div className="button-container">
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
