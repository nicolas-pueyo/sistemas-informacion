// pages/account.js
import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';

export default function Account() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn(); // Redirige a la página de inicio de sesión si no está autenticado
    }
  }, [status]);

  if (status === 'loading') {
    return <div>Loading...</div>;  // Mientras se carga la sesión
  }

  if (!session) {
    return <div>You must be logged in to access this page.</div>;  // Mensaje para no autenticados
  }

  return (
    <div>
      <h1>Welcome, {session.user.email}</h1>
      <p>This is a protected page. Only logged-in users can see this content.</p>
    </div>
  );
}
