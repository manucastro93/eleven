/// <reference types="solid-js" />
import type { JSX } from "solid-js";

export function Button(props: JSX.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      class={`px-3 py-1 rounded bg-blue-600 text-white ${props.class ?? ""}`}
    />
  );
}
