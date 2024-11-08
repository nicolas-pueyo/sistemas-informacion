import Head from 'next/head';
import { useState, useEffect } from 'react';
import { getSession, useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import NavBar from '../components/NavBar';
import StandarButton from '../components/StandarButton';

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

const Account = () => {

  const { data: clientSession, status } = useSession();

  const [userCity, setUserCity] = useState(null);

  const fetchCiudad = async (email) => {

    try {
      const res = await fetch(`/api/returnciudad/${encodeURIComponent(email)}`);

      if (!res.ok) throw new Error("Failed to fetch city");

      const data = await res.json();
      setUserCity(data);
    } catch (error) {
      console.error('Error fetching user city:', error);
    }
  };

  useEffect(() => {


    if (status === 'authenticated' && clientSession?.user?.email) {
      fetchCiudad(clientSession.user.email);
    } else if (status === 'unauthenticated') {
      console.log("Session unauthenticated");
    } else {
      console.log("Session is still loading");
    }
  }, [status, clientSession]);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Nébula - Account</title>
      </Head>

      <NavBar />

      <h2 className="subtitulo">Mis Datos de Cuenta</h2>

      <div className="box-info">
        {status === 'loading' ? (
          <p>Cargando datos de cuenta...</p>
        ) : (
          <div>
            <p><strong>Nombre:</strong> {clientSession?.user?.name || 'No disponible'}</p>
            <p><strong>Email:</strong> {clientSession?.user?.email || 'No disponible'}</p>
            <p><strong>Ciudad:</strong> {userCity?.ciudad || 'Cargando...'}</p>
          </div>
        )}

        <div className="centereddiv">
          <StandarButton text="Cerrar sesión" onClick={() => signOut({ callbackUrl: '/'})} />
        </div>
      </div>
    </>
  );
};

export default Account;
