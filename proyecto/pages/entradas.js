import Head from 'next/head';
import  NavBar from "../components/NavBar"

//hay que pillar el nombre de usuario y hacer la querie

export default function Entradas() {
    return(
        <>
            <Head>
                <meta charSet="utf-8" />
                <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Nébula - Entradas</title>
            </Head>
            <NavBar />
            <div>

            </div>
        </>
    )
}