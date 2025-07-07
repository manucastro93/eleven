import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

import { initModels } from '@/models';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME || '',
  process.env.DB_USER || '',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: Number(process.env.DB_PORT) || 3306,
    logging: false,
  }
);

// Inicializa todos los modelos y asociaciones
export const models = initModels(sequelize);

export const conectarDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('📦 Conexión a la base de datos exitosa');
  } catch (error) {
    console.error('❌ Error al conectar la base de datos:', error);
    process.exit(1);
  }
};
