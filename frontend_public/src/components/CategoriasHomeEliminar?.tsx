import { Component } from 'solid-js';
import { A } from '@solidjs/router';
import { log } from '@/utils/log';

type Categoria = {
  nombre: string;
  icono: string;
  color: string;
  texto: string;
};

type VerTodas = {
  nombre: 'Ver todas';
  icono: null;
};

const categorias: (Categoria | VerTodas)[] = [
  { nombre: 'Antiadherente', icono: '/img/iconos/categorias/antiadherente.svg', color: 'bg-[#e6f0e6]', texto: 'text-[#3a593a]' },
  { nombre: 'Artículos Cerveceros', icono: '/img/iconos/categorias/art-cerv.svg', color: 'bg-[#fff2e5]', texto: 'text-[#aa5b1f]' },
  { nombre: 'Marroquinería', icono: '/img/iconos/categorias/marroquineria.svg', color: 'bg-[#e8e8f5]', texto: 'text-[#434377]' },
  { nombre: 'Cuadros y Portallaves', icono: '/img/iconos/categorias/cuadryportallaves.svg', color: 'bg-[#fffbe5]', texto: 'text-[#a18100]' },
  { nombre: 'Ver todas', icono: null },
];

const CategoriasHome: Component = () => {
  return (
    <section class="mt-8 px-4">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center">
        {categorias.map((cat) => {
          const isVerTodas = cat.nombre === 'Ver todas';
          const categoria = cat as Categoria;

          const href = isVerTodas ? '/productos' : `/productos/categoria/${cat.nombre.toLowerCase()}`;

          return (
            <A
              href={href}
              onClick={() => log('click_categoria', { categoria: cat.nombre })}
              class="flex flex-col items-center hover:scale-105 transition-transform"
            >
              <div
                class={`w-24 h-24 md:w-28 md:h-28 ${
                  isVerTodas ? 'bg-white border border-[#ddd] shadow-sm' : `${categoria.color} shadow-md`
                } rounded-full flex items-center justify-center`}
              >
                {isVerTodas ? (
                  <svg
                    class="w-8 h-8 md:w-10 md:h-10 text-[#b8860b]"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                ) : (
                  <img src={categoria.icono} class="w-10 h-10 md:w-14 md:h-14" alt={categoria.nombre} />
                )}
              </div>
              <span
                class={`mt-2 text-sm md:text-base font-medium ${
                  isVerTodas ? 'text-[#b8860b]' : categoria.texto
                }`}
              >
                {cat.nombre}
              </span>
            </A>
          );
        })}
      </div>
    </section>
  );
};

export default CategoriasHome;
