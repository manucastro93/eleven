import { Router } from 'express';
import { postLogSesion } from '@/controllers/public/logSesion.controller';

const router = Router();

router.post('/', postLogSesion);

export default router;
