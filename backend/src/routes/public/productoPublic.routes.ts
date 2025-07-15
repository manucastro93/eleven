import { Router, RequestHandler } from 'express';
import * as productoPublicController from '@/controllers/public/productoPublic.controller';

const router = Router();

router.get('/', productoPublicController.getProductosPublic);
router.get('/relacionados', productoPublicController.getProductosRelacionados as RequestHandler);
router.get('/slug/:slug', productoPublicController.getProductoPorSlug as RequestHandler);


export default router;
