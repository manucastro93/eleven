import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import {
  obtenerBanners,
  obtenerBannerPorId,
  crearBanner,
  actualizarBanner,
  eliminarBanner,
  actualizarOrdenBanners
} from '@/controllers/banner.controller';
import { registrarAuditoriaMiddleware } from '@/middlewares/registrarAuditoriaMiddleware';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/banners/');
  },
  filename: (req, file, cb) => {
    // Ejemplo: banner_1698354321.jpg
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `banner_${timestamp}${ext}`);
  }
});


const upload = multer({ storage });

router.get('/', obtenerBanners);
router.put('/orden', actualizarOrdenBanners);
router.get('/:id', obtenerBannerPorId);
router.post(
  '/',
  upload.single('imagen'),
  crearBanner,
  registrarAuditoriaMiddleware('Banner', 'crear')
);
router.put('/:id',actualizarBanner,
    registrarAuditoriaMiddleware('Banner', 'actualizar'));

router.delete('/:id', eliminarBanner,
    registrarAuditoriaMiddleware('Banner', 'eliminar'));

export default router;