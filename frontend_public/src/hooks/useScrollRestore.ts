import { onCleanup, onMount } from 'solid-js';

export function useScrollRestore(key: string = 'scrollY') {
  onMount(() => {
    const y = sessionStorage.getItem(key);
    if (y) {
      setTimeout(() => window.scrollTo(0, parseInt(y)), 30);
    }
  });

  onCleanup(() => {
    sessionStorage.setItem(key, window.scrollY.toString());
  });
}
