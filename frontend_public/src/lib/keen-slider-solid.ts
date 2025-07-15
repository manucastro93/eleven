import { onCleanup } from "solid-js";
import KeenSlider, { KeenSliderOptions, KeenSliderPlugin, KeenSliderInstance } from "keen-slider";

export function createSlider(
  options?: KeenSliderOptions,
  plugins?: KeenSliderPlugin[]
): [(el: HTMLElement) => void, () => KeenSliderInstance | undefined] {
  let sliderInstance: KeenSliderInstance | undefined;

  const sliderRef = (el: HTMLElement) => {
    if (!el) return;
    sliderInstance = new KeenSlider(el, options, plugins);
    onCleanup(() => sliderInstance?.destroy());
  };

  return [sliderRef, () => sliderInstance];
}
