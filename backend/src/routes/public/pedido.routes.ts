import { RequestHandler, Router } from 'express';
import {
  getPedidosPorIdCliente,
  cancelarPedido,
  getPedidoPorId,
  iniciarEdicionPedido,
  finalizarEdicionPedido,
  duplicarPedidoACarrito,
  confirmarEdicionPedido
} from '@/controllers/public/pedido.controller';

const router = Router();

router.get('/:pedidoId', getPedidoPorId);
router.get('/cliente/:clienteId', getPedidosPorIdCliente as RequestHandler);
router.post('/:pedidoId/duplicar', duplicarPedidoACarrito);
router.patch('/:id/cancelar', cancelarPedido);
router.patch('/:id/editar', iniciarEdicionPedido);
router.patch('/:id/finalizar-edicion', finalizarEdicionPedido);
router.put('/:id/confirmar-edicion', confirmarEdicionPedido); 

export default router;
