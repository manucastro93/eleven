import { createSignal, onMount } from "solid-js";

interface Props {
  initialValue: string;
  textoPreview: string;
  top: number;
  left: number;
  width: number;
  onChange: (nuevoEstilo: string, top: number, left: number, width: number) => void;
}

export default function EditorEstiloTexto(props: Props) {
  const [color, setColor] = createSignal("#000000");
  const [backgroundColor, setBackgroundColor] = createSignal("#ffffff");
  const [fontSize, setFontSize] = createSignal(2);
  const [bold, setBold] = createSignal(false);
  const [italic, setItalic] = createSignal(false);
  const [shadow, setShadow] = createSignal(false);
  const [top, setTop] = createSignal(50);
  const [left, setLeft] = createSignal(50);
  const [width, setWidth] = createSignal(50);
  const [transparentBackground, setTransparentBackground] = createSignal(false);

  const generarStyle = () => {
    return `
      color: ${color()};
      background-color: ${transparentBackground() ? "transparent" : backgroundColor()};
      font-size: ${fontSize()}vw;
      font-weight: ${bold() ? "bold" : "normal"};
      font-style: ${italic() ? "italic" : "normal"};
      text-align: center;
      width: ${width()}vw;
      ${shadow() ? "text-shadow: 1px 1px 4px rgba(0,0,0,0.4);" : ""}
    `.trim();
  };

  const update = () => {
    props.onChange(generarStyle(), top(), left(), width());
  };

  onMount(() => {
    const style = props.initialValue;

    if (style.includes("color:")) {
      const match = style.match(/color:\s*(#[0-9a-fA-F]{6}|[a-zA-Z]+)/);
      if (match) setColor(match[1]);
    }

    if (style.includes("background-color:")) {
      const match = style.match(/background-color:\s*(transparent|#[0-9a-fA-F]{6}|[a-zA-Z]+)/);
      if (match) {
        setBackgroundColor(match[1] === "transparent" ? "#ffffff" : match[1]);
        setTransparentBackground(match[1] === "transparent");
      }
    }

    if (style.includes("font-size:")) {
      const match = style.match(/font-size:\s*(\d+(?:\.\d+)?)vw/);
      if (match) setFontSize(parseFloat(match[1]));
    }

    if (style.includes("font-weight: bold")) setBold(true);
    if (style.includes("font-style: italic")) setItalic(true);
    if (style.includes("text-shadow:")) setShadow(true);

    setTop(props.top ?? 50);
    setLeft(props.left ?? 50);
    setWidth(props.width ?? 50);

    update();
  });

  return (
    <div class="flex flex-col gap-4 p-2 border rounded">
      <div class="font-medium mb-2">Editor de Estilo de Texto</div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block mb-1">Color del texto</label>
          <input type="color" value={color()} onInput={(e) => { setColor(e.currentTarget.value); update(); }} />
        </div>

        <div>
          <label class="block mb-1">Color de fondo texto</label>
          <input type="color" value={backgroundColor()} onInput={(e) => { setBackgroundColor(e.currentTarget.value); update(); }} />
        </div>

        <div class="flex items-center gap-2">
          <input type="checkbox" checked={transparentBackground()} onChange={(e) => { setTransparentBackground(e.currentTarget.checked); update(); }} />
          <label>Fondo transparente</label>
        </div>

        <div>
          <label class="block mb-1">Tamaño de fuente: {fontSize()}vw</label>
          <input type="range" min="1" max="5" step="0.1" value={fontSize()} onInput={(e) => { setFontSize(parseFloat(e.currentTarget.value)); update(); }} />
        </div>

        <div>
          <label class="block mb-1">Posición Top: {top()}%</label>
          <input type="range" min="0" max="100" value={top()} onInput={(e) => { setTop(parseInt(e.currentTarget.value)); update(); }} />
        </div>

        <div>
          <label class="block mb-1">Posición Left: {left()}%</label>
          <input type="range" min="0" max="100" value={left()} onInput={(e) => { setLeft(parseInt(e.currentTarget.value)); update(); }} />
        </div>

        <div>
          <label class="block mb-1">Ancho (width): {width()}vw</label>
          <input type="range" min="10" max="100" value={width()} onInput={(e) => { setWidth(parseInt(e.currentTarget.value)); update(); }} />
        </div>

        <div class="flex items-center gap-2">
          <input type="checkbox" checked={bold()} onChange={(e) => { setBold(e.currentTarget.checked); update(); }} />
          <label>Negrita</label>
        </div>

        <div class="flex items-center gap-2">
          <input type="checkbox" checked={italic()} onChange={(e) => { setItalic(e.currentTarget.checked); update(); }} />
          <label>Itálica</label>
        </div>

        <div class="flex items-center gap-2">
          <input type="checkbox" checked={shadow()} onChange={(e) => { setShadow(e.currentTarget.checked); update(); }} />
          <label>Sombra</label>
        </div>
      </div>

      <div class="mt-4">
        <div class="font-medium mb-2">Vista previa:</div>
        <div style={generarStyle()} class="transition-all border rounded p-4">
          {props.textoPreview || ""}
        </div>
      </div>
    </div>
  );
}
