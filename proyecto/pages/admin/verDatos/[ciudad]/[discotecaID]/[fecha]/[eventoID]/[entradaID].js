import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
import NavBar from '../../../../../../../components/NavBar';
import StandarButton from '../../../../../../../components/StandarButton';

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
  const EditModal = ({ newEntrada, newPrecio, newExistencias, setNewEntrada, setNewPrecio, setNewExistencias, handleChange, isSubmitting, closeModalUpdate }) => (
    <div className="modal-overlay" onClick={closeModalUpdate}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Cambiar nombre</h2>
        <form onSubmit={handleChange}>
          <div>
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Entrada"
                value={newEntrada}
                onChange={(e) => setNewEntrada(e.target.value)}
                required
                style={{ padding: '10px', width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Precio"
                value={newPrecio}
                onChange={(e) => setNewPrecio(e.target.value)}
                required
                style={{ padding: '10px', width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Existencias"
                value={newExistencias}
                onChange={(e) => setNewExistencias(e.target.value)}
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
        <h2>¿Seguro que quieres borrar la entrada?</h2>
        <button onClick={handleBorrado}>Confirmar</button>
        <button onClick={closeModalDelete}>Cancelar</button>
      </div>
    </div>
  );


export default function AddDiscoteca()  {

  const { data: clientSession, status } = useSession();

  const router = useRouter();
  const { ciudad, discotecaID, fecha, eventoID, entradaID} = router.query;

  const [entrada, setEntrada] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [newEntrada, setNewEntrada] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newPrecio, setNewPrecio] = useState('');
  const [newExistencias, setNewExistencias] = useState('');

  const fetchEntrada = async () => {


    try {
        const res = await fetch(`/api/discotecas/gestor/entrada?discoteca=${discotecaID}&ciudad=${ciudad}&fecha=${fecha}&evento=${eventoID}&entrada=${entradaID}`);
        
        if (!res.ok) throw new Error("Failed to fetch entrada");

        const data = await res.json();
      
        // Aquí muestra todos los datos recibidos
        console.log('Datos recibidos de la entrada:', data);

        setEntrada(data);
    } catch (error) {
      console.error('Error fetching entrada:', error);
    }
  };


  const handleChange = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
  
    try {
      const res = await fetch('/api/discotecas/gestor/editarEntrada', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            entrada: entrada.nombre,
            evento: entrada.evento,
            city: ciudad,
            discoteca: entrada.discoteca,
            fecha: entrada.fecha,
            newName: newEntrada,
            newPrecio: newPrecio,
            newExistencias: newExistencias,
        }),
      });
  
      if (!res.ok) {
        throw new Error('Error durante el cambio de nombre');
      } else {
        console.log("Nombre cambiado con éxito");
  
        router.push(`/admin/discoteca/${ciudad}/${discotecaID}/${fecha}/${eventoID}`);

      }
    } catch (err) {
      console.error('Error al cambiar el nombre:', err);
    }
  
    setIsSubmitting(false);
  };


  const handleBorrado = async () => {
    // Asegúrate de que 'discoteca' y 'ciudad' tengan valores correctos antes de proceder
    if (!discotecaID || !ciudad || !eventoID || !fecha || !entrada) {
      console.error('Faltan parámetros para el borrado:', { discotecaID, ciudad, eventoID, fecha, entrada });
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      console.log('Iniciando borrado de entrada:', entrada.nombre);
  
      const res = await fetch('/api/discotecas/gestor/deleteEntrada', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            entrada: entradaID,
            discoteca: discotecaID,
            city: ciudad,
            evento: eventoID,
            fecha: fecha,
        }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Error durante el borrado:', errorData.message);
        throw new Error('Error durante el borrado');
      } else {
        console.log('Entrada borrada con éxito');
        router.push(`/admin/discoteca/${ciudad}/${discotecaID}/${fecha}/${eventoID}`);

      }
    } catch (err) {
      console.error('Error al borrar la entrada:', err.message);
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
      fetchEntrada();
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
        <h2 className="subtitulo">Datos de la entrada</h2>
            <div className="box-info">
            {status === 'loading' ? (
              <p>Cargando datos de la entrada...</p>
            ) : (
              <div>
                <p><strong>Nombre:</strong> {entrada.nombre || 'No disponible'}</p>
                <p><strong>Evento:</strong> {entrada.nombre || 'No disponible'}</p>
                <p><strong>Ciudad:</strong> {entrada.ciudad || 'No disponible'}</p>
                <p><strong>Discoteca:</strong> {entrada.discoteca || 'Cargando...'}</p>
                <p><strong>Fecha:</strong> {entrada.fecha || 'Cargando...'}</p>
                <p><strong>Precio:</strong> {entrada.precio || 'Cargando...'}</p>
                <p><strong>Existencias restantes:</strong> {entrada.n_existencias || 'Cargando...'}</p>
                <p><strong>Existencias máximas:</strong> {entrada.n_max_existencias || 'Cargando...'}</p>
              </div>
            )}
                <div className="centereddiv">
                  <div className="button-container-item">
                  <StandarButton text="Editar" onClick={() => handleEdit()}/>
                  </div>
                  <div className="button-container-item">
                  <StandarButton text="Eliminar Entrada" onClick={handleDelete} />
                  </div>
                </div>
            </div>
        </div>
      </div>
      {isEditing && (
        <EditModal
          newEntrada={newEntrada}
          newPrecio={newPrecio}
          newExistencias={newExistencias}
          setNewEntrada={setNewEntrada}
          setNewPrecio={setNewPrecio}
          setNewExistencias={setNewExistencias}
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

