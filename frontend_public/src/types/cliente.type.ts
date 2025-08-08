export interface ClienteFormulario {
  id?: number;
  nombre: string;
  email: string;
  telefono?: string;
  razonSocial?: string;
  cuitOCuil: string;
  categoriaFiscal: string;
  direccion: string;
  localidad: string;
  provincia: string;
  codigoPostal?: string;
  transporte?: string;
  clienteDuxId: number;
  formaPago: string;
  formaEnvio: string;
  whatsappVerificado?: boolean;
}

export interface Cliente {
  id?: number;
  nombre: string;
  email: string;
  telefono?: string;
  razonSocial?: string;
  cuitOCuil: string;
  categoriaFiscal: string;
  direccion: string;
  localidad: string;
  provincia: string;
  codigoPostal?: string;
  clienteDuxId: number;
  latitud?: number | null;
  longitud?: number | null;
  transporte?: string;
  formaPago?: string;
  formaEnvio?: string;
}
