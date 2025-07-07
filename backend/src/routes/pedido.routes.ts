import { Router } from 'express';
import {
  postPedido,
  getPedidosClientePorIP,
  getPedidosPorClienteId,
  getPedidoPorId,
  putPedidoCliente,
  putCancelarPedidoCliente,
  putEstadoPedido,
  getPedidosAdmin
} from '@/controllers/pedido.controller';

const router = Router();

router.post('/', postPedido);
router.get('/publico', getPedidosClientePorIP);
router.get('/admin/:clienteId', getPedidosPorClienteId);
router.get('/', getPedidosAdmin);
router.get('/:id', getPedidoPorId);
router.put('/:id/cliente', putPedidoCliente);
router.put('/:id/cancelar', putCancelarPedidoCliente);
router.put('/:id/estado', putEstadoPedido);

export default router;