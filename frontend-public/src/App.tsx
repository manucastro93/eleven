import { createSignal, onMount } from 'solid-js';

function App() {
  const [products, setProducts] = createSignal<string[]>([]);

  onMount(async () => {
    // TODO: cargar datos del catálogo desde la API
    setProducts(['Producto de ejemplo']);
  });

  return (
    <main>
      <h1>Catálogo</h1>
      <ul>
        {products().map((p) => (
          <li>{p}</li>
        ))}
      </ul>
    </main>
  );
}

export default App;
