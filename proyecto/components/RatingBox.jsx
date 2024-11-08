import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';


const RatingBox = ({ name, rating, discoteca, city }) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [currentRating, setCurrentRating] = useState(rating);

  useEffect(() => {
    setCurrentRating(rating);
  }, [rating]); // inicialmente, cambiamos el rating al que me da el usuario. luego, lo modificaremos por el nuevo calculado

  const handleCardClick = () => {
    router.push(`/discoteca/${discoteca}`);
  };

  const handleRatingClick = (e) => {
    e.stopPropagation();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

 
  const submitRating = async (star) => {
    try {
      const response = await fetch(`/api/puntuar/${discoteca}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ciudad: city,
          rating: star,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(`Puntuación enviada: ${star} estrellas`);
        setCurrentRating(data.updatedRating); // Actualiza la puntuación promedio desde la respuesta
        setShowModal(false);
      } else {
        console.error('Error al guardar la puntuación');
      }
    } catch (error) {
      console.error('Error al enviar la puntuación:', error);
    }
  };

  // Componente del modal
  const RatingModal = () => (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Puntuar {name}</h2>
        <div className="rating-options">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => submitRating(star)}>
              {star} ⭐
            </button>
          ))}
        </div>
        <button onClick={closeModal}>Cerrar</button>
      </div>
    </div>
  );

  return (
    <>
      <div className="card" onClick={handleCardClick}>
        <div className="content">
          <p className="heading">{name}</p>
          <p className="rating" onClick={handleRatingClick}>{currentRating}</p>
        </div>
      </div>
      {showModal && <RatingModal />}
    </>
  );
};

export default RatingBox;
