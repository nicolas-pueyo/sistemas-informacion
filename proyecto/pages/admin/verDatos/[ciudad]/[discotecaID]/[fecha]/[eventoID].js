import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
import NavBar from '../../../../../../components/NavBar';
import StandarButton from '../../../../../../components/StandarButton';

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
  const EditModal = ({ newEvento, newFecha, setNewEvento, setNewFecha, handleChange, isSubmitting, closeModalUpdate }) => (
    <div className="modal-overlay" onClick={closeModalUpdate}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Cambiar nombre</h2>
        <form onSubmit={handleChange}>
          <div>
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Evento"
                value={newEvento}
                onChange={(e) => setNewEvento(e.target.value)}
                required
                style={{ padding: '10px', width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <input
                type="date"
                placeholder="Fecha YYYY-MM-DD"
                value={newFecha}
                onChange={(e) => setNewFecha(e.target.value)}
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
        <h2>¿Seguro que quieres borrar el evento?</h2>
        <button onClick={handleBorrado}>Confirmar</button>
        <button onClick={closeModalDelete}>Cancelar</button>
      </div>
    </div>
  );


export default function AddDiscoteca()  {

  const { data: clientSession, status } = useSession();

  const router = useRouter();
  const { ciudad, discotecaID, fecha, eventoID, } = router.query;

  const [evento, setEvento] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [newEvento, setNewEvento] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newFecha, setNewFecha] = useState('');

  const fetchEvento = async () => {


    try {
        const res = await fetch(`/api/discotecas/gestor/evento?discoteca=${discotecaID}&ciudad=${ciudad}&fecha=${fecha}&evento=${eventoID}`);
        
        if (!res.ok) throw new Error("Failed to fetch evento");

        const data = await res.json();
      
        // Aquí muestra todos los datos recibidos
        console.log('Datos recibidos del evento:', data);

        setEvento(data);
    } catch (error) {
      console.error('Error fetching user event:', error);
    }
  };


  const handleChange = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Convertir la fecha a formato ISO-8601
    const fechaISO = new Date(newFecha).toISOString();
    console.log("Fecha después de convertir a ISO:", fechaISO);
  
  
    try {
      const res = await fetch('/api/discotecas/gestor/editarEvento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          evento: evento.nombre,
          city: ciudad,
          discoteca: evento.discoteca,
          fecha: evento.fecha,
          newName: newEvento,
          newFecha: fechaISO,
        }),
      });
  
      if (!res.ok) {
        throw new Error('Error durante el cambio de nombre');
      } else {
        console.log("Nombre cambiado con éxito");
  
        router.push(`/admin/discoteca/${ciudad}/${discotecaID}`);

      }
    } catch (err) {
      console.error('Error al cambiar el nombre:', err);
    }
  
    setIsSubmitting(false);
  };


  const handleBorrado = async () => {
    // Asegúrate de que 'discoteca' y 'ciudad' tengan valores correctos antes de proceder
    if (!discotecaID || !ciudad || !evento || !fecha) {
      console.error('Faltan parámetros para el borrado:', { discotecaID, ciudad, evento, fecha });
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      console.log('Iniciando borrado de evento:', evento.nombre);
  
      const res = await fetch('/api/discotecas/gestor/deleteEvento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          discoteca: discotecaID,
          city: ciudad,
          evento: evento.nombre,
          fecha: fecha,
        }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Error durante el borrado:', errorData.message);
        throw new Error('Error durante el borrado');
      } else {
        console.log('Evento borrado con éxito');
        router.push(`/admin/discoteca/${ciudad}/${discotecaID}`);

      }
    } catch (err) {
      console.error('Error al borrar el evento:', err.message);
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
      fetchEvento();
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
        <h2 className="subtitulo">Datos del evento</h2>
            <div className="box-info">
            {status === 'loading' ? (
              <p>Cargando datos del evento...</p>
            ) : (
              <div>
                <p><strong>Nombre:</strong> {evento.nombre || 'No disponible'}</p>
                <p><strong>Ciudad:</strong> {evento.ciudad || 'No disponible'}</p>
                <p><strong>Discoteca:</strong> {evento.discoteca || 'Cargando...'}</p>
                <p><strong>Fecha:</strong> {evento.fecha || 'Cargando...'}</p>
              </div>
            )}
                <div className="centereddiv">
                  <div className="button-container-item">
                  <StandarButton text="Editar" onClick={() => handleEdit()}/>
                  </div>
                  <div className="button-container-item">
                  <StandarButton text="Eliminar Evento" onClick={handleDelete} />
                  </div>
                </div>
            </div>
        </div>
      </div>
      {isEditing && (
        <EditModal
          newEvento={newEvento}
          newFecha={newFecha}
          setNewEvento={setNewEvento}
          setNewFecha={setNewFecha}
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

