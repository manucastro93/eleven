import { Router } from 'express';
import {
  postPedido,
  getPedidosClientePorIP,
  getPedidosPorClienteId,
  getPedidoPorId,
  putPedidoCliente,
  putCancelarPedidoCliente,
  putEstadoPedido,
  getPedidosAdmin,
  actualizarProductoPedido,
  agregarProductoAPedido,
  eliminarProductoDePedido,
  duplicarPedidoACarrito
} from '@/controllers/pedido.controller';

const router = Router();

// Crear pedido
router.post('/', postPedido);
// Consultar pedidos por IP (público)
router.get('/publico', getPedidosClientePorIP);
// Consultar pedidos de un cliente (admin)
router.get('/admin/:clienteId', getPedidosPorClienteId);
// Listado de pedidos (admin)
router.get('/', getPedidosAdmin);
// Consultar pedido por id
router.get('/:id', getPedidoPorId);
// Actualizar datos del cliente del pedido
router.put('/:id/cliente', putPedidoCliente);
// Cancelar pedido del cliente
router.put('/:id/cancelar', putCancelarPedidoCliente);
// Cambiar estado del pedido
router.put('/:id/estado', putEstadoPedido);
// Actualizar cantidad/observaciones de un producto en el pedido (solo si pendiente)
router.put('/:pedidoId/productos/:productoId', actualizarProductoPedido);
// Agregar producto al pedido (solo si pendiente)
router.post('/:pedidoId/productos', agregarProductoAPedido);
// Eliminar producto del pedido (solo si pendiente)
router.delete('/:pedidoId/productos/:productoId', eliminarProductoDePedido);
// Duplicar pedido (genera un carrito nuevo con stock/precio actualizado)
router.post('/:pedidoId/duplicar', duplicarPedidoACarrito);

export default router;
