import { createSignal, Show, createEffect } from "solid-js";
import AdminLayout from "@/layout/AdminLayout";
import FiltroItemsMenu from "@/components/itemsMenu/FiltroItemsMenu";
import TablaItemsMenu from "@/components/itemsMenu/TablaItemsMenu";
import ModalItemMenu from "@/components/itemsMenu/ModalItemMenu";

type FiltroItems = {
  search: string;
  page: number;
  orderBy: string;
  orderDir: "ASC" | "DESC";
};

export default function ItemsMenuPage() {
  const [filtro, setFiltro] = createSignal<FiltroItems>({
    search: "",
    page: 1,
    orderBy: "orden",
    orderDir: "ASC",
  });
  const [itemModal, setItemModal] = createSignal<any | null>(null);
  const [reload, setReload] = createSignal(0);

  return (
    <AdminLayout>
      <h2 class="text-2xl font-bold mb-4">Menú de navegación</h2>

      <FiltroItemsMenu filtro={filtro()} setFiltro={setFiltro} />
      
      <button
        onClick={() => setItemModal({ nombre: "", activo: true })}
        class="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        ➕ Nuevo ítem
      </button>

      <TablaItemsMenu
        filtro={filtro()}
        setFiltro={setFiltro}
        reload={reload()}
        onItemClick={(item) => setItemModal(item)}
      />

      <Show when={itemModal()}>
        <ModalItemMenu
          item={itemModal()!}
          onClose={() => setItemModal(null)}
          onActualizado={() => setReload(r => r + 1)}
        />
      </Show>
    </AdminLayout>
  );
}
