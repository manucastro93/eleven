import { For } from "solid-js";

type CategoriaMasVendida = {
  nombre: string;
  cantidad: number;
};

export default function ModalCategoriasMasVendidas(props: {
  categorias: CategoriaMasVendida[];
  onClose: () => void;
}) {
  return (
    <>
      <div class="fixed inset-0 bg-black/40 z-40" onClick={props.onClose} />
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
          <div class="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
            <h2 class="text-xl font-semibold">Categorías más vendidas</h2>
            <button class="text-gray-500 hover:text-gray-700" onClick={props.onClose}>
              ✕
            </button>
          </div>

          <div class="p-4">
            <table class="w-full text-sm">
              <thead class="bg-gray-100 text-left text-gray-600">
                <tr>
                  <th class="py-2 px-3">Categoría</th>
                  <th class="py-2 px-3">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                <For each={props.categorias}>
                  {(cat) => (
                    <tr class="border-b last:border-none">
                      <td class="py-2 px-3">{cat.nombre}</td>
                      <td class="py-2 px-3">{cat.cantidad}</td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
