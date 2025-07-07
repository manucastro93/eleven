
import { Router } from 'express';
import { getPermisos } from '@/controllers/permiso.controller';

const router = Router();

router.get('/', getPermisos);

export default router;
