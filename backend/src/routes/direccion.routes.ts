import { Router, RequestHandler } from 'express';
import { getDirecciones } from '@/controllers/direccion.controller';

const router = Router();

router.get('/', getDirecciones as RequestHandler);

export default router;