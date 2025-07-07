import { Router, RequestHandler } from 'express';
import multer from 'multer';
import path from 'path';
import {
  getProductos,
  getProductoPorId,
  postProducto,
  putProducto,
  deleteImagenProducto,
  putOrdenImagenes,
  uploadImagenesProducto
} from '@/controllers/producto.controller';

const router = Router();

// Storage
const storage = multer.diskStorage({
  destination: function (
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    cb(null, path.join(__dirname, '../../uploads/productos'));
  },
  filename: function (
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});


const upload = multer({ storage: multer.memoryStorage() });

// RUTAS
router.get('/', getProductos);
router.get('/:id', getProductoPorId);
router.post('/', postProducto);
router.put('/:id', putProducto);

router.post('/:productoId/imagenes', upload.array('imagenes', 10), uploadImagenesProducto as RequestHandler);

router.put('/:productoId/imagenes', putOrdenImagenes);
router.delete('/imagen/:id', deleteImagenProducto);

export default router;
