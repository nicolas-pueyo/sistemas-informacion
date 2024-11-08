import React from 'react'


const EntradaUser = ( {entrada, evento, fecha, discoteca, ciudad, seguroDev, nEntradas}) => {

    const seguro = seguroDev => 
        seguroDev === true ? " Si" : " No";

    return (
        <>
            <div style={{margin: "10px"}}>
                <div className="entrada-wrapper">
                    <div className="entrada-left">
                        <p>{entrada}</p>
                        <p>{evento}</p>
                        <p>{fecha}</p>
                    </div>
                    <div className="entrada-rigth">
                        <p>{discoteca},{ciudad}</p>
                        <p>Seguro de devolución: {seguro(seguroDev)}</p>
                        <p>Número de entradas: {nEntradas}</p>
                    </div>
                </div>
            </div>
        </>
    )
}


export default EntradaUser;