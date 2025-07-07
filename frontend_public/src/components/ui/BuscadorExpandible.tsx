import { createSignal, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';

const sugerencias = [
  'set matero',
  'mate imperial',
  'bombilla alpaca',
  'bolso cuero',
  'caja regional',
  'regalo corporativo',
  'termo personalizado',
];

export default function BuscadorExpandible(props: { onCerrar: () => void }) {
  const [query, setQuery] = createSignal('');
  const navigate = useNavigate();
  let inputRef: HTMLInputElement | undefined;

  const buscar = (q: string) => {
    const limpio = q.trim();
    if (limpio) {
      navigate(`/productos/categoria/todos?q=${encodeURIComponent(limpio)}&page=1`);
      props.onCerrar();
    }
  };

  const onSubmit = (e: Event) => {
    e.preventDefault();
    buscar(query());
  };

  onMount(() => {
    setTimeout(() => inputRef?.focus(), 100);
  });

  return (
    <div class="fixed inset-0 bg-white z-[999] px-4 pt-4 pb-6 flex flex-col gap-4 shadow-lg">
      {/* Cerrar */}
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-lg font-semibold text-[#b8860b]">¿Qué estás buscando?</h2>
        <button
          onClick={props.onCerrar}
          class="text-sm text-gray-600 hover:text-black"
        >
          Cerrar ✕
        </button>
      </div>

      {/* Input */}
      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          type="search"
          placeholder="Buscar productos..."
          value={query()}
          onInput={(e) => setQuery(e.currentTarget.value)}
          class="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
        />
      </form>

      {/* Sugerencias */}
      <div class="mt-2">
        <p class="text-sm text-gray-500 mb-1">Términos más buscados</p>
        <ul class="space-y-1">
          {sugerencias.map((item) => (
            <li>
              <button
                type="button"
                class="w-full text-left text-sm px-3 py-2 rounded hover:bg-gray-100 text-gray-700"
                onClick={() => buscar(item)}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
