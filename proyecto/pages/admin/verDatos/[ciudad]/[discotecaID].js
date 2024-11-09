import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
import NavBar from '../../../../components/NavBar';
import StandarButton from '../../../../components/StandarButton';

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
  const EditModal = ({ newDiscoteca, newAforo, setNewDiscoteca, setNewAforo, handleChange, isSubmitting, closeModalUpdate }) => (
    <div className="modal-overlay" onClick={closeModalUpdate}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Cambiar nombre</h2>
        <form onSubmit={handleChange}>
          <div>
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Discoteca"
                value={newDiscoteca}
                onChange={(e) => setNewDiscoteca(e.target.value)}
                required
                style={{ padding: '10px', width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Aforo"
                value={newAforo}
                onChange={(e) => setNewAforo(e.target.value)}
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
        <button onClick={closeModalUpdate}>Cerrar</button>
      </div>
    </div>
  );


  // Componente del modal
  const DeleteModal = ({handleBorrado, closeModalDelete }) => (
    <div className="modal-overlay" onClick={closeModalDelete}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>¿Seguro que quieres borrar la discoteca?</h2>
        <button onClick={handleBorrado}>Confirmar</button>
        <button onClick={closeModalDelete}>Cancelar</button>
      </div>
    </div>
  );


export default function AddDiscoteca()  {

  const { data: clientSession, status } = useSession();

  const router = useRouter();
  const { ciudad, discotecaID } = router.query;

  const [discoteca, setDiscoteca] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [newDiscoteca, setNewDiscoteca] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newAforo, setNewAforo] = useState('');

  const fetchDiscoteca = async () => {


    try {
        const res = await fetch(`/api/discotecas/gestor/discoteca?nombre=${discotecaID}&ciudad=${ciudad}`);
        
        if (!res.ok) throw new Error("Failed to fetch discoteca");

        const data = await res.json();
      
        // Aquí muestra todos los datos recibidos
        console.log('Datos recibidos de la discoteca:', data);

        setDiscoteca(data);
    } catch (error) {
      console.error('Error fetching user discoteca:', error);
    }
  };


  const handleChange = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
  
    try {
      const res = await fetch('/api/discotecas/gestor/editDiscoteca', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          discoteca: discoteca.nombre,
          city: ciudad,
          newName: newDiscoteca,
          capacity: newAforo,
        }),
      });
  
      if (!res.ok) {
        throw new Error('Error durante el cambio de nombre');
      } else {
        console.log("Nombre cambiado con éxito");
  
        router.push('/admin/admin');
      }
    } catch (err) {
      console.error('Error al cambiar el nombre:', err);
    }
  
    setIsSubmitting(false);
  };


  const handleBorrado = async () => {
    // Asegúrate de que 'discoteca' y 'ciudad' tengan valores correctos antes de proceder
    if (!discoteca || !ciudad) {
      console.error('Faltan parámetros para el borrado:', { discoteca, ciudad });
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      console.log('Iniciando borrado de discoteca:', discoteca.nombre, 'en ciudad:', ciudad);
  
      const res = await fetch('/api/discotecas/gestor/deleteDiscoteca', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          discoteca: discoteca.nombre,
          city: ciudad,
        }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Error durante el borrado:', errorData.message);
        throw new Error('Error durante el borrado');
      } else {
        console.log('Discoteca borrada con éxito');
        router.push('/admin/admin'); // Redirige después de un borrado exitoso
      }
    } catch (err) {
      console.error('Error al borrar la discoteca:', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  


  const closeModalUpdate = () => {
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const closeModalDelete = () => {
    setIsDeleting(false);
  };

  const handleDelete = () => {
    setIsDeleting(true);
  };

  useEffect(() => {

    if (status === 'authenticated') {
      fetchDiscoteca();
    } else if (status === 'unauthenticated') {
      console.log("Session unauthenticated");
    } else {
      console.log("Session is still loading");
    }
  }, [status, clientSession]);

 
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Nébula - Account</title>
      </Head>
      <NavBar />
      <div className="gradient-background">
        <div className="container">
        <h2 className="subtitulo">Datos del local</h2>
            <div className="box-info">
            {status === 'loading' ? (
              <p>Cargando datos del local...</p>
            ) : (
              <div>
                <p><strong>Nombre:</strong> {discoteca.nombre || 'No disponible'}</p>
                <p><strong>Ciudad:</strong> {discoteca.ciudad || 'No disponible'}</p>
                <p><strong>Aforo:</strong> {discoteca.aforo || 'Cargando...'}</p>
              </div>
            )}
                <div className="centereddiv">
                  <div className="button-container-item">
                  <StandarButton text="Editar" onClick={() => handleEdit()}/>
                  </div>
                  <div className="button-container-item">
                  <StandarButton text="Eliminar Discoteca" onClick={handleDelete} />
                  </div>
                </div>
            </div>
        </div>
      </div>
      {isEditing && (
        <EditModal
          newDiscoteca={newDiscoteca}
          newAforo={newAforo}
          setNewDiscoteca={setNewDiscoteca}
          setNewAforo={setNewAforo}
          handleChange={handleChange}
          isSubmitting={isSubmitting}
          closeModalUpdate={closeModalUpdate}
        />
      )}
      {isDeleting && (
        <DeleteModal
          handleBorrado={handleBorrado}
          closeModalDelete={closeModalDelete}
        />
      )}
    </>
  );
};

