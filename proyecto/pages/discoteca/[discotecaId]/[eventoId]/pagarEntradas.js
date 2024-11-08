// pages/discoteca/[discotecaId]/[eventoId]/pagarEntradas.js

import { useRouter } from 'next/router';
import EntradaQRCode from '../../../../components/EntradaQRCode';

const PagarEntradasPage = () => {
  const router = useRouter();
  const { fileName } = router.query;

  return (
    <div className="pagar-entradas-container">
      <h1 className="subtitulo">Finalizar Compra</h1>
      <div className="box-info">
        <p className="centereddiv">
        <EntradaQRCode fileName={fileName} />
        </p>
      </div>
    </div>
  );
};

export default PagarEntradasPage;
