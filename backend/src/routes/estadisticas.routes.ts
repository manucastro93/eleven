
import { Router } from 'express';
import {
  getTopProductos,
  getTopCategorias,
  getTopClientes,
  getVentasPorLocalidad,
  getVentasPorProvincia
} from '@/controllers/estadisticas.controller';

const router = Router();

router.get('/productos', getTopProductos);
router.get('/categorias', getTopCategorias);
router.get('/clientes', getTopClientes);
router.get('/localidades', getVentasPorLocalidad);
router.get('/provincias', getVentasPorProvincia);

export default router;
