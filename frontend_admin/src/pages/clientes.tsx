import { createSignal, Show } from "solid-js";
import AdminLayout from "@/layout/AdminLayout";
import FiltroClientes from "@/components/clientes/FiltroClientes";
import TablaClientes from "@/components/clientes/TablaClientes";
import ModalCliente from "@/components/clientes/ModalCliente";
import type { Cliente } from "@/types/cliente";

type FiltroClientes = {
  search: string;
  page: number;
  orderBy: string;
  orderDir: "ASC" | "DESC";
};

export default function ClientesPage() {
  const [filtro, setFiltro] = createSignal<FiltroClientes>({
    search: "",
    page: 1,
    orderBy: "nombre",
    orderDir: "ASC",
  });
  const [clienteModal, setClienteModal] = createSignal<Cliente | null>(null);

  return (
    <AdminLayout>
      <h2 class="text-2xl font-bold mb-4">Clientes</h2>

      <FiltroClientes filtro={filtro()} setFiltro={setFiltro} />

      <TablaClientes
        filtro={filtro()}
        setFiltro={setFiltro}
        onClienteClick={(cli) => setClienteModal(cli)}
      />

      <Show when={clienteModal()}>
        <ModalCliente cliente={clienteModal()!} onClose={() => setClienteModal(null)} />
      </Show>
    </AdminLayout>
  );
}
