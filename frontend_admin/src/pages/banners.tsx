import { createSignal, Show } from "solid-js";
import AdminLayout from "@/layout/AdminLayout";
import FiltroBanners from "@/components/banners/FiltroBanners";
import TablaBanners from "@/components/banners/TablaBanners";
import ModalBanner from "@/components/banners/ModalBanner";
import BotonNuevoBanner from "@/components/banners/BotonNuevoBanner";

type FiltroBanners = {
  search: string;
  page: number;
  orderBy: string;
  orderDir: "ASC" | "DESC";
};

export default function BannersPage() {
  const [filtro, setFiltro] = createSignal<FiltroBanners>({
    search: "",
    page: 1,
    orderBy: "orden",
    orderDir: "ASC",
  });

  const [bannerModal, setBannerModal] = createSignal<any | null>(null);

  const handleCloseModal = () => {
    setBannerModal(null);

    // Refrescar tabla
    setFiltro({ ...filtro() });
    };


  return (
    <AdminLayout>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Banners</h2>
        <BotonNuevoBanner
          onClick={() =>
            setBannerModal({
              img: "",
              texto: "",
              botonTexto: "",
              botonLink: "",
              descripcionEstilo: "",
              botonEstilo: "",
              fechaDesde: "",
              fechaHasta: "",
              orden: 0,
              activo: true,
            })
          }
        />
      </div>

      <FiltroBanners filtro={filtro()} setFiltro={setFiltro} />

      <TablaBanners
        filtro={filtro()}
        setFiltro={setFiltro}
        onBannerClick={(banner) => setBannerModal(banner)}
      />

      <Show when={bannerModal()}>
        <ModalBanner
        banner={bannerModal()!}
        onClose={handleCloseModal}
        />
      </Show>
    </AdminLayout>
  );
}
