export interface Producto {
  id: number;
  nombre: string;
  codigo: string;
  descripcion?: string;
  precio: number;
  activo: boolean;
  imagenes: ImagenProducto[];
  categorias: Categoria[];
  slug: string;
  nuevo?: boolean;
  comentarios?: string;
}

export interface ImagenProducto {
  id: number;
  url: string;
  orden: number;
  productoId?: number;
}

export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
  orden: number;
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
