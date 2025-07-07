import { Router } from 'express';
import * as productoPublicController from '@/controllers/public/productoPublic.controller';

const router = Router();

router.get('/', productoPublicController.getProductosPublic);

export default router;
