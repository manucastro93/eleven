
import { Router } from 'express';
import { getHistorialCliente } from '@/controllers/historialCliente.controller';

const router = Router();

router.get('/:clienteId', getHistorialCliente);

export default router;
