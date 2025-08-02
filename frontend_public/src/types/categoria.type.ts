export type Subcategoria = {
  id: number;
  nombre: string;
  slug: string;
};

export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string;
  orden: number;
  destacada: boolean;
  imagenUrl?: string | null;
  subcategorias?: Subcategoria[];
}
