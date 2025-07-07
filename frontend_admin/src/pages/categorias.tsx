import { createSignal, Show } from "solid-js";
import AdminLayout from "@/layout/AdminLayout";
import FiltroCategorias from "@/components/categorias/FiltroCategorias";
import TablaCategorias from "@/components/categorias/TablaCategorias";
import ModalCategoria from "@/components/categorias/ModalCategoria";

type FiltroCategorias = {
  search: string;
  page: number;
  orderBy: string;
  orderDir: "ASC" | "DESC";
};

export default function CategoriasPage() {
  const [filtro, setFiltro] = createSignal<FiltroCategorias>({
    search: "",
    page: 1,
    orderBy: "orden",
    orderDir: "ASC",
  });
  const [categoriaModal, setCategoriaModal] = createSignal<any | null>(null);
  const [reload, setReload] = createSignal(0);
  return (
    <AdminLayout>
      <h2 class="text-2xl font-bold mb-4">Categorías</h2>

      <FiltroCategorias filtro={filtro()} setFiltro={setFiltro} />

      <TablaCategorias
        filtro={filtro()}
        setFiltro={setFiltro}
        onCategoriaClick={(cat) => setCategoriaModal(cat)}
      />

      <Show when={categoriaModal()}>
        <ModalCategoria
          categoria={categoriaModal()!}
          onClose={() => setCategoriaModal(null)}
          onImagenActualizada={() => setReload(r => r + 1)}
        />
      </Show>
    </AdminLayout>
  );
}
