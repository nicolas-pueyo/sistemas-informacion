import React from 'react'
import { useRouter } from 'next/router';

const EventoBoxAdmin = ( {evento, fecha, discoteca, city, fechaFetch}) => {

    const router = useRouter();
    const handleDatos = () => {
        router.push(`/admin/verDatos/${city}/${discoteca}/${fechaFetch}/${evento}`);
      };

    return (
        <>
            <div className="evento-wrapper">
                <div className="evento-left">
                    <p>{evento}</p>
                </div>
                <p className="heading" onClick={handleDatos}>Datos del evento</p>
                <div className="evento-rigth">
                    <p>{fecha}</p>
                </div>
            </div>
        </>
    )
}


export default EventoBoxAdmin;