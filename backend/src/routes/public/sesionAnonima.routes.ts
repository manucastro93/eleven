import { Router, RequestHandler } from 'express';
import {
  getSesionActual,
  postCrearSesionAnonima,
  postVincularSesion
} from '@/controllers/public/sesionAnonima.controller';

const router = Router();

router.get('/', getSesionActual as RequestHandler);
router.post('/', postCrearSesionAnonima as RequestHandler); // <-- este para crear (sin body)
router.post('/vincular', postVincularSesion as RequestHandler); // <-- este para vincular (con body.clienteId)

export default router;
