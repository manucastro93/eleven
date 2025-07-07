import { Router } from 'express';
import { obtenerTiemposPromedioPorEstado } from '@/controllers/estadisticasEstados.controller';

const router = Router();

router.get('/tiempos-promedio', obtenerTiemposPromedioPorEstado);

export default router;
