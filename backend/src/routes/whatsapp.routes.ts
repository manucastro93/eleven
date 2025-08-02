import { Router, RequestHandler } from 'express';
import * as whatsappController from '@/controllers/whatsapp.controller';

const router = Router();

router.post('/enviar-codigo', whatsappController.enviarCodigo as RequestHandler);
router.post('/validar-codigo', whatsappController.validarCodigo as RequestHandler);


export default router;
