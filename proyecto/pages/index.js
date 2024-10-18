import Head from 'next/head';
import { useState, useEffect } from 'react';
import Link from 'next/link';


const Inicio = () => {

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Nébula - Inicio</title>
            </Head>

            <div id="home">
                <div id="left">
                    <Link href="/" className="home-icon">
                        <img className="home-icon" id="pres-logo" src="/img/logo-trans.png" alt="Logo" />
                    </Link>
                </div>
                <div id="center">
                    <h1 id="main-title">NÉBULA</h1>
                </div>
                <div id="middle">
                    <img id="banner-image" src="/img/banner_disco.jpg" alt="Banner" />
                </div>
                <div id="right">
                </div>
            </div>

            <div id="body">
            <button className="login" role="button">Iniciar sesión</button>
            <button className="register" role="button">Registrarse</button>
            </div>



        </>
    );
};

export default Inicio;

