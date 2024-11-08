import { signIn, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head'

export default function SignIn() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      email: correo,
      password: password,
    });

    if (!res.ok) {
      setError(res.error || 'An error occurred');
      setShowPopup(true);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      if (session.user.tipo === 'Admin') {
        router.push('/admin/admin'); // Redirige a la página de administrador
      } else {
        router.push('/home'); // Redirige a la página de usuario regular
      }
    }
  }, [session, status, router]);


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
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <input
                  name="correo"
                  type="email"
                  placeholder="Correo"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                  style={{ padding: '10px', width: '100%' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ padding: '10px', width: '100%' }}
                />
              </div>
              <button className="landing-button"type="submit" >Sign In</button>
              <div style={{ marginTop: '10px' }}>
                <Link href="/auth/signup">
                  <button className="redirect" role="button">¿Aún no tienes cuenta? Regístrate</button>
                </Link>
              </div>
              <div style={{ marginTop: '10px' }}>
                <Link href="/auth/resetrequest">
                  <button className="redirect" role="button">¿Has olvidado tu contraseña?</button>
                </Link>
              </div>
            </form>

            {showPopup && (
              <div
                style={{
                  position: 'fixed',
                  top: '20%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  padding: '20px',
                  backgroundColor: '#f8d7da',
                  color: '#721c24',
                  border: '1px solid #f5c6cb',
                  borderRadius: '8px',
                  zIndex: 1000,
                }}
              >
                <p>{error === 'Invalid email or password' ? error : 'An error occurred.'}</p>
                <button onClick={() => setShowPopup(false)}>Close</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
