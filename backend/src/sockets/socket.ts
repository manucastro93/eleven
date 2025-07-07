
import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';

let io: Server;

export function iniciarSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', socket => {
    console.log('📡 Admin conectado a Socket.IO');

    socket.on('disconnect', () => {
      console.log('📴 Admin desconectado de Socket.IO');
    });
  });
}

export function emitirNotificacion(notificacion: any) {
  if (io) {
    io.emit('nueva-notificacion', notificacion);
  }
}
