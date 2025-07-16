import { Router, RequestHandler } from 'express';
import * as productoPublicController from '@/controllers/public/productoPublic.controller';

const router = Router();

// Rutas específicas primero
router.get('/relacionados', productoPublicController.getProductosRelacionados as RequestHandler);
router.get('/:codigo/imagenes', productoPublicController.getImagenesProducto as RequestHandler);
router.get('/slug/:slug', productoPublicController.getProductoPorSlug as RequestHandler);

// Ruta base al final
router.get('/', productoPublicController.getProductosPublic);


export default router;
