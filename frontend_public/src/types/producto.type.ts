import { Subcategoria, Categoria } from "./categoria.type";
import { ItemMenu } from "./itemMenu.type";

export interface Producto {
  id: number;
  nombre: string;
  codigo: string;
  descripcion?: string;
  precio: number;
  activo: boolean;
  imagen: string;
  imagenes: ImagenProducto[];
  categorias: Categoria[];
  categoria: Categoria;
  subcategoria: Subcategoria;
  slug: string;
  nuevo?: boolean;
  itemsMenu?: ItemMenu[];

}

export interface ImagenProducto {
  id: number;
  url: string;
  orden: number;
  productoId?: number;
}

export interface ProductosState {
  filtros: {
    categoria?: string;
    orden: string;
    busqueda: string;
  };
  productos: Producto[];
  paginaActual: number;
  scrollY: number;
}
