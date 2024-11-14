// pages/discoteca/[discotecaId]/[eventoId]/pagarEntradas.js

import { useRouter } from 'next/router';
import EntradaQRCode from '../../../../components/EntradaQRCode';
import Head from 'next/head'
import NavBar from '../../../../components/NavBar'

const PagarEntradasPage = () => {
  const router = useRouter();
  const { fileName } = router.query;

  return (
    <>
      <Head>
	      <meta charSet="utf-8" />
	      <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
	      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
	      <title>Nébula</title>
      </Head>
      <NavBar />
        <div className="gradient-background">
          <div className="container">
            <div className="pagar-entradas-container">
              <h1 className="subtitulo">Finalizar Compra</h1>
              <div className="box-info">
                <div className="centereddiv">
                  <EntradaQRCode fileName={fileName} />
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default PagarEntradasPage;
