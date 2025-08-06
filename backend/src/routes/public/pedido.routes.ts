import { RequestHandler, Router } from 'express';
import {
  getPedidosPorIdCliente,
  cancelarPedido
} from '@/controllers/public/pedido.controller';

const router = Router();

router.get('/:clienteId', getPedidosPorIdCliente as RequestHandler);
router.patch('/:id/cancelar', cancelarPedido);

export default router;
