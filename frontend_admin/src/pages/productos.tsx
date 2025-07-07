import { createSignal, Show } from "solid-js";
import AdminLayout from "@/layout/AdminLayout";
import FiltroProductos from "@/components/productos/FiltroProductos";
import TablaProductos from "@/components/productos/TablaProductos";
import ModalProducto from "@/components/productos/ModalProducto";
import type { Producto } from "@/types/producto";


type FiltroProductos = {
  search: string;
  categoriaId: number | null;
  page: number;
  orderBy: string;
  orderDir: "ASC" | "DESC";
};

export default function ProductosPage() {
  const [filtro, setFiltro] = createSignal<FiltroProductos>({
    search: "",
    categoriaId: null,
    page: 1,
    orderBy: "codigo",
    orderDir: "ASC",
  });
  const [productoModal, setProductoModal] = createSignal<Producto | null>(null);

  return (
    <AdminLayout>
      <h2 class="text-2xl font-bold mb-4">Productos</h2>

      <FiltroProductos filtro={filtro()} setFiltro={setFiltro} />

      <TablaProductos
        filtro={filtro()}
        setFiltro={setFiltro}
        onProductoClick={(prod) => setProductoModal(prod)}
      />

      <Show when={productoModal()}>
        <ModalProducto producto={productoModal()!} onClose={() => setProductoModal(null)} />
      </Show>
    </AdminLayout>
  );
}
