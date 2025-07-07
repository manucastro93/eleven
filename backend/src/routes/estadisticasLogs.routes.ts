
import { Router } from 'express';
import {
  getTerminosMasBuscados,
  getProductosMasCliqueados,
  getCategoriasMasNavegadas,
  getPaginasMasVisitadas
} from '@/controllers/estadisticasLogs.controller';

const router = Router();

router.get('/busquedas', getTerminosMasBuscados);
router.get('/clicks-producto', getProductosMasCliqueados);
router.get('/categorias', getCategoriasMasNavegadas);
router.get('/paginas', getPaginasMasVisitadas);

export default router;
