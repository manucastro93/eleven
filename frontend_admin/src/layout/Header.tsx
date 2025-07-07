import { useAuth } from "@/store/auth";
import { logoutAdmin } from "@/services/auth.service";
import { useNavigate } from "@solidjs/router";

export default function Header() {
  const { state, clearSession } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutAdmin();
    clearSession();
    navigate("/login", { replace: true });
  };

  return (
    <header class="flex items-center justify-between p-6 border-b border-gray-200 bg-slate-300">
      <h1 class="text-xl font-semibold text-gray-800">
        Hola {state.usuario?.nombre}
      </h1>
      <p class="text-gray-700">Bienvenido al panel de administración de Eleven Regalos.</p>
    </header>
  );
}
