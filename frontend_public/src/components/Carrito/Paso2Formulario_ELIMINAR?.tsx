import { createSignal, Show, For } from 'solid-js';
import { useCarrito } from '@/store/carrito';
import { useDireccionAutocomplete } from '@/hooks/useDireccion';

export default function Paso2Formulario() {
  const { setPasoCarrito } = useCarrito();

  const [nombre, setNombre] = createSignal(localStorage.getItem('nombre') || '');
  const [empresa, setEmpresa] = createSignal('');
  const [email, setEmail] = createSignal(localStorage.getItem('email') || '');
  const [cuit, setCuit] = createSignal('');
  const [telefono, setTelefono] = createSignal(localStorage.getItem('telefono') || '');
  const [direccion, setDireccion] = createSignal('');
  const [localidad, setLocalidad] = createSignal('');
  const [provincia, setProvincia] = createSignal('');
  const [codigoPostal, setCodigoPostal] = createSignal('');
  const [transporte, setTransporte] = createSignal('');
  const [mostrarSugerencias, setMostrarSugerencias] = createSignal(true);
  const [errorDireccion, setErrorDireccion] = createSignal(false);

  const { direcciones, bloquear } = useDireccionAutocomplete(direccion);

  const handleSelectDireccion = (dir: any) => {
    const calle = dir.properties.street || '';
    const altura = dir.properties.housenumber || '';

    if (!calle || !altura) {
      setErrorDireccion(true);
      setTimeout(() => setErrorDireccion(false), 3000);
      return;
    }

    setDireccion(dir.properties.formatted);
    setCodigoPostal(dir.properties.postcode || '');

    const loc =
      dir.properties.suburb ||
      dir.properties.city_district ||
      dir.properties.town ||
      dir.properties.village ||
      dir.properties.city ||
      '';

    const prov =
      dir.properties.city === 'Buenos Aires'
        ? 'Ciudad Autónoma de Buenos Aires'
        : dir.properties.state || dir.properties.region || '';

    setLocalidad(loc);
    setProvincia(prov);

    bloquear();
    setMostrarSugerencias(false);
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    if (!nombre().trim() || !email().trim() || !cuit().trim() || !direccion().trim() || !localidad().trim() || !provincia().trim()) {
      alert('Completá todos los campos obligatorios');
      return;
    }

    localStorage.setItem('nombre', nombre());
    localStorage.setItem('email', email());
    localStorage.setItem('telefono', telefono());

    console.log('Enviar pedido:', {
      nombre: nombre(),
      empresa: empresa(),
      email: email(),
      cuit: cuit(),
      direccion: direccion(),
      localidad: localidad(),
      provincia: provincia(),
      codigoPostal: codigoPostal(),
      telefono: telefono(),
      transporte: transporte(),
    });
  };

  const inputBase = "w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#b8860b] bg-white";

  return (
    <form class="space-y-3" onSubmit={handleSubmit}>
      <input type="text" placeholder="CUIT / CUIL *" value={cuit()} onInput={(e) => setCuit(e.currentTarget.value)} autocomplete="off" class={inputBase} />
      <input type="text" placeholder="Nombre *" value={nombre()} onInput={(e) => setNombre(e.currentTarget.value)} autocomplete="off" class={inputBase} />
      <input type="text" placeholder="Empresa o Local" value={empresa()} onInput={(e) => setEmpresa(e.currentTarget.value)} autocomplete="off" class={inputBase} />
      <input type="email" placeholder="Email *" value={email()} onInput={(e) => setEmail(e.currentTarget.value)} autocomplete="off" class={inputBase} />

      <div>
        <input
          type="text"
          placeholder="Dirección *"
          value={direccion()}
          autocomplete="off"
          onInput={(e) => {
            setDireccion(e.currentTarget.value);
            setMostrarSugerencias(true);
          }}
          class={`${inputBase} ${errorDireccion() ? 'border-red-500' : ''}`}
        />
        <Show when={errorDireccion()}>
          <p class="text-sm text-red-500 mt-1">Seleccioná una dirección válida con altura.</p>
        </Show>
      </div>

      <Show when={mostrarSugerencias() && direcciones()?.length}>
        <ul class="border bg-white rounded text-sm max-h-40 overflow-y-auto">
          <For each={direcciones() || []}>{(dir) => (
            <li class="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelectDireccion(dir)}>
              {dir.properties.formatted}
            </li>
          )}</For>
        </ul>
      </Show>

      <input type="text" placeholder="Localidad *" value={localidad()} readOnly autocomplete="off" class={`${inputBase} bg-gray-100 cursor-not-allowed`} />
      <input type="text" placeholder="Provincia *" value={provincia()} readOnly autocomplete="off" class={`${inputBase} bg-gray-100 cursor-not-allowed`} />
      <input type="text" placeholder="Código Postal" value={codigoPostal()} disabled class={`${inputBase} bg-gray-100`} />
      <input type="text" placeholder="Teléfono" value={telefono()} onInput={(e) => setTelefono(e.currentTarget.value)} autocomplete="off" class={inputBase} />
      <input type="text" placeholder="Transporte habitual" value={transporte()} onInput={(e) => setTransporte(e.currentTarget.value)} autocomplete="off" class={inputBase} />

      <button type="submit" class="bg-[#b8860b] hover:bg-[#a07408] text-white font-semibold py-2 px-4 rounded w-full transition">Enviar pedido</button>
      <button type="button" onClick={() => setPasoCarrito(1)} class="text-sm text-gray-500 underline mt-2">← Volver al carrito</button>
    </form>
  );
}