import React from "react";
import "../css/quienes_somos.css";
import logo from "../assets/Emeyce_SS_LOGO.png";

 const About = () => {
  return (
    <div className="quienes-container">
      <h1 className="quienes-title">¿Quiénes somos?</h1>

      <div className="quienes-grid">
        {/* Columna Izquierda */}
        <div className="quienes-texto">
          <p>
            Emeyce Software Solutions es una micro-empresa creada por los jóvenes aventureros
            Carlo Tamayo y Jesús Trinidad, una empresa dedicada a la creación, distribución 
            y mantenimiento de soluciones de software innovadoras.
          </p>
          <p>
            Trabajamos con valores de calidad, innovación y cercanía, desarrollando proyectos
            a medida y contribuyendo al mundo digital con nuestras soluciones.
          </p>
        </div>

        {/* Columna Derecha */}
        <div className="quienes-logo">
          <img src={logo} 
          alt="Emeyce Logo" 
          style={{ width: "350px", height: "auto" }} />
        </div>
      </div>
    </div>
  );
};

export default About;
