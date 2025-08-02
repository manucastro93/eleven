export interface ItemMenu {
  id: number;
  nombre: string;
  slug: string;
  icono?: string;
  activo: boolean;
  orden: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}
