import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './componentes/App.jsx'
import Inicio from './componentes/inicio.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { Navbar } from './componentes/navabar.jsx'
import { AuthProvider } from './services/authContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Navbar/>
      <Inicio/>
    </AuthProvider>

  </StrictMode>,
)
