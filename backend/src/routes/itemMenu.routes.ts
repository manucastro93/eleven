import { Router, RequestHandler } from 'express';
import {
  listarItemsMenu,
  crearItemMenu,
  eliminarItemMenu,
  editarItemMenu,
  putOrdenItemsMenu
} from '@/controllers/itemMenu.controller';

const router = Router();

router.get('/', listarItemsMenu);
router.post('/', crearItemMenu);
router.put("/orden", putOrdenItemsMenu as RequestHandler);
router.delete('/:id', eliminarItemMenu);
router.put('/:id', editarItemMenu);


export default router;
