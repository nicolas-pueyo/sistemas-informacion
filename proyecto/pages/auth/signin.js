import { getCsrfToken } from 'next-auth/react';

export default function SignIn({ csrfToken }) {
  return (
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
      </form>
    </div>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
