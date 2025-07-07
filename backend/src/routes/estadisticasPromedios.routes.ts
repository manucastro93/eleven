import { Router } from 'express';
import {
  getPromediosGenerales,
  getPromediosProducto,
  getPromediosCliente,
  getPromediosCategoria
} from '@/controllers/estadisticasPromedios.controller';

const router = Router();

router.get('/promedios-generales', getPromediosGenerales);
router.get('/promedios-producto/:id', getPromediosProducto);
router.get('/promedios-cliente/:id', getPromediosCliente);
router.get('/promedios-categoria/:id', getPromediosCategoria);

export default router;