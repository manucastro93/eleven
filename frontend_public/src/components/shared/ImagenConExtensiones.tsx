import { createSignal, onMount } from "solid-js";

export function ImagenConExtensiones(props: {
  codigo: string;
  letra?: string;
  class?: string;
  alt?: string;
}) {
  const extensiones = ["jpg", "jpeg", "png"];
  const [src, setSrc] = createSignal("");
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  let intento = 0;

  const construirUrl = (ext: string) =>
    `${baseUrl}/uploads/productos/${props.codigo}${props.letra || "a"}.${ext}`;

  const probarSiguiente = () => {
    if (intento < extensiones.length) {
      setSrc(construirUrl(extensiones[intento++]));
    } else {
      setSrc("/img/no-image.png");
    }
  };

  onMount(() => {
    probarSiguiente();
  });

  return (
    <img
      src={src()}
      onError={() => {
        // Previene volver a entrar si ya es la imagen por defecto
        if (src() !== "/img/no-image.png") probarSiguiente();
      }}
      alt={props.alt || "Producto"}
      class={props.class || ""}
      loading="lazy"
    />
  );
}
