import { Router } from 'express';

import productoRoutes from './productoPublic.routes';
import sesionAnonimaRoutes from './sesionAnonima.routes';
import itemMenu from './itemMenuPublic.routes';
import ubicacion from './ubicacionPublic.routes';
import clienteDuxRoutes from './clienteDuxPublic.routes';

const router = Router();

router.use('/productos', productoRoutes);
router.use('/sesion-anonima', sesionAnonimaRoutes);
router.use('/items-menu', itemMenu);
router.use('/ubicacion', ubicacion);
router.use('/clientesDux', clienteDuxRoutes);

export default router;