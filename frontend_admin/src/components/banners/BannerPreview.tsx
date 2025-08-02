import type { Component } from "solid-js";

interface Props {
  img: string;
  texto: string;
  descripcionEstilo: string;
  textoTop: number;
  textoLeft: number;
  textoWidth: number;
  backgroundColorTexto: string;
  botonTexto: string;
  botonEstilo: string;
  botonTop: number;
  botonLeft: number;
}

export default function BannerPreview(props: Props) {
  return (
    <div
      class="border rounded w-full max-w-4xl overflow-hidden relative aspect-[2/1]"
      style={`
        background-image: url('${props.img}');
        background-size: cover;
        background-position: center;
      `}
    >
      {/* TEXTO */}
      <div
        style={`
          position: absolute;
          top: ${props.textoTop}%;
          left: ${props.textoLeft}%;
          width: ${props.textoWidth}%;
          ${props.descripcionEstilo};
          padding: 0.5vw 1vw;
          border-radius: 0.5vw;
          word-wrap: break-word;
        `}
      >
        {props.texto || ""}
      </div>

      {/* BOTÓN */}
      {props.botonTexto && (
        <div
          style={`
            position: absolute;
            top: ${props.botonTop}%;
            left: ${props.botonLeft}%;
          `}
        >
          <button
            style={props.botonEstilo}
            class="transition-all"
          >
            {props.botonTexto}
          </button>
        </div>
      )}
    </div>
  );
}

