export function obtenerOrigenPermitido(origin?: string): string | false {
  const permitidos = process.env.PUBLIC_ORIGINS?.split(',') || [];
  const permitido = !origin || permitidos.includes(origin);
  if (!permitido) {
    console.warn(`❌ Bloqueado por CORS: ${origin}`);
  }
  return permitido ? origin || "*" : false;
}
