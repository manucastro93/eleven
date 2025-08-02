import express from "express";
import { getSubcategorias } from "@/controllers/subcategoria.controller";

const router = express.Router();

router.get("/", getSubcategorias);

export default router;
