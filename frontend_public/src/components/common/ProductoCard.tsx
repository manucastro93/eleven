import { useNavigate } from "@solidjs/router";
import type { Producto } from "@/types/producto.type";
import { ImagenConExtensiones } from "@/components/shared/ImagenConExtensiones";

export default function ProductoCard(props: { producto: Producto }) {
  const navigate = useNavigate();
  const { id, nombre, slug, precio, codigo } = props.producto;
  const codigoLimpio = codigo.replace(/\D/g, "");

  return (
    <div
      onClick={() => navigate(`/productos/detalle/${slug ?? id}`)}
      class="cursor-pointer text-sm"
    >
      <ImagenConExtensiones
        codigo={codigoLimpio}
        letra="a"
        class="w-full aspect-[4/5] object-contain bg-white rounded"
      />
      <p class="mt-1 line-clamp-2 text-xs">{nombre} ({codigo})</p>
      <p class="font-semibold mt-0.5">${precio}</p>
    </div>
  );
}
