import { Router, RequestHandler } from "express";
import * as itemMenuPublicController from "@/controllers/public/itemMenu.controller";

const router = Router();

// Rutas públicas para ítems de menú
router.get('/:slug', itemMenuPublicController.getItemMenuPorSlug as RequestHandler);

export default router;
