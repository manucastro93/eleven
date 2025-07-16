import { Router } from "express";
import * as mensajeController from "@/controllers/mensajeInformativo.controller";

const router = Router();


router.get("/", mensajeController.getMensajes);
router.get("/admin", mensajeController.getMensajesAdmin);
router.post("/", mensajeController.postMensaje);
router.put("/:id", mensajeController.putMensaje);
router.delete("/:id", mensajeController.deleteMensaje);

export default router;
