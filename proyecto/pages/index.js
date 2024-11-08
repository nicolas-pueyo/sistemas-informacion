import Head from 'next/head';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import NavBar from '../components/NavBar';

export async function getServerSideProps(context) {
    const session = await getSession(context);

    const redirectPath = session?.user?.tipo === 'User' ? '/home' : '/admin/admin';

    if (session) {
      return {
        redirect: {
          destination: redirectPath,  // Redirect to home if session is active
          permanent: false,
        },
      };
    }
  
    return {
      props: {},  // No session, so just return empty props to render the page
    };
  }

const Inicio = () => {

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Nébula - Inicio</title>
            </Head>

            <NavBar/>

            <div className="body">
                <Link href="/auth/signin">
                    <button className="landing-button" role="button"><strong>¿YA TIENES CUENTA? INICIA SESIÓN</strong></button>
                </Link>
                <Link href="/auth/signup">
                    <button className="landing-button" role="button"><strong>REGISTRATE</strong></button>
                </Link>
            </div>
        </>
    );
};

export default Inicio;

