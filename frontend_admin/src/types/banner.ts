export interface Banner {
  id: number;
  img: string;
  texto: string;
  botonTexto?: string | null;
  botonLink?: string | null;
  descripcionEstilo?: string | null;
  botonEstilo?: string | null;
  textoTop?: number;
  textoLeft?: number;
  textoWidth?: number;
  botonTop?: number;
  botonLeft?: number;
  fechaDesde: string; // YYYY-MM-DD
  fechaHasta?: string | null;
  createdAt: string;
  updatedAt: string;
}
