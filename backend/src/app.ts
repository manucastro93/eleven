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
import { obtenerOrigenPermitido } from '@/utils/cors.utils';

const app = express();

// ✅ Configuración de CORS global (antes de todo) — necesario para recursos estáticos y API
const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    const resultado = obtenerOrigenPermitido(origin);
    if (resultado !== false) {
      callback(null, resultado);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));


// ✅ Middleware manual para agregar headers CORS ANTES del static
app.use('/uploads', (req, res, next) => {
  const origin = req.headers.origin;
  const permitido = obtenerOrigenPermitido(origin);
  if (permitido !== false) {
    res.setHeader('Access-Control-Allow-Origin', permitido);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  next();
});

// ✅ Static sin setHeaders (porque arriba ya los seteamos)
app.use(
  '/uploads',
  express.static(path.join(__dirname, '..', 'uploads'))
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
