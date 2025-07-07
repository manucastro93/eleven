export function formatearPrecio(precio?: number | string): string {
  const num = typeof precio === "string" ? parseFloat(precio) : precio;
  if (!num && num !== 0) return ""; // undefined o null
  if (isNaN(num)) return "";
  return num.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
export const capitalizarTexto = (texto: string) =>
    texto
      .toLowerCase()
      .replace(/(^|\s)\S/g, (letra) => letra.toUpperCase());
  

export function formatearFechaCorta(fecha: string): string {
  const d = new Date(fecha);
  return d.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatearFechaHora(fecha: string): string {
  const d = new Date(fecha);
  return d.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }) + ' ' + d.toLocaleTimeString("es-AR", {
    hour: '2-digit',
    minute: '2-digit'
  });
}
