// src/registerServiceWorker.js
export async function registerServiceWorker({ onUpdate } = {}) {
  // No registrar en modo desarrollo para evitar ruido (Vite dev rebuilds)
  if (import.meta.env?.DEV) {
    console.log('[SW] modo DEV: el registro del service worker está desactivado.');
    return;
  }

  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registrado con scope:', registration.scope);

      // Helper: obtiene identificador único del worker (scriptURL)
      const getWorkerId = (worker) => worker && worker.scriptURL ? worker.scriptURL : null;

      // Si ya hay un waiting worker (posible caso al recargar)
      if (registration.waiting) {
        const id = getWorkerId(registration.waiting);
        // Llamada inicial si hay waiting
        maybeNotifyUpdate(id, registration, onUpdate);
      }

      // Evitar múltiples prompts: almacena el último workerId preguntado en sessionStorage
      const STORAGE_KEY = 'sw-last-prompted-worker';

      function maybeNotifyUpdate(workerId, registrationObj, onUpdateCb) {
        if (!workerId || !onUpdateCb) return;
        const last = sessionStorage.getItem(STORAGE_KEY);
        if (last === workerId) {
          // ya mostramos el prompt para esta versión en esta sesión
          console.debug('[SW] update ya mostrado para', workerId);
          return;
        }
        // marcar como mostrado y notificar
        sessionStorage.setItem(STORAGE_KEY, workerId);
        onUpdateCb(registrationObj);
      }

      // Observador para nuevas instalaciones
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed') {
            // Si existe controlador, esto es una actualización (no la primera instalación)
            if (navigator.serviceWorker.controller) {
              const workerId = getWorkerId(newWorker);
              maybeNotifyUpdate(workerId, registration, onUpdate);
            } else {
              console.log('[SW] contenido precacheado para uso offline.');
            }
          }
        });
      });

      // opcional: detectar cambios en el SW activado (para multi-tab)
      // si quieres, podríamos usar BroadcastChannel para notificar otras pestañas aquí.
    } catch (err) {
      console.error('Error registrando service worker:', err);
    }
  });
}

export async function skipWaiting(registration) {
  if (!registration?.waiting) return;
  registration.waiting.postMessage({ type: 'SKIP_WAITING' });
}
