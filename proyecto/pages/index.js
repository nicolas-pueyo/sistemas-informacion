import Head from 'next/head';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import NavBar from '../components/NavBar';

export async function getServerSideProps(context) {
    const session = await getSession(context);
  
    if (session) {
      return {
        redirect: {
          destination: '/home',  // Redirect to home if session is active
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

            <div id="body">
                <Link href="/auth/signin">
                    <button className="login" role="button">Iniciar sesión</button>
                </Link>
                <Link href="/auth/signup">
                    <button className="register" role="button">Registrarse</button>
                </Link>
            
            </div>



        </>
    );
};

export default Inicio;

