import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [discotecas, setDiscotecas] = useState([]);

  // Fetch discotecas from the API when the component loads
  useEffect(() => {
    const fetchDiscotecas = async () => {
      try {
        const res = await fetch('/api/discotecas'); // Fetch from the API route
        const data = await res.json();
        setDiscotecas(data); // Set the data to the state
      } catch (error) {
        console.error('Error fetching discotecas:', error);
      }
    };

    fetchDiscotecas();
  }, []);

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
          <img className="home-icon" id="pres-logo" src="/img/logo-trans.png" alt="Logo" />
        </div>
        <div id="center">
          <h1 id="main-title">NÉBULA</h1>
        </div>
        <div id="right">
          <img id="session" className="home-icon" src="/img/session.png" alt="Session" />
          <img id="ubi" className="home-icon" src="/img/ubi.png" alt="Location" />
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

        {/* Display the list of discotecas */}
        <h3>List of Discotecas</h3>
        {discotecas.length === 0 ? (
          <p>No discotecas found.</p>
        ) : (
          <ul>
            {discotecas.map((discoteca) => (
              <li key={discoteca.id}>
                <strong>{discoteca.name}</strong> owned by {discoteca.Usuario.name}.
                <p>Events:</p>
                <ul>
                  {discoteca.Evento.length === 0 ? (
                    <li>No events available</li>
                  ) : (
                    discoteca.Evento.map((evento) => (
                      <li key={evento.id}>{evento.name}</li>
                    ))
                  )}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>

    </>
  );
}

