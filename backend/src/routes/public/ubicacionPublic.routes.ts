import { RequestHandler, Router } from 'express';
import {
  obtenerSugerencias,
  obtenerDetalleDireccion,
} from '@/controllers/public/ubicacion.controller';

const router = Router();

router.get('/autocomplete', obtenerSugerencias as RequestHandler);
router.get('/direccion-detalle', obtenerDetalleDireccion as RequestHandler);

export default router;
