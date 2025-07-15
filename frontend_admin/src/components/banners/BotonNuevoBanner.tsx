import { Component } from "solid-js";

interface Props {
  onClick: () => void;
  texto?: string;
}

const BotonNuevoBanner: Component<Props> = (props) => {
  return (
    <button
      class="relative w-[200px] h-10 border rounded overflow-hidden bg-blue-500 text-sm font-semibold ml-auto mb-4"
      onClick={props.onClick}
    >
      <span class="relative z-10 text-white">
        {props.texto ?? "Nuevo Banner"}
      </span>
    </button>
  );
};

export default BotonNuevoBanner;
