import { createSignal, onMount, createEffect, Show, JSX } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Select } from "@thisbeyond/solid-select";
import "@thisbeyond/solid-select/style.css";
import { obtenerClienteDeLocalStorage, actualizarClienteEnLocalStorage } from "@/utils/localStorage";
import PasoWhatsapp from "./PasoWhatsapp";
import PasoDireccion from "./PasoDireccion";
import PasoDatosEmpresa from "./PasoDatosEmpresa";
import { buscarClienteDuxPorCuit } from "@/services/clienteDux.service";
import { obtenerSugerenciasDireccion } from "@/services/ubicacion.service";
import { useDireccionAutocomplete } from "@/hooks/useDireccionAutocomplete";
import { vincularSesionAnonimaACliente } from "@/services/sesionAnonima.service";
import { validarCarrito } from "@/utils/validarCarrito";
import { getCarritoActivo, confirmarCarrito } from "@/services/carrito.service";
import { crearCliente, buscarClientePorCuit } from "@/services/cliente.service";
import ToastContextual from "@/components/ui/ToastContextual";
import { User } from "lucide-solid";
import { useCarrito } from "@/store/carrito";
import { opcionesPago, opcionesEnvio } from "@/constants/opciones";
import { useToastContextual } from "@/hooks/useToastContextual";

type OpcionEntrega = { value: string; label: string } | null;

