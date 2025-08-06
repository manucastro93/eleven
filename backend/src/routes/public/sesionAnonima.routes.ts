import { Router, RequestHandler } from 'express';
import {
  getSesionActual,
  postCrearSesionAnonima,
  postVincularSesion
} from '@/controllers/public/sesionAnonima.controller';

const router = Router();

router.get('/', getSesionActual as RequestHandler);
router.post('/', postCrearSesionAnonima as RequestHandler);
router.post('/vincular-cliente', postVincularSesion as RequestHandler);

export default router;
