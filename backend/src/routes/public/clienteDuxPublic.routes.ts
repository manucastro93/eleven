// src/routes/public/clientesDuxPublic.route.ts
import { Router, RequestHandler } from "express";
import * as clientesDuxPublicController from "@/controllers/public/clienteDuxPublic.controller";

const router = Router();

// GET /clientesDux/buscar?cuit=...
router.get('/buscar', clientesDuxPublicController.buscarClientePorCuit as RequestHandler);

export default router;
