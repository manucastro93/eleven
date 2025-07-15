// components/Carrito/FormularioCheckout/PasoDatosEmpresa.tsx
import { createSignal, Show } from "solid-js";

export default function PasoDatosEmpresa(props: {
  cuit: string;
  setCuit: (val: string) => void;
}) {
  const [razonSocial, setRazonSocial] = createSignal("(a completar)");
  const [email, setEmail] = createSignal("");
  const [nombreFantasia, setNombreFantasia] = createSignal("");
  const [direccion, setDireccion] = createSignal("");
  const [localidad, setLocalidad] = createSignal("(auto)");
  const [provincia, setProvincia] = createSignal("(auto)");
  const [transporte, setTransporte] = createSignal("");

  const buscarRazonSocial = async () => {
    if (props.cuit.length !== 11) {
      alert("El CUIT/CUIL debe tener exactamente 11 dígitos.");
      return;
    }

    try {
      const res = await fetch(`https://api.tusfacturas.app/api/v1/afip/info/${props.cuit}`);
      const data = await res.json();

      if (data.razon_social) {
        setRazonSocial(data.razon_social);
      } else {
        alert("No se pudo obtener la razón social");
      }
    } catch (err) {
      alert("Error al consultar el CUIT");
    }
  };

  return (
    <div class="space-y-4 pt-4 border-t">
      {/* Mail */}
      <div>
        <label class="block text-sm mb-1">Email</label>
        <input
          type="email"
          class="w-full px-3 py-2 border rounded text-sm"
          value={email()}
          onInput={(e) => setEmail(e.currentTarget.value)}
        />
      </div>

      {/* Nombre fantasía */}
      <div>
        <label class="block text-sm mb-1">Nombre de fantasía</label>
        <input
          type="text"
          class="w-full px-3 py-2 border rounded text-sm"
          value={nombreFantasia()}
          onInput={(e) => setNombreFantasia(e.currentTarget.value)}
        />
      </div>

      {/* CUIT/CUIL */}
      <div>
        <label class="block text-sm mb-1">CUIT o CUIL</label>
        <input
          type="text"
          inputmode="numeric"
          maxlength="11"
          value={props.cuit}
          onInput={(e) =>
            props.setCuit(e.currentTarget.value.replace(/\D/g, "").slice(0, 11))
          }
          onBlur={buscarRazonSocial}
          class="w-full px-3 py-2 border rounded text-sm"
          placeholder="Sin guiones"
        />
      </div>

      {/* Razón social */}
      <div>
        <label class="block text-sm mb-1">Razón social</label>
        <input
          type="text"
          disabled
          class="w-full px-3 py-2 border rounded text-sm bg-gray-100"
          value={razonSocial()}
        />
      </div>

      {/* Dirección (autocompletar con Google Maps más adelante) */}
      <div>
        <label class="block text-sm mb-1">Dirección</label>
        <input
          type="text"
          class="w-full px-3 py-2 border rounded text-sm"
          placeholder="Autocompletado Google Maps"
          value={direccion()}
          onInput={(e) => setDireccion(e.currentTarget.value)}
        />
      </div>

      {/* Localidad y Provincia */}
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm mb-1">Localidad</label>
          <input
            type="text"
            disabled
            class="w-full px-3 py-2 border rounded text-sm bg-gray-100"
            value={localidad()}
          />
        </div>
        <div>
          <label class="block text-sm mb-1">Provincia</label>
          <input
            type="text"
            disabled
            class="w-full px-3 py-2 border rounded text-sm bg-gray-100"
            value={provincia()}
          />
        </div>
      </div>

      {/* Transporte */}
      <div>
        <label class="block text-sm mb-1">Transporte deseado</label>
        <input
          type="text"
          class="w-full px-3 py-2 border rounded text-sm"
          placeholder="Escribí el nombre del transporte"
          value={transporte()}
          onInput={(e) => setTransporte(e.currentTarget.value)}
        />
      </div>

      <button class="mt-4 bg-black text-white px-4 py-2 rounded text-sm w-full">
        Enviar pedido
      </button>
    </div>
  );
}
