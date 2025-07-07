import { Router, RequestHandler } from "express";
import * as categoriaController from "@/controllers/categoria.controller";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.get("/", categoriaController.getCategorias);
router.get("/admin/categorias", categoriaController.getCategoriasAdmin);
router.put("/admin/categorias/orden", categoriaController.putOrdenCategorias);
router.get("/:id", categoriaController.getCategoriaPorId as RequestHandler);
router.post("/", categoriaController.postCategoria);
router.put("/:id", categoriaController.putCategoria);
router.put("/admin/categorias/:id/destacada", categoriaController.putDestacadaCategoria);
router.put(
  "/admin/categorias/:id/imagen",
  upload.single("imagen"),
  categoriaController.putImagenCategoria  as RequestHandler
);
router.delete("/:id", categoriaController.deleteCategoria);

export default router;
