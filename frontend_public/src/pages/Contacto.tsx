import { Component, createSignal } from 'solid-js';
import { log } from '@/utils/log';

const Contacto: Component = () => {
  const [mensajeEnviado, setMensajeEnviado] = createSignal(false);

const handleSubmit = (e: Event) => {
  e.preventDefault();

  const form = e.currentTarget as HTMLFormElement | null;
  if (!form) return;

  const nombre = (form.querySelector('input[type="text"]') as HTMLInputElement)?.value;
  const email = (form.querySelector('input[type="email"]') as HTMLInputElement)?.value;
  const mensaje = (form.querySelector('textarea') as HTMLTextAreaElement)?.value;

  log("form_contacto", { nombre, email, mensaje });

  setMensajeEnviado(true);
};


  return (
    <main class="bg-[#f5f3f0] min-h-screen px-4 py-10">
      <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center">Contacto</h1>

      <section class="mb-12 max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 class="text-xl font-semibold mb-4 text-gray-800">Datos de contacto</h2>
        <ul class="space-y-2 text-gray-700">
          <li><strong>📞 Teléfono:</strong> 11-1234-5678</li>
          <li><strong>📧 Email:</strong> contacto@elevenregalos.com</li>
          <li><strong>🕘 Horarios:</strong> Lunes a Viernes de 9 a 17 hs</li>
        </ul>
      </section>

      <section class="mb-12 max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 class="text-xl font-semibold mb-4 text-gray-800">Envíanos un mensaje</h2>
        <form onSubmit={handleSubmit} class="space-y-4">
          <input type="text" required placeholder="Tu nombre" class="w-full border rounded px-4 py-2" />
          <input type="email" required placeholder="Tu email" class="w-full border rounded px-4 py-2" />
          <textarea required placeholder="Tu mensaje" class="w-full border rounded px-4 py-2 h-32 resize-none" />
          <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded transition">Enviar</button>
          {mensajeEnviado() && <p class="text-green-600 mt-2">¡Mensaje enviado!</p>}
        </form>
      </section>

      <section class="max-w-3xl mx-auto">
        <h2 class="text-xl font-semibold mb-4 text-gray-800">Dónde estamos</h2>
        <div class="rounded-xl overflow-hidden shadow">
          <iframe
            class="w-full h-64"
            src="https://www.google.com/maps/embed?pb=!1m18!..."
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </main>
  );
};

export default Contacto;
