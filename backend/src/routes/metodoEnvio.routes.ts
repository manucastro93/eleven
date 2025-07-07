
import { Router } from 'express';
import { getMetodosEnvio } from '@/controllers/metodoEnvio.controller';

const router = Router();

router.get('/', getMetodosEnvio);

export default router;
