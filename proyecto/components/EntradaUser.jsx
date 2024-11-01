import React from 'react'


const EntradaUser = ( {entrada, evento, fecha, discoteca, ciudad, seguroDev}) => {

    const seguro = seguroDev => 
        seguroDev === true ? " Si" : " No";

    return (
        <>
            <div className="entrada-wrapper">
                <div className="entrada-left">
                    <p>{entrada}</p>
                    <p>{evento}</p>
                    <p>{fecha}</p>
                </div>
                <div className="entrada-rigth">
                    <p>{discoteca},{ciudad}</p>
                    <p>Seguro de devolución: {seguro(seguroDev)}</p>
                </div>
            </div>
        </>
    )
}


export default EntradaUser;