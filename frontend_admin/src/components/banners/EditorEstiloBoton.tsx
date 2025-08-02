import { createSignal, onMount } from "solid-js";

interface Props {
    initialValue: string;
    textoBoton: string;
    onChange: (nuevoEstilo: string, top: number, left: number) => void;
    top: number;
    left: number;
}

export default function EditorEstiloBoton(props: Props) {
    const [bgColor, setBgColor] = createSignal("#007bff");
    const [textColor, setTextColor] = createSignal("#ffffff");
    const [fontSize, setFontSize] = createSignal(16);
    const [paddingV, setPaddingV] = createSignal(8);
    const [paddingH, setPaddingH] = createSignal(16);
    const [borderRadius, setBorderRadius] = createSignal(6);
    const [borderWidth, setBorderWidth] = createSignal(1);
    const [borderColor, setBorderColor] = createSignal("#007bff");
    const [bold, setBold] = createSignal(false);
    const [italic, setItalic] = createSignal(false);
    const [shadow, setShadow] = createSignal(false);
    const [top, setTop] = createSignal(50);
    const [left, setLeft] = createSignal(50);
    const [transparentBackground, setTransparentBackground] = createSignal(false);

    const generarStyle = () => {
        return `
      background-color: ${transparentBackground() ? "transparent" : bgColor()};
      color: ${textColor()};
      font-size: ${fontSize()}vw;
      padding: ${paddingV()}px ${paddingH()}px;
      border-radius: ${borderRadius()}px;
      border: ${borderWidth()}px solid ${borderColor()};
      font-weight: ${bold() ? "bold" : "normal"};
      font-style: ${italic() ? "italic" : "normal"};
      ${shadow() ? "box-shadow: 0px 2px 6px rgba(0,0,0,0.3);" : ""}
    `.trim();
    };

    const update = () => {
        props.onChange(generarStyle(), top(), left());
    };

    onMount(() => {
        const style = props.initialValue;
        if (style.includes("background-color:")) {
            const match = style.match(/background-color:\s*(transparent|#[0-9a-fA-F]{6}|[a-zA-Z]+)/);
            if (match) {
                setBgColor(match[1] === "transparent" ? "#007bff" : match[1]);
                setTransparentBackground(match[1] === "transparent");
            }
        }

        if (style.includes("color:")) {
            const match = style.match(/(?<!background-)color:\s*(#[0-9a-fA-F]{6}|[a-zA-Z]+)/);
            if (match) setTextColor(match[1]);
        }

        if (style.includes("font-size:")) {
            const match = style.match(/font-size:\s*(\d+)vw/);
            if (match) setFontSize(parseInt(match[1]));
        }

        if (style.includes("padding:")) {
            const match = style.match(/padding:\s*(\d+)px\s+(\d+)px/);
            if (match) {
                setPaddingV(parseInt(match[1]));
                setPaddingH(parseInt(match[2]));
            }
        }

        if (style.includes("border-radius:")) {
            const match = style.match(/border-radius:\s*(\d+)px/);
            if (match) setBorderRadius(parseInt(match[1]));
        }

        if (style.includes("border:")) {
            const match = style.match(/border:\s*(\d+)px\s+solid\s+(#[0-9a-fA-F]{6}|[a-zA-Z]+)/);
            if (match) {
                setBorderWidth(parseInt(match[1]));
                setBorderColor(match[2]);
            }
        }

        if (style.includes("font-weight: bold")) {
            setBold(true);
        }

        if (style.includes("font-style: italic")) {
            setItalic(true);
        }

        if (style.includes("box-shadow:")) {
            setShadow(true);
        }

        setTop(props.top ?? 50);
        setLeft(props.left ?? 50);
        
        update();
    });


    return (
        <div class="flex flex-col gap-4 p-2 border rounded">
            <div class="font-medium mb-2">Editor de Estilo de Botón</div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block mb-1">Color de fondo</label>
                    <input
                        type="color"
                        value={bgColor()}
                        onInput={(e) => {
                            setBgColor(e.currentTarget.value);
                            update();
                        }}
                    />
                </div>

                <div class="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={transparentBackground()}
                        onChange={(e) => {
                            setTransparentBackground(e.currentTarget.checked);
                            update();
                        }}
                    />
                    <label>Fondo transparente</label>
                </div>


                <div>
                    <label class="block mb-1">Color de texto</label>
                    <input
                        type="color"
                        value={textColor()}
                        onInput={(e) => {
                            setTextColor(e.currentTarget.value);
                            update();
                        }}
                    />
                </div>

                <div>
                    <label class="block mb-1">Tamaño de fuente: {fontSize()}px</label>
                    <input
                        type="range"
                        min="1"
                        max="5"
                        value={fontSize()}
                        onInput={(e) => {
                            setFontSize(parseInt(e.currentTarget.value));
                            update();
                        }}
                    />
                </div>

                <div>
                    <label class="block mb-1">Espaciado vertical: {paddingV()}px</label>
                    <input
                        type="range"
                        min="0"
                        max="50"
                        value={paddingV()}
                        onInput={(e) => {
                            setPaddingV(parseInt(e.currentTarget.value));
                            update();
                        }}
                    />
                </div>

                <div>
                    <label class="block mb-1">Espaciado horizontal: {paddingH()}px</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={paddingH()}
                        onInput={(e) => {
                            setPaddingH(parseInt(e.currentTarget.value));
                            update();
                        }}
                    />
                </div>

                <div>
                    <label class="block mb-1">Borde radio: {borderRadius()}px</label>
                    <input
                        type="range"
                        min="0"
                        max="50"
                        value={borderRadius()}
                        onInput={(e) => {
                            setBorderRadius(parseInt(e.currentTarget.value));
                            update();
                        }}
                    />
                </div>

                <div>
                    <label class="block mb-1">Grosor borde: {borderWidth()}px</label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={borderWidth()}
                        onInput={(e) => {
                            setBorderWidth(parseInt(e.currentTarget.value));
                            update();
                        }}
                    />
                </div>

                <div>
                    <label class="block mb-1">Color del borde</label>
                    <input
                        type="color"
                        value={borderColor()}
                        onInput={(e) => {
                            setBorderColor(e.currentTarget.value);
                            update();
                        }}
                    />
                </div>

                <div>
                    <label class="block mb-1">Posición Top: {top()}%</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={top()}
                        onInput={(e) => {
                            setTop(parseInt(e.currentTarget.value));
                            update();
                        }}
                    />
                </div>

                <div>
                    <label class="block mb-1">Posición Left: {left()}%</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={left()}
                        onInput={(e) => {
                            setLeft(parseInt(e.currentTarget.value));
                            update();
                        }}
                    />
                </div>

                <div class="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={bold()}
                        onChange={(e) => {
                            setBold(e.currentTarget.checked);
                            update();
                        }}
                    />
                    <label>Negrita</label>
                </div>

                <div class="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={italic()}
                        onChange={(e) => {
                            setItalic(e.currentTarget.checked);
                            update();
                        }}
                    />
                    <label>Itálica</label>
                </div>

                <div class="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={shadow()}
                        onChange={(e) => {
                            setShadow(e.currentTarget.checked);
                            update();
                        }}
                    />
                    <label>Sombra</label>
                </div>
            </div>

            <div class="mt-4">
                <div class="font-medium mb-2">Vista previa:</div>
                <button
                    style={generarStyle()}
                    class="transition-all"
                >
                    {props.textoBoton || "Texto del botón"}
                </button>
            </div>
        </div>
    );
}
