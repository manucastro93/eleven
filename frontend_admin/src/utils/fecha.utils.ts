export function calcularDiasDemora(fechaPedido: string | Date): number {
  const hoy = new Date();
  const fecha = new Date(fechaPedido);
  const diffMs = hoy.getTime() - fecha.getTime();
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(diffDias, 0); // nunca negativo
}
