
import { Router } from 'express';
import { getModulos } from '@/controllers/modulo.controller';

const router = Router();

router.get('/', getModulos);

export default router;
