import { For, Show, createSignal, onMount, onCleanup } from "solid-js";
import { X, ChevronLeft, ChevronRight } from "lucide-solid";

export default function ModalGaleria(props: {
  imagenes: { codigo: string; letra: string; url: string }[];
  indexInicial: number;
  onClose: () => void;
}) {
  const [index, setIndex] = createSignal(props.indexInicial);

  const siguiente = () => {
    setIndex((prev) => (prev + 1) % props.imagenes.length);
  };

  const anterior = () => {
    setIndex((prev) => (prev - 1 + props.imagenes.length) % props.imagenes.length);
  };

  // Bloquear scroll del body mientras está abierto
  onMount(() => {
    document.body.style.overflow = "hidden";
  });

  onCleanup(() => {
    document.body.style.overflow = "";
  });

  return (
    <div class="fixed inset-0 bg-black/95 z-[9999] flex flex-col items-center justify-center">
      {/* Botón cerrar */}
      <button onClick={props.onClose} class="absolute top-4 right-4 text-white z-10">
        <X size={28} />
      </button>

      {/* Imagen principal con navegación */}
      <div class="relative w-full max-w-5xl flex items-center justify-center px-4">
        <button
          onClick={anterior}
          class="absolute left-0 text-white p-3 hover:bg-white/10 transition rounded-full"
        >
          <ChevronLeft size={32} />
        </button>

        <div>
          {
            (() => {
              const img = props.imagenes[index()];
              if (!img) return null;
              return (
                <img
                  src={img.url}
                  alt="Producto"
                  loading="lazy"
                  class="max-h-[80vh] max-w-full object-contain rounded"
                />
              );
            })()
          }
        </div>

        <button
          onClick={siguiente}
          class="absolute right-0 text-white p-3 hover:bg-white/10 transition rounded-full"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* Miniaturas */}
      <Show when={props.imagenes.length > 1}>
        <div class="mt-6 flex gap-2 overflow-x-auto max-w-full px-4 scroll-elegante">
          <For each={props.imagenes}>
            {(img, i) => (
              <div onClick={() => setIndex(i())}>
                <img
                  src={img.url}
                  alt={`Imagen ${i() + 1}`}
                  class={`h-16 aspect-square object-cover cursor-pointer rounded border-2 transition ${
                    index() === i() ? "border-white" : "border-white/30 hover:border-white/50"
                  }`}
                />
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
