import { createSignal } from "solid-js";
import Sidebar from "@/layout/Sidebar";
import Header from "@/layout/Header";

export default function AdminLayout(props: { children: any }) {
  const [sidebarOpen, setSidebarOpen] = createSignal(false);

  return (
    <div class="min-h-screen flex flex-col md:flex-row">
      <Sidebar sidebarOpen={sidebarOpen()} setSidebarOpen={setSidebarOpen} />

      <div class="flex-1 flex flex-col bg-white">
        <div class="md:hidden">
          <button
            class="m-4 p-2 bg-gray-800 text-white rounded"
            onClick={() => setSidebarOpen(true)}
          >
            ☰ Menú
          </button>
        </div>

        <Header />

        <main class="flex-1 p-6">
          {props.children}
        </main>
      </div>
    </div>
  );
}
