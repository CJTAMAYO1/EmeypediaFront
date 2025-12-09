// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const hmrHost = env.VITE_HMR_HOST || undefined;

  return defineConfig({
    plugins: [react()],
    server: {
      host: hmrHost ? '0.0.0.0' : undefined,
      port: 5173,
      allowedHosts: [
        // opcional: agrega hosts fijos aquí si quieres
        // "hierocratic-winterweight-kacie.ngrok-free.dev"
      ],
      hmr: hmrHost
        ? {
            protocol: 'ws',
            host: hmrHost,
            port: 5173,
            clientPort: 5173
          }
        : undefined
    },
    // PARA PREVIEW: permitir todos los hosts (útil para ngrok en desarrollo)
    // Cambia a array con hosts específicos en producción si lo deseas.
    preview: {
      allowedHosts: 'all'
    }
  });
};
