import { WhatsappVerificacion } from '@/models/WhatsappVerificacion';
import { enviarMensajeWhatsapp } from '@/services/whatsapp.service';
import dayjs from 'dayjs';
import { Op } from 'sequelize';

export async function enviarCodigoVerificacion(numero: string): Promise<void> {
  const codigo = Math.floor(100 + Math.random() * 900).toString(); // 3 dígitos
  const expiracion = dayjs().add(5, 'minutes').toDate();

  await WhatsappVerificacion.create({ numero, codigo, expiracion });

  await enviarMensajeWhatsapp(numero, 'codigo_verificacion', codigo);
}

export async function verificarCodigo(numero: string, codigo: string): Promise<boolean> {
  const intento = await WhatsappVerificacion.findOne({
    where: {
      numero,
      codigo,
      estado: 'pendiente',
      expiracion: { [Op.gt]: new Date() }
    },
    order: [['createdAt', 'DESC']]
  });

  if (!intento) return false;

  await intento.update({ estado: 'verificado' });
  return true;
}
