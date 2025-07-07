import { Router } from 'express';
import {
  getCarritos,
  getCarritoActivo,
  postCarrito,
  putCarrito,
  deleteProductoCarrito,
  deleteCarrito,
  confirmarCarrito
} from '@/controllers/carrito.controller';

const router = Router();

router.get('/', getCarritos);
router.get('/:clienteId/activo', getCarritoActivo);
router.post('/', postCarrito);
router.post('/:id/confirmar', confirmarCarrito);
router.put('/:id', putCarrito);
router.delete('/:id', deleteCarrito);
router.delete('/:carritoId/producto/:productoId', deleteProductoCarrito);

export default router;
