import { createSignal, onMount } from "solid-js";

export function ImagenConExtensiones(props: { codigo: string; letra?: string }) {
  const extensiones = ["jpg", "jpeg", "png"];
  const [src, setSrc] = createSignal("");
  const baseUrl = import.meta.env.VITE_SOCKET_URL;

  let intento = 0;

  const construirUrl = (ext: string) =>
    `${baseUrl}/uploads/productos/${props.codigo}${props.letra || "a"}.${ext}`;

  const probarSiguiente = () => {
    if (intento < extensiones.length) {
      const nuevaUrl = construirUrl(extensiones[intento++]);
      setSrc(nuevaUrl);
    } else {
      setSrc("/img/no-image.png");
    }
  };

  onMount(() => {
    probarSiguiente(); // ✅ Esto es clave para que inicie
  });

  return (
    <img
      src={src()}
      onError={probarSiguiente}
      alt="Producto"
      class="h-20 w-20 object-cover rounded"
    />
  );
}
