// components/EntradaQRCode.js

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

const EntradaQRCode = () => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        // Fetch the local IP address from the API route
        const res = await fetch('/api/get-local-ip');
        const data = await res.json();
        const pcLocalIP = data.localIp;

        const port = '3000'; // Adjust if your app runs on a different port
        const filePath = '/entradas/entrada_usuario_discoteca_evento_fecha.pdf';

        const fileUrl = `http://${pcLocalIP}:${port}${filePath}`;

        const qrDataUrl = await QRCode.toDataURL(fileUrl);
        setQrCodeDataUrl(qrDataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      } finally {
        setLoading(false);
      }
    };

    generateQRCode();
  }, []);

  if (loading) {
    return <p>Generating QR code...</p>;
  }

  return (
    <div>
      <h3>Scan this QR code to access your entrada:</h3>
      {qrCodeDataUrl ? (
        <img src={qrCodeDataUrl} alt="Entrada QR Code" />
      ) : (
        <p>Error generating QR code.</p>
      )}
    </div>
  );
};

export default EntradaQRCode;
