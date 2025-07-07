import { createSignal, Show } from "solid-js";
import AdminLayout from "@/layout/AdminLayout";
import FiltroPedidos from "@/components/pedidos/FiltroPedidos";
import TablaPedidos from "@/components/pedidos/TablaPedidos";
import ModalPedido from "@/components/pedidos/ModalPedido";
import type { Pedido } from "@/types/pedido";

type FiltroPedidos = {
  search: string;
  clienteId: number | null;
  estadoId: number | null;
  page: number;
  orderBy: string;
  orderDir: "ASC" | "DESC";
};

export default function PedidosPage() {
  const [filtro, setFiltro] = createSignal<FiltroPedidos>({
    search: "",
    clienteId: null,
    estadoId: null,
    page: 1,
    orderBy: "fecha",
    orderDir: "DESC",
  });
  const [pedidoModal, setPedidoModal] = createSignal<Pedido | null>(null);

  return (
    <AdminLayout>
      <h2 class="text-2xl font-bold mb-4">Pedidos</h2>

      <FiltroPedidos filtro={filtro()} setFiltro={setFiltro} />

      <TablaPedidos
        filtro={filtro()}
        setFiltro={setFiltro}
        onPedidoClick={(pedido) => setPedidoModal(pedido)}
      />

      <Show when={pedidoModal()}>
        <ModalPedido pedido={pedidoModal()!} onClose={() => setPedidoModal(null)} />
      </Show>
    </AdminLayout>
  );
}
