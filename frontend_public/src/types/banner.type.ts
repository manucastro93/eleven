// src/types/banner.type.ts
export type Banner = {
  id: number;
  img: string;
  texto: string;
  botonTexto: string;
  botonLink: string;
  descripcionEstilo: string;
  botonEstilo: string;
  textoTop: number;
  textoLeft: number;
  textoWidth: number;
  botonTop: number;
  botonLeft: number;
  fechaDesde: string; // formato ISO date
  fechaHasta: string; // puede venir "0000-00-00"
  orden: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
