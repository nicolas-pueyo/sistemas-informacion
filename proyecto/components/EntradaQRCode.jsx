import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import QRCode from 'qrcode';

const EntradaQRCode = ({ usuario, discotecaId, eventoId, fecha }) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { fileName } = router.query; // Extract fileName from query parameters

  useEffect(() => {
    const generarQRCode = async () => {
      if (!fileName) {
        console.error('File name not available');
        setLoading(false);
        return;
      }

      try {
        // 1. Get the local IP address
        const resIp = await fetch('/api/get-local-ip');
        const ipData = await resIp.json();
        const pcLocalIP = ipData.localIp;

        const port = '3000'; // Adjust if your app is on another port
        const filePath = `/entradas/${fileName}`;
        const fileUrl = `http://${pcLocalIP}:${port}${filePath}`;

        // 2. Generate the QR Code
        const qrDataUrl = await QRCode.toDataURL(fileUrl);
        setQrCodeDataUrl(qrDataUrl);
      } catch (error) {
        console.error('Error generating the QR code:', error);
      } finally {
        setLoading(false);
      }
    };

    generarQRCode();
  }, [fileName]);

  if (loading) {
    return <p>Generando QR code...</p>;
  }

  return (
    <div>
      <h3>Escanea este QR para acceder a tu entrada:</h3>
      {qrCodeDataUrl ? (
        <img src={qrCodeDataUrl} alt="QR Code de entrada" />
      ) : (
        <p>Error al generar el QR code.</p>
      )}
    </div>
  );
};

export default EntradaQRCode;
