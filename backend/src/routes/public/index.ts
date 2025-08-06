import { Router } from 'express';

import productoRoutes from './productoPublic.routes';
import sesionAnonimaRoutes from './sesionAnonima.routes';
import itemMenu from './itemMenuPublic.routes';
import ubicacion from './ubicacionPublic.routes';
import clienteDuxRoutes from './clienteDuxPublic.routes';
import logSesionRoutes from './logSesion.routes';
import carritoRoutes from './carrito.routes';
import pedidoRoutes from './pedido.routes';

const router = Router();

router.use('/carritos', carritoRoutes);
router.use('/productos', productoRoutes);
router.use('/sesion-anonima', sesionAnonimaRoutes);
router.use('/items-menu', itemMenu);
router.use('/ubicacion', ubicacion);
router.use('/clientesDux', clienteDuxRoutes);
router.use('/logs-sesion', logSesionRoutes);
router.use('/pedidos', pedidoRoutes);

export default router;