import type { Producto } from "@/types/producto";

export default function AnaliticaTab(props: { producto: Producto }) {
  return (
    <div>
      <p class="text-gray-600">Aquí se mostrará la analítica de ventas.</p>
      <p class="text-gray-500 mt-2">[TODO: gráfico de ventas]</p>
    </div>
  );
}
