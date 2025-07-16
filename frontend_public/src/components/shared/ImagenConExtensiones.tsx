import { createSignal, onMount } from "solid-js";

export function ImagenConExtensiones(props: {
  archivo?: string;                 // 🔹 nombre completo de archivo (opcional)
  codigo?: string;                 // 🔹 base del código (si no viene archivo)
  letra?: string;
  class?: string;
  alt?: string;
}) {
  const extensiones = ["jpg", "jpeg", "png"];
  const [src, setSrc] = createSignal<string | null>(null);
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  let intento = 0;

  const construirUrl = (ext: string) =>
    `${baseUrl}/uploads/productos/${props.codigo}${props.letra || "a"}.${ext}`;

  const probarSiguiente = async () => {
    if (!props.codigo) {
      setSrc("/img/no-image.png");
      return;
    }

    if (intento >= extensiones.length) {
      setSrc("/img/no-image.png");
      return;
    }

    const url = construirUrl(extensiones[intento++]);

    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok) {
        setSrc(url);
      } else {
        probarSiguiente();
      }
    } catch {
      probarSiguiente();
    }
  };

  onMount(() => {
    if (props.archivo) {
      setSrc(`${baseUrl}/uploads/productos/${props.archivo}`);
    } else {
      probarSiguiente();
    }
  });

  return (
    <img
      src={src() || ""}
      alt={props.alt || "Producto"}
      class={props.class || ""}
      loading="lazy"
    />
  );
}

