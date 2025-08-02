import { createEffect } from 'solid-js';
import { useCarrito } from '@/store/carrito';
import Paso1Resumen from './Paso1Resumen';
import FormPaso2 from './FormularioCheckout/FormPaso2';

export default function CarritoDesplegable() {
  const {
    mostrarCarrito,
    setMostrarCarrito,
    pasoCarrito,
  } = useCarrito();

  createEffect(() => {
    if (mostrarCarrito()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  return (
    <>
      {/* Fondo oscuro */}
      <div
        class="fixed inset-0 bg-black/80 z-[998] transition-opacity duration-300"
        classList={{
          'opacity-100 pointer-events-auto': mostrarCarrito(),
          'opacity-0 pointer-events-none': !mostrarCarrito(),
        }}
        onClick={() => setMostrarCarrito(false)}
      />

      {/* Carrito */}
      <div
        class="fixed inset-x-0 top-0 md:top-20 md:right-4 md:inset-x-auto z-[999] transition-all duration-300 px-2 md:px-0"
        classList={{
          'translate-y-0 opacity-100 pointer-events-auto': mostrarCarrito(),
          '-translate-y-10 opacity-0 pointer-events-none': !mostrarCarrito(),
        }}
      >
        <div class="bg-white rounded-none md:rounded-2xl shadow-2xl overflow-hidden border border-gray-200 max-h-[90vh] flex flex-col w-full md:w-[35rem] mx-auto">
          <div class="flex justify-between items-center p-4 border-b text-gray-800 font-semibold">
            <span class="text-2xl font-semibold">{pasoCarrito() === 1 ? '🛒 Tu carrito' : '📦 Tus datos'}</span>
            <button
              onClick={() => setMostrarCarrito(false)}
              class="text-gray-400 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>

          <div class="p-4 overflow-auto flex-1">
            {pasoCarrito() === 1 ? <Paso1Resumen /> : <FormPaso2 />}
          </div>
        </div>
      </div>
    </>
  );
}
