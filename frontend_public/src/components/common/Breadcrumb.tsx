import { For, JSX } from "solid-js";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export default function Breadcrumb(props: { items: BreadcrumbItem[] }) {
  return (
    <nav class="text-sm text-gray-500 mb-2 space-x-1 flex flex-wrap items-center">
      <For each={props.items}>
        {(item, index) => (
          <>
            {index() > 0 && <span class="text-gray-400">›</span>}
            {item.href ? (
              <a href={item.href} class="hover:underline">{item.label}</a>
            ) : (
              <span class="text-black capitalize">{item.label}</span>
            )}
          </>
        )}
      </For>
    </nav>
  );
}
