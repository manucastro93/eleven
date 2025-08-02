/// <reference types="solid-js" />
import type { JSX } from "solid-js";


export function Input(props: JSX.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      class={`border px-2 py-1 rounded ${props.class ?? ""}`}
    />
  );
}
