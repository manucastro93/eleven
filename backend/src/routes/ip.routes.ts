import { Router } from 'express';
import { getIPs } from '@/controllers/ip.controller';

const router = Router();
router.get('/', getIPs);
export default router;