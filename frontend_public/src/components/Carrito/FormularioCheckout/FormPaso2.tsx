import { createSignal } from "solid-js";
import PasoWhatsapp from "./PasoWhatsapp";
import PasoCuit from "./PasoCuit";
import PasoDireccion from "./PasoDireccion";

export default function FormPaso2(props: { onVolver: () => void }) {
  const [verificado, setVerificado] = createSignal(false);
  const [telefono, setTelefono] = createSignal("");
  const [codigo, setCodigo] = createSignal("");
  const [codigoEnviado, setCodigoEnviado] = createSignal(false);

  const [email, setEmail] = createSignal("");
  const [nombreFantasia, setNombreFantasia] = createSignal("");

  const [cuit, setCuit] = createSignal("");
  const [razonSocial, setRazonSocial] = createSignal("");

  const [direccion, setDireccion] = createSignal("");
  const [localidad, setLocalidad] = createSignal("");
  const [provincia, setProvincia] = createSignal("");

  const [transporte, setTransporte] = createSignal("");

  function enviarPedido() {
    const datos = {
      telefono: telefono(),
      email: email(),
      nombreFantasia: nombreFantasia(),
      cuit: cuit(),
      razonSocial: razonSocial(),
      direccion: direccion(),
      localidad: localidad(),
      provincia: provincia(),
      transporte: transporte(),
    };
    console.log("✅ Enviando pedido con:", datos);
    alert("Pedido enviado (mock)");
  }

  return (
    <div class="p-5 space-y-6">
      <PasoWhatsapp
        telefono={telefono}
        setTelefono={setTelefono}
        codigo={codigo}
        setCodigo={setCodigo}
        codigoEnviado={codigoEnviado}
        setCodigoEnviado={setCodigoEnviado}
        verificado={verificado}
        setVerificado={setVerificado}
      />

      {verificado() && (
        <>
          {/* Email */}
          <div>
            <label class="block text-sm mb-1">Email</label>
            <input
              type="email"
              class="w-full px-3 py-2 border rounded text-sm"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
            />
          </div>

          {/* Nombre de fantasía */}
          <div>
            <label class="block text-sm mb-1">Nombre de fantasía</label>
            <input
              type="text"
              class="w-full px-3 py-2 border rounded text-sm"
              value={nombreFantasia()}
              onInput={(e) => setNombreFantasia(e.currentTarget.value)}
            />
          </div>

          <PasoCuit
            cuit={cuit}
            setCuit={setCuit}
            razonSocial={razonSocial}
            setRazonSocial={setRazonSocial}
          />

          <PasoDireccion
            direccion={direccion}
            setDireccion={setDireccion}
            localidad={localidad}
            setLocalidad={setLocalidad}
            provincia={provincia}
            setProvincia={setProvincia}
          />

          {/* Transporte deseado */}
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

          <button
            onClick={enviarPedido}
            class="mt-4 bg-black text-white px-4 py-2 rounded text-sm w-full"
          >
            Enviar pedido
          </button>
        </>
      )}
    </div>
  );
}
