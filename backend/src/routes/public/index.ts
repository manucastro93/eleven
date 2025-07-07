import { Router } from 'express';

import productoRoutes from './productoPublic.routes';
import sesionAnonimaRoutes from './sesionAnonima.routes';

const router = Router();

router.use('/productos', productoRoutes);
router.use('/sesion-anonima', sesionAnonimaRoutes);

export default router;