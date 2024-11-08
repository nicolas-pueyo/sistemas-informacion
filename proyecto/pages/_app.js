import '../styles/global.css';
import { SessionProvider } from 'next-auth/react';
import { CityProvider } from '../contexts/CityContext';


// gestionamos una sesión global wrappeando la app entera en el sesionprovider
function MyApp({ Component, pageProps: { session, ...pageProps} }) {
  return (
    <SessionProvider session={session}> 
      <CityProvider>
        <Component {...pageProps} />
      </CityProvider>
    </SessionProvider>
  ) 
}

export default MyApp;
