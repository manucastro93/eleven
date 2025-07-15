import ChartBase from "./ChartBase";
import type { ChartData, ChartOptions } from "chart.js";

export default function GraficoVentasMensuales() {
  const data: ChartData<"line"> = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        label: "Ventas",
        data: [80, 120, 95, 160, 130, 180],
        borderColor: "#4f46e5",
        backgroundColor: "#4f46e530",
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
      <h2 class="text-lg font-semibold mb-4">Ventas mensuales</h2>
      <ChartBase data={data} options={options} />
    </div>
  );
}
