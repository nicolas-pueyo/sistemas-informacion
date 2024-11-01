import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

const PagarEntradas = () => {
    const qrRef = useRef(null);

    useEffect(() => {
        if (typeof window !== "undefined" && qrRef.current) {
            QRCode.toCanvas(qrRef.current, 'http://nigga.com', function (error) {
                if (error) console.error(error);
            });
        }
    }, []);

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f0f0f0' }}>
            <canvas ref={qrRef} id="qrcode" />
        </div>
    );
};

export default PagarEntradas;
