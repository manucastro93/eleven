import { Request, Response } from "express";
import { listarSubcategorias } from "@/services/subcategoria.service";

export async function getSubcategorias(req: Request, res: Response) {
  try {
    const { categoriaId } = req.query;
    const subcategorias = await listarSubcategorias(categoriaId ? Number(categoriaId) : undefined);
    res.json(subcategorias);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener subcategorías", error });
  }
}
