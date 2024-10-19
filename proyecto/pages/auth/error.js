import { useRouter } from 'next/router';
import Link from 'next/link';
import NavBar from '../../components/NavBar';

export default function ErrorPage() {
  const router = useRouter();
  const { error } = router.query; // Fetch the error message from the query string

  let errorMessage = 'An error occurred during authentication.';

  // Optionally, customize error messages based on the error type
  if (error === 'CredentialsSignin') {
    errorMessage = 'Invalid email or password. Please try again.';
  }

  return (
    <>
    <NavBar/>
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Authentication Error</h1>
      <p>{errorMessage}</p>
      <Link href="/auth/signin">
        <a>Go back to Sign In</a>
      </Link>
    </div>
    </>
  );
}
