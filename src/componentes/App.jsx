import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

// Componentes
import Navbar from "./navabar.jsx"
import Footer from "./footer.jsx"
import Inicio from "./inicio.jsx"
import ArticuloDetalle from "./detalleArticulo.jsx"
import LoginModal from "./LoginModal.jsx"
import RegisterModal from "./RegisterModal.jsx"

function App() {
  return (
    <Router>
      {/* Navbar siempre visible */}
      <Navbar />

      {/* Rutas principales */}
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<Inicio />} />

        {/* Detalle de artículo */}
        <Route path="/articulo/:id" element={<ArticuloDetalle />} />

        {/* Opcional: login y registro en rutas */}
        <Route path="/login" element={<LoginModal show={true} />} />
        <Route path="/register" element={<RegisterModal show={true} />} />
      </Routes>

      {/* Footer siempre visible */}
      <Footer />
    </Router>
  )
}

export default App
