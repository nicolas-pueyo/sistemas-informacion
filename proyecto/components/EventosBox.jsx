import React from 'react'


const EventoBox = ( {evento, fecha}) => {


    return (
        <>
            <div className="evento-wrapper">
                <div className="evento-left">
                    <p>{evento}</p>
                </div>
                <div className="evento-rigth">
                    <p>{fecha}</p>
                </div>
            </div>
        </>
    )
}


export default EventoBox;