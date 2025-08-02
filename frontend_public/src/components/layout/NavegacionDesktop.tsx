import { createResource, createSignal, For, Show, onMount, onCleanup, createEffect } from "solid-js";
import { A } from "@solidjs/router";
import { listarCategorias } from "@/services/categoria.service";
import type { Categoria } from "@/types/categoria.type";
import { headerRef, navRef, promoRef } from "./Header";
import { listarItemsMenu } from "@/services/itemMenu.service";
import type { ItemMenu } from "@/types/itemMenu.type";

export default function NavegacionDesktop(props: { refNav?: (el: HTMLDivElement) => void }) {
  const [hovered, setHovered] = createSignal(false);
  const [categorias] = createResource<Categoria[]>(listarCategorias);
  const [offsetTop, setOffsetTop] = createSignal(0);
  const [itemsMenu] = createResource<ItemMenu[]>(listarItemsMenu);

  const calcularOffset = () => {
    const promo = promoRef?.offsetHeight || 0;
    const header = headerRef?.offsetHeight || 0;
    setOffsetTop(promo + header + 60); // le sumamos margen de 8px para bajarlo
  };

  onMount(() => {
    calcularOffset();
    window.addEventListener("resize", calcularOffset);
    onCleanup(() => window.removeEventListener("resize", calcularOffset));
  });

  const agruparCategorias = (cats: Categoria[], size = 4) => {
    const grupos: Categoria[][] = [];
    for (let i = 0; i < cats.length; i += size) {
      grupos.push(cats.slice(i, i + size));
    }
    return grupos;
  };

    // Bloquear scroll cuando se despliega
  createEffect(() => {
    document.body.style.overflow = hovered() ? "hidden" : "auto";
  });

  return (
    <nav
      ref={(el) => props.refNav?.(el as HTMLDivElement)}
      class="hidden md:block border-b border-gray-200 bg-black text-sm tracking-wide relative z-30"
    >
      <ul class="flex justify-center gap-6 py-3 text-white">
        {/* SHOP */}
        <li class="relative">
          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <span class="hover:text-acento font-medium cursor-pointer px-2">
              SHOP <span class="ml-1">▾</span>
            </span>

            <Show when={hovered() && categorias()}>
              <div
                class="fixed left-0 w-full bg-black text-white shadow-xl border-t border-gray-800 transition-all duration-200 ease-out z-30"
                style={{
                  top: `${offsetTop()}px`,
                  padding: "2rem 2.5rem",
                  "padding-top": "1rem",
                  "max-height": "50vh",
                  "overflow-y": "auto",
                }}
              >
                <div class="max-w-7xl mx-auto grid grid-cols-3 gap-8">
                  <For each={agruparCategorias(categorias()!)}>
                    {(grupo) => (
                      <ul class="space-y-3">
                        <For each={grupo}>
                          {(cat) => (
                            <li>
                              <A
                                href={`/categoria/${cat.slug}`}
                                class="block hover:text-acento font-medium"
                                onClick={() => setHovered(false)}
                              >
                                {cat.nombre}
                              </A>
                            </li>
                          )}
                        </For>
                      </ul>
                    )}
                  </For>
                </div>
              </div>
            </Show>
          </div>
        </li>


        {/* Otros ítems */}
          <For each={itemsMenu()?.filter(item => item.activo)}>
            {(item) => {
              const slug = item.slug.toLowerCase();
              const ruta =
                slug === "info" ? "/info"
                : slug === "nosotros" ? "/nosotros"
                : `/item/${item.slug}`;

              return (
                <li>
                  <A href={ruta} class="hover:text-acento font-medium px-2">
                    {item.nombre}
                  </A>
                </li>
              );
            }}
          </For>
      </ul>
    </nav>
  );
}
