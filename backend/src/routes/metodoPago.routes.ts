
import { Router } from 'express';
import { getMetodosPago } from '@/controllers/metodoPago.controller';

const router = Router();

router.get('/', getMetodosPago);

export default router;
