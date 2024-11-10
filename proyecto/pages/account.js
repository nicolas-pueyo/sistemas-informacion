import Head from 'next/head';
import { useState, useEffect } from 'react';
import { getSession, useSession, update } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import NavBar from '../components/NavBar';
import StandarButton from '../components/StandarButton';


export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

  // Componente del modal
  const EditModal = ({ usuario, setUsuario, handleNameChange, isSubmitting, closeModal }) => (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Cambiar nombre</h2>
        <form onSubmit={handleNameChange}>
          <div>
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
          </div>
          
          {/* Botón de confirmación */}
          <button className="landing-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? '...' : 'Confirmar cambios'}
          </button>
        </form>
        <button onClick={closeModal}>Cerrar</button>
      </div>
    </div>
  );

const Account = () => {

  const { data: clientSession, status } = useSession();

  const [userCity, setUserCity] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCiudad = async (email) => {

    try {
      const res = await fetch(`/api/returnciudad/${encodeURIComponent(email)}`);

      if (!res.ok) throw new Error("Failed to fetch city");

      const data = await res.json();
      setUserCity(data);
    } catch (error) {
      console.error('Error fetching user city:', error);
    }
  };

  useEffect(() => {


    if (status === 'authenticated' && clientSession?.user?.email) {
      fetchCiudad(clientSession.user.email);
    } else if (status === 'unauthenticated') {
      console.log("Session unauthenticated");
    } else {
      console.log("Session is still loading");
    }
  }, [status, clientSession]);



  const handleNameChange = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const res = await fetch('/api/changeName', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!res.ok) {
        throw new Error('Error durante el cambio de nombre');
      } else {
        console.log("Nombre cambiado con éxito");
  
        // Forzar la actualización de la sesión
        const updatedSession = await getSession();
        console.log('Sesión actualizada:', updatedSession);
  
        signOut({ callbackUrl: '/' });
      }
    } catch (err) {
      console.error('Error al cambiar el nombre:', err);
    }
  
    setIsSubmitting(false);
  };
  

  const closeModal = () => {
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };




  return (
    <>
      <Head>
        <title>Nébula - Account</title>
      </Head>
      <NavBar />
      <div className="gradient-background">
        <div className="container">
          <h2 className="subtitulo">Mis Datos de Cuenta</h2>
          <div className="box-info">
            {status === 'loading' ? (
              <p>Cargando datos de cuenta...</p>
            ) : (
              <div>
                <p><strong>Nombre:</strong> {clientSession?.user?.name || 'No disponible'}</p>
                <p><strong>Email:</strong> {clientSession?.user?.email || 'No disponible'}</p>
                <p><strong>Ciudad:</strong> {userCity?.ciudad || 'Cargando...'}</p>
              </div>
            )}

            <div className="centereddiv">
              <StandarButton text="Cambiar nombre de la cuenta" onClick={handleEdit} />
              <StandarButton text="Cerrar sesión" onClick={() => signOut({ callbackUrl: '/' })} />
            </div>
          </div>
        </div>
      </div>
      {isEditing && (
        <EditModal
          usuario={usuario}
          setUsuario={setUsuario}
          handleNameChange={handleNameChange}
          isSubmitting={isSubmitting}
          closeModal={closeModal}
        />
      )}
    </>
  );
};

export default Account;
