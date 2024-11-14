import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head'
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

  // Estado para el rol seleccionado
  const [rol, setRol] = useState('User');

  useEffect(() => {
    async function fetchCities() {
      try {
        const res = await fetch('/api/ciudades');
        const data = await res.json();
        setCities(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching cities:', error);
        setCities([]);
      }
    }
    fetchCities();
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Enviar una solicitud al endpoint de registro
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: correo,
          password: contrase_a,
          username: usuario,
          city: ciudad,
          role: rol,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error durante el registro');
      }

      // Si el registro es exitoso, logueamos al usuario
      const signInRes = await signIn('credentials', {
        redirect: false,
        email: correo,
        password: contrase_a,
      });

      if (signInRes.ok) {
        if(rol == "User") {
          router.push('/home');
        }
        else {
          router.push('/admin/admin');
        }
      } else {
        setError(signInRes.error || 'Error durante el inicio de sesión');
      }
    } catch (err) {
      setError(err.message);
    }

    setIsSubmitting(false);
  };

  // Función para seleccionar el rol
  const handleRoleSelect = () => {
    setRol((prevRole) => {
      if (prevRole === "User") return "Admin";
      if (prevRole === "Admin") return "User";
      return "User"; // Si no hay nada seleccionado, establece "User" por defecto
    });
  };
  

  return (
    <>
      <Head>
      <meta charSet="utf-8" />
        <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Nébula - Registro</title>
      </Head>
      <div className="gradient-background">
        <div className="container">
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
                    placeholder="Contraseña"
                    value={contrase_a}
                    onChange={(e) => setContrase_a(e.target.value)}
                    required
                    style={{ padding: '10px', width: '100%' }}
                  />
                </div>

                <select value={ciudad} onChange={(e) => setCiudad(e.target.value)} required>
                  <option value="">Select city</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>

                {/* Botones de selección de rol */}
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                  <button
                    type="button"
                    onClick={() => handleRoleSelect()}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: rol === 'Admin' ? '#4CAF50' : '#f0f0f0',
                      color: rol === 'Admin' ? 'white' : 'black',
                      border: '1px solid #ccc',
                    }}
                  >
                    Admin
                  </button>
                </div>
              </div>

              {/* Mostrar error si existe */}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              
              {/* Botón de registro */}
              <button className="landing-button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Registrarse'}
              </button>
            </form>

            {/* Enlace para iniciar sesión si ya tiene una cuenta */}
            <div style={{ marginTop: '10px' }}>
              <Link href="/auth/signin">
                <button className="redirect" role="button">¿Ya tienes cuenta? Inicia sesión</button>
              </Link>
            </div>
          </div>
        </div>
    </>
  );
}
