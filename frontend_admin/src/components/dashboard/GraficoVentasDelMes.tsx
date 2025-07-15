import ChartBase from "./ChartBase";
import type { ChartData, ChartOptions } from "chart.js";

export default function GraficoVentasDelMes() {
  // Simula ventas por día
  const dias = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0"));
  const dataVentas = dias.map(() => Math.floor(Math.random() * 10000) + 2000); // entre $2000 y $12000

  const data: ChartData<"line"> = {
    labels: dias,
    datasets: [
      {
        label: "Ventas diarias",
        data: dataVentas,
        borderColor: "#10b981", // verde
        backgroundColor: "#10b98130",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div class="bg-white p-4 rounded-2xl shadow col-span-2">
      <h2 class="text-lg font-semibold mb-4">Ventas del mes actual</h2>
      <ChartBase data={data} options={options} />
    </div>
  );
}
