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
          Hey chicos, sabían que en términos de reproducción entre hombres humanos y Pokémon hembras, 
          Vaporeon es el Pokémon más compatible para los Humanos?

          No solo porque están en el Grupo Huevo Campo, que está principalmente conformado por Mamíferos, 
          Vaporeon tiene en promedio una medida de 91.44 Cm. de altura y un peso de 28,98 Kg., esto significa 
          que son suficientemente grandes para soportar penes humanos, y con sus impresionantes Estadísticas 
          Base de PS y acceso a Armadura Ácida, puedes ser duro con ella. Debido a su biología mayoritariamente 
          compuesta de agua, no hay dudas de que una Vaporeon excitada sería increíblemente húmeda, tan húmeda 
          que podrías fácilmente tener sexo con una por horas sin lastimarte o sentir dolor.

          Ellas también pueden aprender los movimientos "Atracción", "Ojitos Tiernos", "Seducción", "Encanto" 
          y "Látigo", además de no tener pelaje para esconder pezones, así que sería increíblemente fácil 
          conseguirte una con humor. Con sus habilidades "Absorbe Agua" e "Hidratación", pueden recuperarse 
          fácilmente de la fatiga con suficiente agua.

          Ningún otro Pokémon llega a estar cerca de este nivel de compatibilidad. Además, como curiosidad, 
          si te empeñas suficiente al acabar, puedes llegar a hacer a tu Vaporeon Blanca.

          Vaporeon está literalmente hecha para el pene humano. Asombrosas Estadísticas de Defensa+Alta cantidad 
          de PS+Armadura Ácida significa que puede recibir verga todo el día, de todas las formas y tamaños, 
          y aún así venir por más.
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

