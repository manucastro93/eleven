import { Router } from 'express';
import {
  getLocales,
  getLocalPorId,
  postLocal,
  putLocal
} from '@/controllers/local.controller';

const router = Router();

router.get('/', getLocales);
router.get('/:id', getLocalPorId);
router.post('/', postLocal);
router.put('/:id', putLocal);

export default router;