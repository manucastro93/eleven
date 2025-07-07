
import { Router } from 'express';
import { getRolesUsuario } from '@/controllers/rolUsuario.controller';

const router = Router();

router.get('/', getRolesUsuario);

export default router;
