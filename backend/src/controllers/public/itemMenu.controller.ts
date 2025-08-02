import { Request, Response } from "express";
import { models } from "@/config/db";

export async function getItemMenuPorSlug(req: Request, res: Response) {
  try {
    const { slug } = req.params;

    const itemMenu = await models.ItemMenu.findOne({
      where: { slug },
      include: [
        {
          model: models.Producto,
          as: "productos",
          through: { attributes: [] },
          include: [
            { model: models.ImagenProducto, as: "imagenes", separate: true, order: [["orden", "ASC"]] },
            { model: models.Categoria, as: "categoria" },
            { model: models.Subcategoria, as: "subcategoria" },
          ],
        },
      ],
    });

    if (!itemMenu) {
      return res.status(404).json({ mensaje: "ItemMenu no encontrado" });
    }

    res.json(itemMenu);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener itemMenu", detalle: error });
  }
}
