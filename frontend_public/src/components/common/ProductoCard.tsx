// src/components/common/ProductoCard.tsx
import { useNavigate } from "@solidjs/router";
import type { Producto } from "@/types/producto.type";

export default function ProductoCard(props: { producto: Producto }) {
  const navigate = useNavigate();
  const { id, nombre, slug, precio, imagenes, codigo } = props.producto;
  const codigoLimpio = codigo.replace(/\D/g, "");
  return (
    <div
      onClick={() => navigate(`/productos/detalle/${slug ?? id}`)}
      class="cursor-pointer text-sm"
    >
      <img
        src={`${import.meta.env.VITE_BACKEND_URL}/uploads/productos/${codigoLimpio}a.jpeg`}
        alt={nombre}
        class="w-full aspect-[4/5] object-contain bg-white rounded"
      />
      <p class="mt-1 line-clamp-2 text-xs">{nombre}</p>
      <p class="font-semibold mt-0.5">${precio}</p>
    </div>
  );
}
