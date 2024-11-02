// pages/discoteca/[discotecaId]/[eventoId]/pagarEntradas.js

import { useRouter } from 'next/router';
import EntradaQRCode from '../../../../components/EntradaQRCode';

const PagarEntradasPage = () => {
  const router = useRouter();
  const { fileName } = router.query;

  return (
    <div>
      <h1>Finalizar Compra</h1>
      {/* Pass the fileName to EntradaQRCode */}
      <EntradaQRCode fileName={fileName} />
    </div>
  );
};

export default PagarEntradasPage;
