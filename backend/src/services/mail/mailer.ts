
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: process.env.MAIL_SECURE === 'true',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

export async function enviarMailPedidoNuevo(destinatario: string, pedidoId: number) {
  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: destinatario,
    subject: '📦 Nuevo pedido recibido',
    text: `Se ha generado un nuevo pedido con ID #${pedidoId}.`,
    html: `<p>Se ha generado un nuevo pedido con ID <strong>#${pedidoId}</strong>.</p>`
  };

  await transporter.sendMail(mailOptions);
}

export async function enviarMailEstadoActualizado(destinatario: string, pedidoId: number, nuevoEstado: string) {
  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: destinatario,
    subject: '🔄 Estado de tu pedido actualizado',
    text: `El pedido #${pedidoId} ahora está en estado: ${nuevoEstado}.`,
    html: `<p>El pedido <strong>#${pedidoId}</strong> ahora está en estado: <strong>${nuevoEstado}</strong>.</p>`
  };

  await transporter.sendMail(mailOptions);
}
