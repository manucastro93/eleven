import { For, Show, splitProps } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { ArrowLeft } from "lucide-solid";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  mostrarVolver?: boolean; // default true
  separador?: "/" | ">";
};

export default function Breadcrumb(allProps: BreadcrumbProps) {
  const [props] = splitProps(allProps, ["items", "mostrarVolver", "separador"]);
  const navigate = useNavigate();
  const sep = props.separador || "/";

  return (
    <nav class="text-sm text-gray-600 px-4 pt-4 max-w-7xl mx-auto">
      <div class="flex gap-2 items-center flex-wrap mb-2">
        <Show when={props.mostrarVolver !== false}>
          <button
            onClick={async () => {
              navigate(-1);
            }}
            class="flex items-center gap-1 text-xs text-black-600 px-3 py-1.5 rounded transition"
          >
            <ArrowLeft size={14} />
            Volver
          </button>
          <span class="text-gray-300">{sep}</span>
        </Show>

        <For each={props.items}>
          {(item, i) => (
            <>
              <Show when={i() > 0}>
                <span class="text-gray-300">{sep}</span>
              </Show>
              <Show when={item.href} fallback={<span>{item.label}</span>}>
                <A href={item.href!} class="hover:underline">
                  {item.label}
                </A>
              </Show>
            </>
          )}
        </For>
      </div>
    </nav>
  );
}
