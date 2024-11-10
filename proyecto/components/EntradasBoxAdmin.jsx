import React from 'react'
import { useRouter } from 'next/router';

const EventoBoxAdmin = ( {entrada, evento, fecha, discoteca, city, precio, existencias}) => {

    const router = useRouter();
    const handleDatos = () => {
        router.push(`/admin/verDatos/${city}/${discoteca}/${fecha}/${evento}/${entrada}`);
      };

    return (
        <>
            <div className="evento-wrapper">
                <div className="evento-left">
                    <p>{entrada}</p>
                </div>
                <p className="heading" onClick={handleDatos}>Datos de la entrada</p>
                <p className="heading" >{precio}€</p>
                <div className="evento-rigth">
                    <p>{existencias} existencias</p>
                </div>
            </div>
        </>
    )
}


export default EventoBoxAdmin;