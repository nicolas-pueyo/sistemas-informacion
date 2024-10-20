import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import NavBar from '../../components/NavBar';
import { signIn } from 'next-auth/react';


export default function Signup() {
  const [correo, setCorreo] = useState('');
  const [contrase_a, setContrase_a] = useState('');
  const [usuario, setUsuario] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [cities, setCities] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
  async function fetchCities() {
    try {
      const res = await fetch('/api/ciudades');
      const data = await res.json();
      setCities(Array.isArray(data) ? data : []);  // Ensure cities is always an array
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]);  // Set cities as an empty array in case of an error
    }
  }
  fetchCities();
}, []);



  const handleSignup = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); 

    const res = await signIn('credentials', {
      redirect: false,
      email: correo,
      password: contrase_a,
      username: usuario,  // Pass the username field
      city: ciudad,       // Pass the city field
      isSignup: true,
    });

    if (res.ok) {
      router.push('/home');
    } else {
      setError(res.error || 'Error during registration');
    }
    setIsSubmitting(false); // Reactivar el botón
  };

    

  return (
    <>
    <NavBar/>
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Register</h1>
      <form onSubmit={handleSignup}>
        <div>
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
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              style={{ padding: '10px', width: '100%' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="password"
              placeholder="contraseña"
              value={contrase_a}
              onChange={(e) => setContrase_a(e.target.value)}
              required
              style={{ padding: '10px', width: '100%' }}
            />
          </div>

          <select value={ciudad} onChange={(e) => setCiudad(e.target.value)} required>
            <option value="" disabled>Select city</option>
            {cities.map((city) => (
              <option key={city.nombre} value={city.nombre}>
              {city.nombre}
            </option>
            ))}
          </select>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={isSubmitting} style={{ marginTop: '10px', padding: '10px 20px' }}>
          {isSubmitting ? 'Enviando...' : 'Registrarse'}
        </button>
      </form>
      <div style={{ marginTop: '10px' }}>
          <Link href="/auth/signin">
            <button className="redirect" role="button">¿Ya tienes cuenta? Inicia sesión</button>
          </Link>
        </div>
    </div>
  </>
  );
}
