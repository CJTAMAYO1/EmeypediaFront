import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './componentes/App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { AuthProvider } from './services/authContext.jsx';
import { registerServiceWorker, skipWaiting } from './registerServiceWorker';

// Monta la app
const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);

// Registrar el Service Worker de forma segura y manejar actualización
// registerServiceWorker internamente ya evita registrarse en modo DEV y gestiona duplicated prompts.
try {
  registerServiceWorker({
    onUpdate: (registration) => {
      // Mostrar un prompt amistoso al usuario (puedes reemplazar por un banner/Toast en tu UI)
      const wantUpdate = confirm(
        'Hay una nueva versión de Emeypedia disponible. ¿Deseas actualizar ahora?'
      );

      if (!wantUpdate) {
        console.log('[SW] El usuario pospuso la actualización.');
        return;
      }

      // Si el usuario acepta, pedimos al SW que haga skipWaiting y luego recargamos cuando se active.
      (async () => {
        try {
          // Usa la utilidad skipWaiting exportada (se encarga de postMessage al waiting worker)
          await skipWaiting(registration);

          // Escuchar el cambio de estado del waiting worker para recargar cuando esté activo.
          if (registration && registration.waiting) {
            registration.waiting.addEventListener('statechange', (e) => {
              if (e.target.state === 'activated') {
                // recarga para cargar la nueva versión
                window.location.reload();
              }
            });
          } else {
            // Fallback: recarga inmediata
            window.location.reload();
          }
        } catch (err) {
          console.error('Error al forzar actualización del SW:', err);
          window.location.reload();
        }
      })();
    },
  });
} catch (err) {
  // Nunca romper la app si algo sale mal con el registro del SW
  console.warn('Service worker registration failed or was skipped:', err);
}