export default function FormPaso2(props: {
  onVolver: () => void;
  modoEdicion?: boolean;
  tiempoRestante?: number;
  onConfirmarEdicion?: (formData: any) => void;
  pedidoEditando?: any;
}) {
  const navigate = useNavigate();
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
  const [detalleTransporte, setDetalleTransporte] = createSignal(""); // SOLO string
  const [errorCuit, setErrorCuit] = createSignal("");
  const [enviando, setEnviando] = createSignal(false);
  const { pedidoEditandoId } = useCarrito();
  const { toastVisible, toastMsg, toastTipo, showToast, handleClose } = useToastContextual();

  const format = (item: any, _type: any) => item.label;

  const [formaPago, setFormaPago] = createSignal<OpcionEntrega>(null);
  const [formaEnvio, setFormaEnvio] = createSignal<OpcionEntrega>(null);

  // Autocomplete hooks
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
      setDetalleTransporte(cliente.transporte || "");

      // Forma de envío
      if (cliente.formaEnvio) {
        const optEnvio = opcionesEnvio.find(opt =>
          opt.value === (
            cliente.formaEnvio && typeof cliente.formaEnvio === "object" && "value" in cliente.formaEnvio
              ? (cliente.formaEnvio as { value: string }).value
              : cliente.formaEnvio
          )
        );
        if (optEnvio) setFormaEnvio(optEnvio);
      }

      // Forma de pago
      if (cliente.formaPago) {
        const optPago = opcionesPago.find(opt =>
          opt.value === (
            cliente.formaPago && typeof cliente.formaPago === "object" && "value" in cliente.formaPago
              ? (cliente.formaPago as { value: string }).value
              : cliente.formaPago
          )
        );
        if (optPago) setFormaPago(optPago);
      }


      if (cliente.telefono && cliente.whatsappVerificado === true) {
        setVerificado(true);
      }
    }
  });

  async function autoCompletarDireccionGoogle(domicilio: string, localidad: string, provincia: string) {
    const direccionCompleta = [domicilio, localidad, provincia].filter(Boolean).join(", ");
    setInputDireccion(direccionCompleta);
    await new Promise((res) => setTimeout(res, 100));
    const sugerenciasList = await obtenerSugerenciasDireccion(direccionCompleta);
    if (sugerenciasList && sugerenciasList.length > 0) {
      await handleSelect(sugerenciasList[0]);
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

    // 1) Buscar localmente
    let cliente: any = await buscarClientePorCuit(val);

    // 2) Si no está local, buscar en Dux
    if (!cliente) {
      cliente = await buscarClienteDuxPorCuit(val);
      if (cliente) {
        // Si lo encontrás en Dux, creá el cliente localmente
        await crearCliente({
          clienteDuxId: cliente.id || null,
          nombre: cliente.nombreFantasia || "",
          razonSocial: cliente.cliente || "",
          email: cliente.correoElectronico || "",
          telefono: cliente.telefono || "",
          direccion: cliente.domicilio || "",
          localidad: cliente.localidad || "",
          provincia: cliente.provincia || "",
          cuitOCuil: cliente.cuitCuil || "",
          categoriaFiscal: cliente.categoriaFiscal || "",
          codigoPostal: cliente.codigoPostal || "",
        });
        const clienteLocal = await buscarClientePorCuit(val);
        if (clienteLocal) {
          actualizarClienteEnLocalStorage("id", clienteLocal.id || "");
          await vincularSesionAnonimaACliente(clienteLocal.id ?? 0);
        }
      }
    }

    // 3) Si encontraste alguno, seteá signals
    if (cliente) {
      setRazonSocial(cliente.razonSocial || cliente.cliente || "");
      setEmail(cliente.email || cliente.correoElectronico || "");
      setNombreFantasia(cliente.nombre || cliente.nombreFantasia || "");
      setDireccion(cliente.direccion || cliente.domicilio || "");
      setLocalidad(cliente.localidad || "");
      setProvincia(cliente.provincia || "");
      actualizarClienteEnLocalStorage("id", cliente.id || "");
      actualizarClienteEnLocalStorage("clienteDuxId", cliente.clienteDuxId || "");
      actualizarClienteEnLocalStorage("razonSocial", cliente.razonSocial || cliente.cliente || "");
      actualizarClienteEnLocalStorage("email", cliente.email || cliente.correoElectronico || "");
      actualizarClienteEnLocalStorage("nombre", cliente.nombre || cliente.nombreFantasia || "");
      actualizarClienteEnLocalStorage("direccion", cliente.direccion || cliente.domicilio || "");
      actualizarClienteEnLocalStorage("localidad", cliente.localidad || "");
      actualizarClienteEnLocalStorage("provincia", cliente.provincia || "");
      actualizarClienteEnLocalStorage("transporte", cliente.transporte || "");
      actualizarClienteEnLocalStorage("formaPago", cliente.formaPago || "");
      actualizarClienteEnLocalStorage("formaEnvio", cliente.formaEnvio || "");

      if (
        (cliente.direccion || cliente.domicilio) &&
        cliente.localidad &&
        cliente.provincia
      ) {
        await autoCompletarDireccionGoogle(
          cliente.direccion || cliente.domicilio,
          cliente.localidad,
          cliente.provincia
        );
      }
      setBuscandoDatos(false);
      return;
    }

    // 4) Si no existe ni local ni Dux, buscar en padrón AFIP
    try {
      const res = await fetch(`http://localhost:8090/padron/${val}`);
      if (!res.ok) throw new Error("No se pudo consultar el padrón");
      const data = await res.json();
      setRazonSocial(data.nombre || "Sin datos");
      actualizarClienteEnLocalStorage("razonSocial", data.nombre || "Sin datos");
    } catch (err) {
      setErrorCuit("Error al consultar el padrón.");
      setRazonSocial("");
      actualizarClienteEnLocalStorage("razonSocial", "");
    }
    setBuscandoDatos(false);
  }

  async function enviarPedido() {
    setEnviando(true);
    showToast("Enviando pedido...", "loading");
    const cliente = obtenerClienteDeLocalStorage();
    const clienteId = cliente?.id;
    if (!clienteId) {
      showToast("Faltan datos del cliente. Revisá el CUIT/CUIL.", "error");
      return;
    }

    // Preparar datos para validación y envío
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
      transporte: formaEnvio()?.value === "2" ? detalleTransporte() : "",
      formaPago: formaPago()?.label || "",
      formaEnvio: formaEnvio()?.label || "",
    };

    // Validar con util
    const error = validarCarrito(datos);
    if (error) {
      showToast(error, "warning");
      setEnviando(false);
      return;
    }

    // Vincular cliente con carrito 
    await vincularSesionAnonimaACliente(clienteId);

    // Buscar carrito activo
    let carrito;
    try {
      carrito = await getCarritoActivo(Number(clienteId));
      if (!carrito || !carrito.id) throw new Error("No hay carrito activo.");
    } catch (e) {
      showToast("No se encontró un carrito activo. Volvé al paso anterior.", "error");
      return;
    }

    // Confirmar carrito
    try {
      await confirmarCarrito(carrito.id, datos);
      localStorage.removeItem("carrito");
      localStorage.removeItem("carritoId");
      localStorage.removeItem("observacionesGeneral");
      showToast(
        <>
          Pedido enviado correctamente. Podés ver tus pedidos en la sección "Mis pedidos".
          Tocando en el icono: <User size={24} class="inline align-middle" /> ubicado en la parte superior derecha de la pantalla.
        </>,
        "success",
        10000,
        () => window.location.href = "/mis-pedidos"
      );
      setTimeout(() => {
        window.location.href = "/mis-pedidos";
      }, 7000);
    } catch (err) {
      showToast("Error al confirmar el pedido. Reintentá.", "error");
      setEnviando(false);
    }
  }

  function formatearTiempo(segundos: number) {
    const min = Math.floor(segundos / 60).toString().padStart(2, "0");
    const sec = (segundos % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  }

  return (
    <>

      <div class="p-5 space-y-6 relative">
        <Show when={props.modoEdicion}>
          <div class="mb-3 p-3 bg-yellow-100 border-l-4 border-yellow-400 rounded">
            <span class="font-semibold text-yellow-800">
              Estás editando el pedido #{pedidoEditandoId() ?? ""}
            </span>
            <Show when={typeof props.tiempoRestante === "number"}>
              <span class="ml-2 text-yellow-700 text-sm">
                <p>Ahora podés agregar, quitar productos navegando por la web. Al final del pedido también vas a poder modificar la forma de entrega, o de envío, etc.</p>
                <p>Tenés 30 minutos para hacer las modificaciones que quieras. Si pasado este tiempo no confirmas los cambios, el pedido se enviará sin cambios automáticamente.</p>
                <p>Tiempo restante: {formatearTiempo(props.tiempoRestante!)}.</p>
              </span>
            </Show>
          </div>
        </Show>

        <button
          class="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded text-xs"
          onClick={props.onVolver}
        >
          ← Volver al carrito
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
              setCuit={handleCuitInput}
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

            <div class="flex gap-2 items-center">
              <div class="flex-1">
                <label class="block text-sm mb-1">Forma de entrega</label>
                <Select
                  options={opcionesEnvio}
                  format={format}
                  initialValue={formaEnvio()}
                  onChange={(opt) => {
                    setFormaEnvio(opt);
                    actualizarClienteEnLocalStorage("formaEnvio", opt);
                  }}
                  placeholder="Seleccioná una opción"
                />
              </div>
              <Show when={formaEnvio()?.value === "2"}>
                <div class="flex-1">
                  <label class="block text-sm mb-1">Expreso</label>
                  <input
                    type="text"
                    class="w-full md:w-80 px-2 py-2 border border-gray-300 rounded text-xs"
                    placeholder="Ej: Expreso X, dirección, etc."
                    autocomplete="new-password"
                    autocorrect="off"
                    spellcheck={false}
                    name="transporte"
                    value={detalleTransporte()}
                    onInput={e => {
                      setDetalleTransporte(e.currentTarget.value);
                      actualizarClienteEnLocalStorage("transporte", e.currentTarget.value);
                    }}
                  />
                </div>
              </Show>
            </div>

            <div>
              <label class="block text-sm mb-1">Forma de pago</label>
              <Select
                options={opcionesPago}
                format={format}
                initialValue={formaPago()}
                onChange={(opt) => {
                  setFormaPago(opt);
                  actualizarClienteEnLocalStorage("formaPago", opt);
                }}
                placeholder="Seleccioná una opción"
              />
            </div>
            <button
              onClick={() => {
                if (props.modoEdicion) {
                  props.onConfirmarEdicion && props.onConfirmarEdicion({
                    direccion: direccion(),
                    localidad: localidad(),
                    provincia: provincia(),
                    codigoPostal: codigoPostal(),
                    formaEnvio: formaEnvio()?.label || "",
                    formaPago: formaPago()?.label || "",
                    transporte: formaEnvio()?.value === "2" ? detalleTransporte() : "",
                  });
                } else {
                  enviarPedido();
                }
              }}
              class="mt-4 bg-black text-white px-4 py-2 rounded text-sm w-full"
              disabled={enviando() || (props.modoEdicion && props.tiempoRestante === 0)}
            >
              {enviando()
                ? (props.modoEdicion ? "Guardando cambios..." : "Enviando...")
                : (props.modoEdicion ? "Confirmar cambios" : "Enviar pedido")}
            </button>

          </>
        )}
      </div>

      <ToastContextual
        visible={toastVisible()}
        mensaje={toastMsg()}
        tipo={toastTipo()}
        onClose={handleClose}
      />

    </>
  );
}
