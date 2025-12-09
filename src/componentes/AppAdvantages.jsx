import React from "react";
import "../css/appAdvantages.css";
import screenshot1 from "../assets/screenshot1.jpeg";
import screenshot2 from "../assets/screenshot2.jpeg";
import screenshot3 from "../assets/screenshot3.jpeg";

const AppAdvantages = () => {
  const screenshots = [screenshot1, screenshot2, screenshot3];

  return (
    <div className="app-advantages-page">
      <header className="app-advantages-header">
        <h1>Descarga nuestra App</h1>
        <p>Disfruta de EMEYPEDIA en tu smartphone con todas estas ventajas:</p>
      </header>

      <section className="advantages-section">
        <div className="advantage">
          <h2>📱 Acceso rápido</h2>
          <p>Consulta artículos, noticias y contenido exclusivo desde cualquier lugar.</p>
        </div>
        <div className="advantage">
          <h2>🔔 Notificaciones</h2>
          <p>Recibe alertas y novedades importantes directamente en tu móvil.</p>
        </div>
        <div className="advantage">
          <h2>💾 Sin conexión</h2>
          <p>Guarda artículos favoritos y léelos incluso sin internet.</p>
        </div>
      </section>

      <section className="screenshots-section">
        <h2>Capturas de pantalla</h2>
        <div className="screenshots-container">
          {screenshots.map((img, index) => (
            <div className="screenshot" key={index}>
              <img src={img} alt={`Captura ${index + 1}`} />
            </div>
          ))}
        </div>
      </section>

      <section className="download-section">
        <h2>¡Descárgala ahora!</h2>
        <p>
          <a
            href="https://mega.nz/file/FxEQASIY#be5MSuFS-FAWEs924qVJlzTB0WWZ7Ot1OfolG8tyekA"
            target="_blank"
            rel="noopener noreferrer"
            className="download-link"
          >
            Descargar App
          </a>
        </p>
      </section>
    </div>
  );
};

export default AppAdvantages;
