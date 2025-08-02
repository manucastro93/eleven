import { createSignal, onMount, createEffect } from "solid-js";
import { obtenerClienteDeLocalStorage, actualizarClienteEnLocalStorage } from "@/utils/localStorage";
import PasoWhatsapp from "./PasoWhatsapp";
import PasoCuit from "./PasoCuit";
import PasoDireccion from "./PasoDireccion";
import PasoDatosEmpresa from "./PasoDatosEmpresa";
import { buscarClienteDuxPorCuit } from "@/services/clienteDux.service";
import { obtenerSugerenciasDireccion } from "@/services/ubicacion.service";
import { useDireccionAutocomplete } from "@/hooks/useDireccionAutocomplete";

export default function FormPaso2(props: { onVolver: () => void }) {
  const [verificado, setVerificado] = createSignal(false);
  const [telefono, setTelefono] = createSignal("");
  const [codigo, setCodigo] = createSignal("");
  const [codigoEnviado, setCodigoEnviado] = createSignal(false);
  const [buscandoDatos, setBuscandoDatos] = createSignal(false);
  const [email, setEmail] = createSignal("");
  const [nombreFantasia, setNombreFantasia] = createSignal("");
  const [cuit, setCuit] = createSignal("");
  const [razonSocial, setRazonSocial] = createSignal("");
  const [codigoPostal, setCodigoPostal] = createSignal("");
  const [direccion, setDireccion] = createSignal("");
  const [localidad, setLocalidad] = createSignal("");
  const [provincia, setProvincia] = createSignal("");
  const [transporte, setTransporte] = createSignal("");
  const [errorCuit, setErrorCuit] = createSignal("");
  const {
    inputDireccion,
    setInputDireccion,
    sugerencias,
    mostrarSugerencias,
    setMostrarSugerencias,
    errorDireccion,
    handleInput,
    handleSelect,
    bloquear,
  } = useDireccionAutocomplete({
    direccion,
    setDireccion: (v) => {
      setDireccion(v);
      actualizarClienteEnLocalStorage("direccion", v);
    },
    setCodigoPostal: (v) => {
      setCodigoPostal(v);
      actualizarClienteEnLocalStorage("codigoPostal", v);
    },
    setLocalidad: (v) => {
      setLocalidad(v);
      actualizarClienteEnLocalStorage("localidad", v);
    },
    setProvincia: (v) => {
      setProvincia(v);
      actualizarClienteEnLocalStorage("provincia", v);
    },
  });

  createEffect(() => {
    setInputDireccion(direccion());
  });

  onMount(() => {
    const cliente = obtenerClienteDeLocalStorage();
    if (cliente) {
      setTelefono(cliente.telefono || "");
      setEmail(cliente.email || "");
      setNombreFantasia(cliente.nombre || "");
      setCuit(cliente.cuitOCuil || "");
      setRazonSocial(cliente.razonSocial || "");
      setDireccion(cliente.direccion || "");
      setLocalidad(cliente.localidad || "");
      setProvincia(cliente.provincia || "");
      setCodigoPostal(cliente.codigoPostal || "");
      setTransporte(cliente.transporte || "");
      if (cliente.telefono && cliente.whatsappVerificado === true) {
        setVerificado(true);
      }
    }
  });

  async function autoCompletarDireccionGoogle(domicilio: string, localidad: string, provincia: string) {
    const direccionCompleta = [domicilio, localidad, provincia].filter(Boolean).join(", ");
    setInputDireccion(direccionCompleta);

    // Esperá un toque para que el input se sincronice
    await new Promise((res) => setTimeout(res, 100));

    // Pedí sugerencias a la API
    const sugerenciasList = await obtenerSugerenciasDireccion(direccionCompleta);

    if (sugerenciasList && sugerenciasList.length > 0) {
      await handleSelect(sugerenciasList[0]);
      // Esto actualiza todos los datos: direccion, localidad, provincia, codigoPostal...
    }
  }

  async function handleCuitInput(val: string) {
    setCuit(val);
    actualizarClienteEnLocalStorage("cuitOCuil", val);

    if (val.length !== 11) {
      setErrorCuit("El CUIT/CUIL debe tener exactamente 11 números.");
      setRazonSocial("");
      actualizarClienteEnLocalStorage("razonSocial", "");
      return;
    }

    setErrorCuit("");
    setBuscandoDatos(true);

    // 1) Buscar en ClientesDux
    const cliente = await buscarClienteDuxPorCuit(val);
    if (cliente) {
      setRazonSocial(cliente.cliente || "");
      setEmail(cliente.correoElectronico || "");
      setNombreFantasia(cliente.nombreFantasia || "");
      setDireccion(cliente.domicilio || "");
      setLocalidad(cliente.localidad || "");
      setProvincia(cliente.provincia || "");
      // setCodigoPostal(cliente.codigoPostal || ""); // Si lo tenés
      actualizarClienteEnLocalStorage("razonSocial", cliente.cliente || "");
      actualizarClienteEnLocalStorage("email", cliente.correoElectronico || "");
      actualizarClienteEnLocalStorage("nombre", cliente.nombreFantasia || "");
      actualizarClienteEnLocalStorage("direccion", cliente.domicilio || "");
      actualizarClienteEnLocalStorage("localidad", cliente.localidad || "");
      actualizarClienteEnLocalStorage("provincia", cliente.provincia || "");
      // actualizarClienteEnLocalStorage("codigoPostal", cliente.codigoPostal || "");

      // --- TRIGGER AUTOCOMPLETE GOOGLE ---
      if (cliente.domicilio && cliente.localidad && cliente.provincia) {
        await autoCompletarDireccionGoogle(
          cliente.domicilio,
          cliente.localidad,
          cliente.provincia
        );
      }

      setBuscandoDatos(false);
      return;
    }

    // 2) Si no está en ClientesDux, buscar en padrón AFIP
    try {
      const res = await fetch(`http://localhost:8090/padron/${val}`);
      if (!res.ok) throw new Error("No se pudo consultar el padrón");
      const data = await res.json();
      setRazonSocial(data.nombre || "Sin datos");
      actualizarClienteEnLocalStorage("razonSocial", data.nombre || "Sin datos");
      // NO autocompletamos los demás campos porque no hay info.
    } catch (err) {
      setErrorCuit("Error al consultar el padrón.");
      setRazonSocial("");
      actualizarClienteEnLocalStorage("razonSocial", "");
    }
    setBuscandoDatos(false);
  }

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
      codigoPostal: codigoPostal(),
      transporte: transporte(),
    };
    console.log("✅ Enviando pedido con:", datos);
    alert("Pedido enviado (mock)");
  }

  return (
    <div class="p-5 space-y-6">
      <button
        class="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded text-xs"
        onClick={props.onVolver}
      >
        ← Volver al pedido
      </button>

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

          <PasoDatosEmpresa
            cuit={cuit}
            setCuit={handleCuitInput} // o tu setCuit directo
            razonSocial={razonSocial}
            setRazonSocial={setRazonSocial}
            nombreFantasia={nombreFantasia}
            setNombreFantasia={setNombreFantasia}
            email={email}
            setEmail={setEmail}
            telefono={telefono}
            setTelefono={setTelefono}
            errorCuit={errorCuit}
          />
          {buscandoDatos() && (
            <div class="my-2 text-sm text-gray-600">Buscando datos...</div>
          )}

          <PasoDireccion
            direccion={direccion}
            setDireccion={setDireccion}
            localidad={localidad}
            setLocalidad={setLocalidad}
            provincia={provincia}
            setProvincia={setProvincia}
            codigoPostal={codigoPostal}
            setCodigoPostal={setCodigoPostal}
            inputDireccion={inputDireccion}
            setInputDireccion={setInputDireccion}
            sugerencias={sugerencias}
            mostrarSugerencias={mostrarSugerencias}
            setMostrarSugerencias={setMostrarSugerencias}
            errorDireccion={errorDireccion}
            handleInput={handleInput}
            handleSelect={handleSelect}
          />

          {/* Transporte deseado */}
          <div>
            <label class="block text-sm mb-1">Forma de entrega</label>
            <input
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded text-xs"
              placeholder="Escribí el nombre del transporte o si retiras por el local"
              value={transporte()}
              onInput={(e) => {
                setTransporte(e.currentTarget.value);
                actualizarClienteEnLocalStorage("transporte", e.currentTarget.value);
              }}
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
