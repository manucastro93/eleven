export let startTime = Date.now();

export function log(
  accion: string,
  extraData: object = {},
  customUrl?: string
) {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const tiempoEnPagina = Math.round((Date.now() - startTime) / 1000); // segundos

  fetch(`${API_URL}/log`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: customUrl || window.location.pathname,
      accion,
      referrer: document.referrer,
      tiempoEnPagina,
      extraData
    })
  }).catch((e) => console.warn('Error al registrar log', e));
}
