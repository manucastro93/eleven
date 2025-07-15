// ✅ Carga las variables de entorno desde .env
import dotenv from 'dotenv';
dotenv.config();

// ✅ Módulos necesarios para crear servidor HTTP y WebSocket
import { createServer } from 'http';
import { Server } from 'socket.io';

// ✅ Conexión a la base de datos
import { conectarDB, sequelize } from '@/config/db';

// ✅ Tu app Express (con rutas, middlewares, etc.)
import app from './app';

// ✅ Puerto de escucha (por defecto 5000)
const PORT = process.env.PORT || 5000;

// ✅ Creamos un servidor HTTP a partir de Express
const httpServer = createServer(app);

// ✅ Inicializamos el servidor WebSocket sobre el HTTP
const io = new Server(httpServer, {
  cors: {
    origin: '*', // o especificar tu frontend: 'http://localhost:5002'
    methods: ['GET', 'POST']
  }
});

// 🟩 Variable global para almacenar el porcentaje de sincronización actual
let progresoSyncProductos = 0;

// ✅ Cada vez que un cliente se conecta al WebSocket
io.on('connection', (socket) => {
  console.log('🟢 Cliente conectado vía WebSocket:', socket.id);

  // 🔁 Si hay una sincronización en curso, le mandamos el progreso actual al cliente nuevo
  if (progresoSyncProductos > 0 && progresoSyncProductos < 100) {
    socket.emit('sync:progreso', { porcentaje: progresoSyncProductos });
  }
});

// ✅ Función para actualizar el progreso y emitirlo a todos los clientes conectados
export function setProgresoSyncProductos(p: number) {
  progresoSyncProductos = p;
  io.emit('sync:progreso', { porcentaje: p });
}

// ✅ Exportamos io por si otros módulos quieren emitir directamente
export { io };

// ✅ Iniciamos base de datos y servidor HTTP
const iniciarServidor = async () => {
  await conectarDB();
  httpServer.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  });
};

iniciarServidor();

// 🔌 Cierra el pool de Sequelize cuando se apaga el servidor (Ctrl+C)
process.on('SIGINT', async () => {
  console.log('🛑 Cerrando conexiones DB...');
  await sequelize.close();
  console.log('✅ Conexiones DB cerradas');
  process.exit(0);
});