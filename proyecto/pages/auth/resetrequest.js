import { useState } from 'react';
import NavBar from '../../components/NavBar';

export default function ResetRequest() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/pw/resetrequest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const text = await res.text(); // Get raw response text

      // Try parsing the response to JSON if it's valid
      try {
        const data = JSON.parse(text);

        if (res.ok) {
          setMessage('Password reset link sent to your email.');
        } else {
          setMessage(data.error || 'Error sending password reset link.');
        }
      } catch (parseError) {
        console.error('Failed to parse response:', text);
        setMessage('Unexpected response from the server.');
      }
    } catch (error) {
      console.error('Failed to send reset request:', error);
      setMessage('Failed to send reset request.');
    }
  };

  return (
    <>
      <NavBar/>
      <div>
        <h1>Request Password Reset</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Reset Link</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </>
  );
}
