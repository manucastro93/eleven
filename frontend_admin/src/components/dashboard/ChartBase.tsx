import { onCleanup, onMount } from "solid-js";
import Chart from "chart.js/auto";
import type { ChartData, ChartOptions } from "chart.js";

interface Props {
  data: ChartData<"line">;
  options?: ChartOptions<"line">;
}

export default function ChartBase(props: Props) {
  let canvasRef: HTMLCanvasElement | undefined;
  let chartInstance: Chart | undefined;

  onMount(() => {
    if (!canvasRef) return;
    chartInstance = new Chart(canvasRef, {
      type: "line",
      data: props.data,
      options: props.options,
    });
  });

  onCleanup(() => {
    chartInstance?.destroy();
  });

  return <canvas ref={canvasRef} class="w-full h-full" />;
}
