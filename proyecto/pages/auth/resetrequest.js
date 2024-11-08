import { useState } from 'react';
import NavBar from '../../components/NavBar';
import Head from 'next/head'


export default function ResetRequest() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Estado para mostrar que la solicitud está en curso

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Activar el estado de carga al enviar el formulario

    try {
      const res = await fetch('/api/pw/resetrequest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const isJson = res.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await res.json() : null;

      if (res.ok) {
        setMessage('Enlace de restablecimiento de contraseña enviado a tu correo.');
      } else {
        setMessage(data?.error || 'Error al enviar el enlace de restablecimiento de contraseña.');
      }
    } catch (error) {
      console.error('Error en la solicitud de restablecimiento:', error);
      setMessage('Error en la solicitud de restablecimiento.');
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };

  return (
    <>
      <Head>
	      <meta charSet="utf-8" />
	      <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
	      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
	      <title>Nébula</title>
      </Head>
      <NavBar />
      <div className="gradient-background">
        <div className="container">
          <h1>Solicitar Restablecimiento de Contraseña</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Ingresa tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Enlace de Restablecimiento'}
            </button>
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>
    </>
  );
}
