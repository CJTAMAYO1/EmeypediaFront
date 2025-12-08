import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

// Componentes
import Navbar from "./navabar.jsx"
import Footer from "./footer.jsx"
import Inicio from "./inicio.jsx"
import ArticuloDetalle from "./detalleArticulo.jsx"
import LoginModal from "./LoginModal.jsx"
import RegisterModal from "./RegisterModal.jsx"
import Dashboard from "./dashboard.jsx";
import SubirArticulo from "./crearArticulo.jsx"

import Contact from './contacto';
import About from './About';
import Terms from './terminosyc';


function App() {
  return (
    <Router>
      {/* Navbar siempre visible */}
      <Navbar />

      {/* Rutas principales */}
      <Routes>
        {/* Subir artículo */ }
        <Route path="/subir-articulo" element={<SubirArticulo />} />
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Página principal */}
        <Route path="/" element={<Inicio />} />

        {/* Detalle de artículo */}
        <Route path="/articulo/:id" element={<ArticuloDetalle />} />

        {/* Opcional: login y registro en rutas */}
        <Route path="/login" element={<LoginModal show={true} />} />
        <Route path="/register" element={<RegisterModal show={true} />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>

      {/* Footer siempre visible */}
      <Footer />
    </Router>
  )
}

export default App
