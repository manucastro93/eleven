// src/pages/Info.tsx
export default function InfoPage() {
  return (
    <div class="bg-white px-4 py-10 max-w-3xl mx-auto text-gray-800">
      <h1 class="text-2xl font-bold mb-6">ℹ️ Información General</h1>

      <section class="mb-8">
        <h2 class="text-lg font-semibold mb-2">🛒 ¿Cómo comprar?</h2>
        <p class="text-sm leading-relaxed">
          Elegí los productos que te interesan y agregalos al carrito. Cuando termines,
          hacé clic en el ícono del carrito (arriba a la derecha) y completá tus datos.
          Te vamos a contactar por WhatsApp para coordinar el pedido.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-lg font-semibold mb-2">📞 Contacto</h2>
        <ul class="text-sm space-y-1">
          <li>📱 WhatsApp: <a class="text-blue-600 underline" href="https://wa.me/5491122334455" target="_blank">+54 9 11 2233-4455</a></li>
          <li>📧 Email: <a class="text-blue-600 underline" href="mailto:info@elevenregalos.com">info@elevenregalos.com</a></li>
          <li>📍 Localidad: Buenos Aires, Argentina</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-lg font-semibold mb-2">💳 Medios de pago</h2>
        <p class="text-sm leading-relaxed">
          Aceptamos transferencias bancarias, MercadoPago y pagos en efectivo al retirar.
          Consultanos si necesitás factura A o B.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-lg font-semibold mb-2">🚚 Envíos</h2>
        <p class="text-sm leading-relaxed">
          xxxxxxxxxx.
          También podés retirar por nuestro local.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-2">🕐 Horarios de atención</h2>
        <p class="text-sm leading-relaxed">
          Lunes a Viernes de 9:00 a 18:00 hs. <br />
          Sábados de 9:00 a 13:00 hs.
        </p>
      </section>
    </div>
  );
}
