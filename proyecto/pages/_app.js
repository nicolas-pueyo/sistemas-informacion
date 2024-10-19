import '../styles/global.css';
import { SessionProvider } from 'next-auth/react';

// gestionamos una sesión global wrappeando la app entera en el sesionprovider
function MyApp({ Component, pageProps: { session, ...pageProps} }) {
  return (
    <SessionProvider session={session}> 
      <Component {...pageProps} />;
    </SessionProvider>
  ) 
}

export default MyApp;
