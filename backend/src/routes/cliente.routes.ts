import { Router, RequestHandler } from 'express';
import {
  getClientes,
  getClientePorId,
  putClienteDesdeAdmin,
  getClientePorCuit,
  postCliente
} from '@/controllers/cliente.controller';
import { registrarAuditoriaMiddleware } from '@/middlewares/registrarAuditoriaMiddleware';

const router = Router();

router.post('/', postCliente);
router.get('/cuit/:cuitOCuil', getClientePorCuit as RequestHandler);

router.get('/', getClientes);
router.get('/:id', getClientePorId as RequestHandler);
router.put('/:id',registrarAuditoriaMiddleware('Cliente', 'actualizar'),putClienteDesdeAdmin);

export default router;
