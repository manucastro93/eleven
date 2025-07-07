export interface Cliente {
  id: number;
  nombre: string;
  cuit?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  categoriaFiscal?: string;
}
