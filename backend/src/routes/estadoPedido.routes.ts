
import { Router } from 'express';
import { getEstadosPedido } from '@/controllers/estadoPedido.controller';

const router = Router();

router.get('/', getEstadosPedido);

export default router;
