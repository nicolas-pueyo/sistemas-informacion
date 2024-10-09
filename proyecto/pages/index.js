import Link from 'next/link';
import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [discotecas, setDiscotecas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [ciudades, setCiudades] = useState([]);

  // Fetch discotecas from the API when the component loads
  const fetchDiscotecas = async () => {
    const res = await fetch('/api/discotecas');
    const data = await res.json();
    setDiscotecas(data);
  };

  const fetchUsuarios = async () => {
    const res = await fetch('/api/usuarios');
    const data = await res.json();
    setUsuarios(data);
  };

  const fetchCiudades = async () => {
    const res = await fetch('/api/ciudades');
    const data = await res.json();
    setCiudades(data);
  };
  

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Nébula</title>
      </Head>

      <div id="home">
      <div id="left">
                <Link href="/" className="home-icon">
                <img className="home-icon" id="pres-logo" src="/img/logo-trans.png" alt="Logo" />
                </Link>
              
            </div>
        <div id="center">
          <h1 id="main-title">NÉBULA</h1>
        </div>
        <div id="right">
          <Link href="/account" className="home-icon">
            <img id="session" className="session" src="/img/session.png" alt="Account" />
          </Link>
          <Link href="/ubi" className="home-icon">
            <img id="ubi" className="ubi" src="/img/ubi.png" alt="Location" />
          </Link>
        </div>

      </div>

      <h2 id="subtitulo">Let the show begin</h2>

      <div id="box-info">
        <p>
	Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
        </p>

        <div className="container">
          <div className="button-container">
            <div className="fetch-section">
              <button onClick={fetchDiscotecas}>Fetch Discotecas</button>
              {discotecas.length > 0 ? (
                <ul>
                  {discotecas.map(discoteca => (
                    <li key={discoteca.id}>
                      <strong>{discoteca.name}</strong>
                      <h3>Subtitle: {discoteca.id}</h3>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No discotecas found.</p>
              )}
            </div>
            
            <div className="fetch-section">
              <button onClick={fetchUsuarios}>Fetch Usuarios</button>
              {usuarios.length > 0 ? (
                <ul>
                  {usuarios.map(usuario => (
                    <li key={usuario.id}>
                      <strong>{usuario.name}</strong> - {usuario.email}
                      <h3>Subtitle: {usuario.id}</h3>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No usuarios found.</p>
              )}
            </div>
            
            <div className="fetch-section">
              <button onClick={fetchCiudades}>Fetch Ciudades</button>
              {ciudades.length > 0 ? (
                <ul>
                  {ciudades.map(ciudad => (
                    <li key={ciudad.id}>
                      <strong>{ciudad.name}</strong>
                      <h3>Subtitle: {ciudad.id}</h3>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No ciudades found.</p>
              )}
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

