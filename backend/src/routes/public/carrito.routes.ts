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
  actualizarObservacionesGeneral,
  getCarritoPorId,
  finalizarEdicionCarrito,
  obtenerEstadoEdicionCarrito
} from '@/controllers/public/carrito.controller';

const router = Router();

router.get('/', getCarritos);
router.get('/sesion/:sesionAnonimaId/activo', getCarritoActivoPorSesion as RequestHandler);
router.get('/:carritoId/estado-edicion', obtenerEstadoEdicionCarrito as RequestHandler);
router.get('/:clienteId/activo', getCarritoActivo);
router.get('/:carritoId', getCarritoPorId);


router.post('/', postCarrito);
router.post('/:carritoId', agregarProductoACarrito);
router.post('/:carritoId/confirmar', confirmarCarrito);

router.patch('/:carritoId/finalizar-edicion', finalizarEdicionCarrito as RequestHandler);

router.put('/:carritoId/productos/:productoId', actualizarCantidadProductoCarrito);
router.put('/:carritoId/observaciones-general', actualizarObservacionesGeneral);

router.delete('/:carritoId/producto/:productoId', eliminarProductoDeCarrito);
router.delete('/:id', deleteCarrito);

export default router;
