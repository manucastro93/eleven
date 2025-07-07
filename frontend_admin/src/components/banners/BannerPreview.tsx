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
            class="border rounded w-full max-w-4xl overflow-hidden relative"
            style={`
        background-image: url('${props.img}');
        background-size: cover;
        background-position: center;
        height: 400px;
      `}
        >
            {/* TEXTO */}
            <div
                style={`
      position: absolute;
      top: ${props.textoTop}px;
      left: ${props.textoLeft}px;
      width: ${props.textoWidth}%;
      ${props.descripcionEstilo};
      padding: 8px 12px;
      border-radius: 6px;
      word-wrap: break-word;
    `}
            >
                {props.texto || "Texto de ejemplo"}
            </div>

            {/* BOTÓN */}
            {props.botonTexto && (
                <div
                    style={`
            position: absolute;
            top: ${props.botonTop}px;
            left: ${props.botonLeft}px;
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
