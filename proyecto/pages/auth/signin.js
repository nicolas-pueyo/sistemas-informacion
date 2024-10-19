import { getCsrfToken } from 'next-auth/react';
import Link from 'next/link';
import NavBar from '../../components/NavBar';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';


export default function SignIn({ csrfToken }) {

  const router = useRouter();
  const {error} = router.query;
  const [showPopup, setShowPopus] = useState(false);
  
  useEffect(() => {
    if (error) {
      setShowPopus(true);
    }
  }, [error]);


  return (
    <>
    <NavBar/>
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Sign In</h1>
      <form method="post" action="/api/auth/callback/credentials">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <div style={{ marginBottom: '15px' }}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            style={{ padding: '10px', width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            style={{ padding: '10px', width: '100%' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px' }}>Sign In</button>
        <div style={{ marginTop: '10px' }}>
          <Link href="/auth/signup">
            <button className="redirect" role="button">¿Aún no tienes cuenta? Regístrate</button>
          </Link>
        </div>
      </form>
      {showPopup && (
          <div style={{
            position: 'fixed', top: '20%', left: '50%', transform: 'translate(-50%, -50%)',
            padding: '20px', backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb',
            borderRadius: '8px', zIndex: 1000
          }}>
            <p>{error === 'CredentialsSignin' ? 'Invalid email or password. Please try again.' : 'An error occurred.'}</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        )}
    </div>
    </>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
