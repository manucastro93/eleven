import { createSignal } from "solid-js";
import Sidebar from "@/layout/Sidebar";
import Header from "@/layout/Header";
import ToastManager from "@/components/ui/ToastManager";

export default function AdminLayout(props: { children: any }) {
  const [sidebarOpen, setSidebarOpen] = createSignal(false);

  return (
    <div class="flex max-h-screen bg-fondo">
      <Sidebar sidebarOpen={sidebarOpen()} setSidebarOpen={setSidebarOpen} />
      <div class="flex-1 flex flex-col min-h-screen">
        <div class="md:hidden">
          <button
            class="m-4 p-2 bg-gray-800 text-white rounded"
            onClick={() => setSidebarOpen(true)}
          >
            ☰ Menú
          </button>
        </div>
        <Header />
        <main class="flex-1 p-6 max-h-screen overflow-y-auto">
          {props.children}
        </main>
      </div>
      <ToastManager />
    </div>
  );
}

