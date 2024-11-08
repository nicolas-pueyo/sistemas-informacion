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
    return { props: {} }  
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
            <div className="gradient-background">
                <div className="container">
                    <h1 className="title">NÉBULA</h1>
                    <p className="subtitle">
                        ¡Descubre las mejores discotecas y eventos en tu ciudad!
                    </p>

                    <div className="buttons">
                        <Link href="/auth/signin">
                            <button className="landing-button">¿YA TIENES CUENTA? INICIA SESIÓN</button>
                        </Link>
                        <Link href="/auth/signup">
                            <button className="landing-button">REGÍSTRATE</button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Inicio