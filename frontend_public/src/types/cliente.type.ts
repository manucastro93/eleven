export interface ClienteFormulario {
  nombre: string;
  email: string;
  telefono?: string;
  razonSocial?: string;
  cuitOCuil: string;
  direccion: string;
  localidad: string;
  provincia: string;
}

export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  razonSocial?: string;
  cuitOCuil: string;
  direccion: string;
  localidad: string;
  provincia: string;
  latitud?: number | null;
  longitud?: number | null;
}
