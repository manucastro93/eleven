import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rutas from './routes';
import { manejarErrores } from './middlewares/manejarErrores';
import { manejarSesionAnonima } from '@/middlewares/sesionAnonima.middleware';
import path from 'path';

const app = express();

app.use(cors({
  origin: ["http://localhost:5002", "http://localhost:5001"],
  credentials: true
}));

app.use(cookieParser());
app.use(helmet());
app.use(morgan('dev'));

// 🖼️ Servir carpeta de uploads (para ver imágenes subidas)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use(manejarSesionAnonima);

// Tus rutas
app.use('/api', rutas);

// SOLO PARA /api, o lo que vos quieras
app.use('/api', express.json({ limit: '10mb', type: ['application/json'] }));
app.use('/api', express.urlencoded({ extended: true, limit: '10mb', type: ['application/x-www-form-urlencoded'] }));

app.use(manejarErrores);

export default app;
