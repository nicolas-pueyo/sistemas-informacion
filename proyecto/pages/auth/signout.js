import { signOut } from 'next-auth/react';

export default function SignOutPage() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Sign Out</h1>
      <p>Are you sure you want to sign out?</p>
      <button onClick={() => signOut({ callbackUrl: '/' })} style={{ padding: '10px 20px' }}>
        Yes, Sign Out
      </button>
      <button onClick={() => window.history.back()} style={{ padding: '10px 20px', marginLeft: '10px' }}>
        Cancel
      </button>
    </div>
  );
}
