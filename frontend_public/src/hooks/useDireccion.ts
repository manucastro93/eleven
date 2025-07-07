import { createResource, Accessor, createSignal, createEffect } from "solid-js";

const API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY;

export function useDireccionAutocomplete(query: Accessor<string>) {
  const [debouncedQuery, setDebouncedQuery] = createSignal("");
  const [bloqueoActivo, setBloqueoActivo] = createSignal(false);

  createEffect(() => {
    const q = query();
    if (!q || q.trim().length < 3 || bloqueoActivo()) return;
    const timer = setTimeout(() => {
      setDebouncedQuery(q);
    }, 400);
    return () => clearTimeout(timer);
  });

  const fetchDirecciones = async (q: string) => {
    if (!q || q.trim().length < 3) return [];

    const res = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(q)}&lang=es&limit=5&filter=countrycode:ar&apiKey=${API_KEY}`
    );
    const data = await res.json();
    return data.features || [];
  };

  const [direcciones] = createResource(() => debouncedQuery(), fetchDirecciones);

  const bloquear = () => {
    setBloqueoActivo(true);
    setTimeout(() => setBloqueoActivo(false), 600);
  };

  return { direcciones, bloquear };
}
