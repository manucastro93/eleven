
import { Router } from 'express';
import {
  postUsuarioAdmin,
  putUsuarioAdmin,
  putDefinirPassword,
  getUsuariosAdmin,
  getUsuarioAdminPorId,
  deleteUsuarioAdmin
} from '@/controllers/usuarioAdmin.controller';

const router = Router();

router.post('/', postUsuarioAdmin);
router.put('/:id', putUsuarioAdmin);
router.put('/:id/password', putDefinirPassword);
router.get('/', getUsuariosAdmin);
router.get('/:id', getUsuarioAdminPorId);
router.delete('/:id', deleteUsuarioAdmin);

export default router;
