import dotenv from 'dotenv';
import { conectarDB } from '@/config/db';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || 5000;

const iniciarServidor = async () => {
  await conectarDB();

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
};

iniciarServidor();
