export default function Footer() {
  return (
    <footer class="bg-black text-white py-10 px-6 md:px-20 border-t border-neutral-800">
      <div class="grid md:grid-cols-4 gap-10">
        {/* Navegación */}
        <div>
          <h2 class="font-semibold text-lg mb-3">Sitio</h2>
          <ul class="space-y-2">
            <li><a href="/" class="hover:underline">Inicio</a></li>
            <li><a href="/productos" class="hover:underline">Productos</a></li>
            <li><a href="/contacto" class="hover:underline">Contacto</a></li>
          </ul>
        </div>

        {/* Dirección + Instagram */}
        <div>
          <h2 class="font-semibold text-lg mb-3 flex items-center gap-2">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/>
            </svg>
            Dirección
          </h2>
          <p class="text-sm ml-6">Sarmiento 2224, CABA</p>
          <p class="text-sm ml-6">Larrea 264, CABA</p>

          <h2 class="font-semibold text-lg mt-4 mb-1 flex items-center gap-2">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7.5 2C5.57 2 4 3.57 4 5.5v13C4 20.43 5.57 22 7.5 22h9c1.93 0 3.5-1.57 3.5-3.5v-13C20 3.57 18.43 2 16.5 2h-9zM12 17c-2.21 0-4-1.79-4-4S9.79 9 12 9s4 1.79 4 4-1.79 4-4 4z"/>
            </svg>
            Instagram
          </h2>
          <a
            href="https://www.instagram.com/elevenregalos"
            class="text-sm text-blue-400 hover:underline ml-6"
            target="_blank"
          >
            @elevenregalos
          </a>
        </div>

        {/* Teléfonos */}
        <div>
          <h2 class="font-semibold text-lg mb-3 flex items-center gap-2">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.05-.24c1.12.37 2.33.57 3.54.57a1 1 0 0 1 1 1v3.61a1 1 0 0 1-1 1c-9.39 0-17-7.61-17-17a1 1 0 0 1 1-1H5a1 1 0 0 1 1 1c0 1.21.2 2.42.57 3.54a1 1 0 0 1-.24 1.05l-2.2 2.2z"/>
            </svg>
            Teléfonos
          </h2>
          <p class="text-sm ml-6">Sarmiento: (011) 4951-2017</p>
          <p class="text-sm ml-6">Larrea: (011) 4097-9319</p>
          <p class="text-xs text-neutral-400 mt-4 italic">*Precios sujetos a modificaciones*</p>
          <p class="text-xs text-neutral-400 italic">*Stock sujeto a disponibilidad*</p>
          <p class="text-xs text-neutral-400 italic mt-2">Los precios no incluyen IVA.</p>
        </div>

        {/* Mapa */}
        <div>
          <h2 class="font-semibold text-lg mb-3">Ubicación</h2>
          <iframe
            class="w-full h-40 rounded-md shadow"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.489206024078!2d-58.39307868477091!3d-34.61771686592706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccac7b3bfe8cf%3A0xabc3fc69406c64ff!2sSarmiento%202224%2C%20C1044%20CABA!5e0!3m2!1ses!2sar!4v1686018177345"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <div class="mt-10 text-center text-sm text-neutral-500">
        Eleven Regalos © 2025 - Todos los derechos reservados
      </div>
    </footer>
  );
}
