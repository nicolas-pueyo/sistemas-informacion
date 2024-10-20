import { useState } from 'react';
import { useRouter } from 'next/router';
import NavBar from '../../components/NavBar';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;

  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/pw/resetpassword', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage('Password updated successfully.');
      router.push('/auth/signin');
    } else {
      setMessage(data.error || 'Error updating password.');
    }
  };

  return (
    <>
        <NavBar/>
        <div>
          <h1>Reset Your Password</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit">Update Password</button>
          </form>
          {message && <p>{message}</p>}
        </div>
    </>
  );
}
