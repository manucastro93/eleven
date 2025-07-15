// ✅ Middlewares básicos
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

// ✅ Rutas y middlewares propios
import rutas from './routes';
import { manejarErrores } from '@/middlewares/manejarErrores';
import { manejarSesionAnonima } from '@/middlewares/sesionAnonima.middleware';

const app = express();

// ✅ Configuración de CORS global (antes de todo) — necesario para recursos estáticos y API
const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    const permitidos = ["http://localhost:5001", "http://localhost:5002"];
    if (!origin || permitidos.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));


// ✅ Headers CORS manuales para archivos estáticos usados como imágenes, background-image, etc.
app.use(
  '/uploads',
  express.static(path.join(__dirname, '..', 'uploads'), {
    setHeaders: (res) => {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5001');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    },
  })
);

// ✅ Middlewares globales
app.use(cookieParser());
app.use(helmet());
app.use(morgan('dev'));

// ✅ Middleware para identificar usuarios anónimos (si aplica)
app.use(manejarSesionAnonima);

// ✅ Parsers de body para JSON y formularios SOLO para /api
app.use('/api', express.json({ limit: '10mb', type: ['application/json'] }));
app.use('/api', express.urlencoded({ extended: true, limit: '10mb', type: ['application/x-www-form-urlencoded'] }));

// ✅ Middleware para manejo de errores personalizados
app.use(manejarErrores);

// ✅ Rutas de la API
app.use('/api', rutas);

export default app;
