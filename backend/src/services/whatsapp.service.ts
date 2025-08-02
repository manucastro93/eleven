import axios from 'axios';

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN!;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_ID!;

if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
  console.error('[❌ ENV ERROR] Token o Phone ID no definidos');
}

export async function enviarMensajeWhatsapp(numero: string, template: string, codigo: string) {
  try {
    const res = await axios.post(
      `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: numero,
        type: 'template',
        template: {
          name: template,
          language: { code: 'es' },
          components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: codigo }
          ]
        },
        {
          type: 'button',
          sub_type: 'url',
          index: 0,
          parameters: [
            {
              type: 'text',
              text: codigo
            }
          ]
        }
      ]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Mensaje enviado correctamente:', res.data);
  } catch (err: any) {
    console.error('❌ Error al enviar mensaje WhatsApp:', err.response?.data || err.message);
  }
}
