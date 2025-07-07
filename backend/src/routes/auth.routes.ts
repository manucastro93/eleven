import { Router, RequestHandler } from 'express';
import { login, refreshToken, logout } from '@/controllers/auth.controller';

const router = Router();

router.post('/login', login as RequestHandler);
router.get('/refresh', refreshToken as RequestHandler);
router.post('/logout', logout as RequestHandler);

export default router;
