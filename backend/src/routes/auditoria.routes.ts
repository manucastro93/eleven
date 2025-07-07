
import { Router } from 'express';
import { getAuditorias } from '@/controllers/auditoria.controller';

const router = Router();

router.get('/', getAuditorias);

export default router;
