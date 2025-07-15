import { JSX } from "solid-js";

interface Props {
  icon: JSX.Element;
  title: string;
  value: string | number;
  color?: string;
  onClick?: () => void;
}

export default function DashboardCard({ icon, title, value, color = "bg-white", onClick }: Props) {
  return (
    <div
      class={`p-4 rounded-2xl shadow hover:shadow-lg transition cursor-pointer flex items-center gap-4 ${color}`}
      onClick={onClick}
    >
      <div class="text-3xl">{icon}</div>
      <div class="flex flex-col">
        <span class="text-sm text-gray-500">{title}</span>
        <span class="text-xl font-semibold">{value}</span>
      </div>
    </div>
  );
}
