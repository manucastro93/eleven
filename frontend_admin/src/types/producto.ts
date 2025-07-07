export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  activo: boolean;
  descripcion: string;
  imagenes?: {
    id: number;
    url: string;
    orden: number;
  }[];
  categoria: {
    id: number;
    nombre: string;
  } | null;
  precio: number;
  stock: number;
}
