export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  activo: boolean;
  descripcion: string;
  imagen: string;
  imagenes?: {
    id: number;
    url: string;
    orden: number;
  }[];
  categoria: {
    id: number;
    nombre: string;
  } | null;
  categorias: {
    id: number;
    nombre: string;
  }[];
  subcategoria: {
    id: number;
    nombre: string;
  } | null;
  precio: number;
  stock: number;
  itemsMenu?: {
    id: number;
    nombre: string;
  }[];

}
