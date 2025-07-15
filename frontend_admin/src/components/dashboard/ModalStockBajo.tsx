import { For } from "solid-js";

type ProductoStockBajo = {
  nombre: string;
  codigo: string;
  stock: number;
};

export default function ModalStockBajo(props: {
  productos: ProductoStockBajo[];
  onClose: () => void;
}) {
  return (
    <>
      <div class="fixed inset-0 bg-black/40 z-40" onClick={props.onClose} />
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
          <div class="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
            <h2 class="text-xl font-semibold">Productos con stock bajo</h2>
            <button class="text-gray-500 hover:text-gray-700" onClick={props.onClose}>
              ✕
            </button>
          </div>

          <div class="p-4">
            <table class="w-full text-sm">
              <thead class="bg-gray-100 text-left text-gray-600">
                <tr>
                  <th class="py-2 px-3">Código</th>
                  <th class="py-2 px-3">Producto</th>
                  <th class="py-2 px-3">Stock</th>
                </tr>
              </thead>
              <tbody>
                <For each={props.productos}>
                  {(p) => (
                    <tr class="border-b last:border-none">
                      <td class="py-2 px-3">{p.codigo}</td>
                      <td class="py-2 px-3">{p.nombre}</td>
                      <td class="py-2 px-3">{p.stock}</td>
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
