import { RequestHandler, Router } from 'express';
import {
  getCarritos,
  getCarritoActivo,
  postCarrito,
  actualizarCantidadProductoCarrito,
  eliminarProductoDeCarrito,
  deleteCarrito,
  confirmarCarrito,
  agregarProductoACarrito,
  getCarritoActivoPorSesion,
  actualizarObservacioneseneral,
  getCarritoPorId
} from '@/controllers/public/carrito.controller';

const router = Router();

router.get('/', getCarritos);
router.get('/:carritoId', getCarritoPorId);
router.get('/sesion/:sesionAnonimaId/activo', getCarritoActivoPorSesion as RequestHandler);
router.get('/:clienteId/activo', getCarritoActivo);

router.post('/', postCarrito);
router.post('/:carritoId', agregarProductoACarrito);
router.post('/:carritoId/confirmar', confirmarCarrito);

router.put('/:carritoId/productos/:productoId', actualizarCantidadProductoCarrito);
router.put('/:carritoId/observaciones-general', actualizarObservacioneseneral);

router.delete('/:carritoId/producto/:productoId', eliminarProductoDeCarrito);
router.delete('/:id', deleteCarrito);

export default router;
