import { Router } from 'express';
import { postLogSesion } from '@/controllers/logSesion.controller';

const router = Router();

router.post('/log', postLogSesion);

export default router;
