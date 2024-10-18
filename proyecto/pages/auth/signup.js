import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Signup() {
  const [correo, setCorreo] = useState('');
  const [contrase_a, setContrase_a] = useState('');
  const [Usuario, setUsuario] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Deshabilitar el botón mientras se envía la solicitud

    // Validar que los campos estén llenos
    if (!correo || !contrase_a || !Usuario || !ciudad) {
      setError('Todos los campos son obligatorios');
      setIsSubmitting(false);
      return;
    }

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo: correo,          // Email field from form input
        contrase_a: contrase_a,   // Password field from form input
        name: Usuario,          // Rename 'Usuario' to 'name' for backend
        Ciudad: ciudad,         // City field from form input
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Redirigir al usuario a la página de inicio de sesión después de registrarse
      router.push('/auth/signin');
    } else {
      // Mostrar el error si ocurrió algún problema
      setError(data.error || 'Error durante el registro');
    }
    setIsSubmitting(false); // Reactivar el botón
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Register</h1>
      <form onSubmit={handleSignup}>
        <div style={{ marginBottom: '15px' }}>
          <input
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
            type="text"
            placeholder="Nombre de Usuario"
            value={Usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
            style={{ padding: '10px', width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            placeholder="Contraseña"
            value={contrase_a}
            onChange={(e) => setContrase_a(e.target.value)}
            required
            style={{ padding: '10px', width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Ciudad"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            required
            style={{ padding: '10px', width: '100%' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={isSubmitting} style={{ padding: '10px 20px' }}>
          {isSubmitting ? 'Enviando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
}
