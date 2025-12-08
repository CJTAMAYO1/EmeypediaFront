import React from 'react';
import '../css/terminosyc.css';

const Terms = () => {
  return (
    <main className="terminos-container">
      <h1 className="terminos-title">Términos y condiciones</h1>
      <p className="terminos-intro">
        Bienvenido a Emeypedia, el sitio wiki de Emeyce Software Solutions. Al usar este sitio, aceptas los
        siguientes términos:
      </p>

      <div className="terminos-grid">
        <section className="termino-bloque" aria-labelledby="contenido-permitido">
          <h2 id="contenido-permitido">1. Contenido permitido</h2>
          <ul>
            <li>Los artículos deben ser respetuosos y adecuados para todo público.</li>
            <li>No se permite contenido ofensivo, violento, sexual explícito, discriminatorio o dañino.</li>
          </ul>
        </section>

        <section className="termino-bloque" aria-labelledby="participacion-usuarios">
          <h2 id="participacion-usuarios">2. Participación de usuarios</h2>
          <ul>
            <li>
              Las personas externas pueden postular artículos, pero estarán sujetos a revisión y aprobación de
              nuestros moderadores.
            </li>
            <li>
              Nos reservamos el derecho de rechazar, editar o eliminar cualquier contenido que consideremos
              inapropiado.
            </li>
          </ul>
        </section>

        <section className="termino-bloque" aria-labelledby="uso-plataforma">
          <h2 id="uso-plataforma">3. Uso adecuado de la plataforma</h2>
          <ul>
            <li>
              Está prohibido intentar dañar, hackear, interrumpir o sobrecargar el funcionamiento de Emeypedia.
            </li>
            <li>
              No se permiten comentarios ofensivos ni acciones que puedan herir, intimidar o acosar a otros usuarios.
            </li>
          </ul>
        </section>

        <section className="termino-bloque" aria-labelledby="propiedad-intelectual">
          <h2 id="propiedad-intelectual">4. Propiedad intelectual y Modificaciones</h2>
          <ul>
            <li>
              El contenido publicado en Emeypedia pertenece a sus autores, pero al publicarlo, otorgas permiso para
              que Emeypedia lo muestre y lo distribuya dentro de la plataforma.
            </li>
            <li>
              Emeyce Software Solutions puede modificar estos Términos y Condiciones en cualquier momento. Te recomendamos
              revisarlos periódicamente.
            </li>
          </ul>
        </section>
      </div>

      <p className="terminos-intro" style={{ marginTop: 24 }}>
        <strong>Si no estás de acuerdo con estos términos, por favor no utilices Emeypedia.</strong>
      </p>
    </main>
  );
};

export default Terms;
