export type LogSesionData = {
  url: string;              // Ruta actual o página
  accion: string;           // Qué acción ocurrió, ej: 'ver_producto', 'agregar_carrito'
  tiempoEnPagina?: number;  // En segundos o ms, opcional según contexto
  timestamp?: string;       // ISO string, opcional (por defecto se pone en backend)
  referrer?: string;        // De dónde viene (opcional)
  extraData?: any;          // Cualquier extra relevante (ej: id producto, valores, etc.)
};
