import Head from 'next/head';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import NavBar from '../components/NavBar';


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

