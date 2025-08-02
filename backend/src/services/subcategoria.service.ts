import { Subcategoria } from "@/models/Subcategoria";

export async function listarSubcategorias(categoriaId?: number) {
  return await Subcategoria.findAll({
    where: categoriaId ? { categoriaId } : undefined,
    order: [["orden", "ASC"]],
  });
}
