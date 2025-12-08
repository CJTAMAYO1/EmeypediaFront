import React from 'react';
import '../css/contactanos.css';

export default function Contact() {
    return (
    <main className="contact-container">
    <h1 className="contact-title">¿Cómo podemos ayudarte?</h1>

        <div className="contact-grid">
        {/* Columna Izquierda */}
        <section className="contact-col" aria-labelledby="subir-articulo">
          <h2 id="subir-articulo">Quiero subir un artículo</h2>
          <p>
            Si deseas contribuir con tus artículos, ponte en contacto con nuestro equipo.
            Te ayudaremos a publicarlos en nuestra plataforma.
          </p>
        </section>

        {/* Columna Centro */}
        <section className="contact-col" aria-labelledby="aqui-contactanos">
          <h2 id="aqui-contactanos">Aquí puedes contactarnos</h2>
          <p>
            Para cualquier consulta, sugerencia o problema técnico, no dudes en escribirnos.
          </p>
          <p>
            <strong>Email:</strong>{' '}
            <a href="mailto:contacto@emeyce.com">contacto@emeyce.com</a>
          </p>
        </section>

        {/* Columna Derecha */}
        <section className="contact-col" aria-labelledby="mas-sugerencias">
          <h2 id="mas-sugerencias">Más sugerencias</h2>
          <p>
            ¿Tienes ideas sobre cómo mejorar Emeyce? ¡Nos encantaría escucharlas! Comparte
            tus sugerencias para seguir creciendo juntos.
          </p>
        </section>
      </div>
    </main>
  );
}
