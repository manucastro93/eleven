
import { Router } from 'express';
import {
  getNotificaciones,
  postNotificacion,
  putMarcarLeida
} from '@/controllers/notificacion.controller';

const router = Router();

router.get('/', getNotificaciones);
router.post('/', postNotificacion);
router.put('/:id/leida', putMarcarLeida);

export default router;
