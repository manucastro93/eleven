import { onMount, onCleanup, For } from "solid-js";

export default function TextoPromoSlider(props: { textos?: string[] }) {
  let containerRef: HTMLDivElement | undefined;
  let animationFrameId: number | undefined;

  const speed = 0.5;

  const animateScroll = () => {
    if (containerRef) {
      containerRef.scrollLeft += speed;

      if (containerRef.scrollLeft >= containerRef.scrollWidth / 2) {
        containerRef.scrollLeft = 0;
      }
    }

    animationFrameId = requestAnimationFrame(animateScroll);
  };

  onMount(() => {
    animationFrameId = requestAnimationFrame(animateScroll);
    onCleanup(() => cancelAnimationFrame(animationFrameId!));
  });

  const textos = props.textos ?? [
    "LOS PRECIOS NO INCLUYEN IVA",
    "COMPRA MÍNIMA $120.000",
    "DEMORA APROXIMADA X DÍAS",
    "PRECIOS SUJETOS A MODIFICACIONES",
    "STOCK SUJETO A DISPONIBILIDAD"
  ];

  return (
    <div class="bg-white overflow-hidden py-1 text-[11px] text-black tracking-wide">
      <div
        ref={containerRef}
        class="flex gap-12 whitespace-nowrap overflow-hidden"
        style={{ "will-change": "scroll-position" }}
      >
        <div class="shrink-0 flex gap-12" aria-hidden="true">
          <For each={[...Array(10)]}>
            {() => (
              <>
                <For each={textos}>
                  {(texto) => <span>- {texto} –</span>}
                </For>
              </>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}
