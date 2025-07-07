import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { loginAdmin } from "@/services/auth.service";
import { useAuth } from "@/store/auth";

export default function LoginPage() {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const navigate = useNavigate();
  const { setSession } = useAuth();

  const handleLogin = async (e: Event) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginAdmin(email(), password());
      if (res) {
        setSession(res.usuario, res.accessToken, res.permisos);
        navigate("/dashboard");
      } else {
        setError("Error inesperado. Intente nuevamente.");
      }
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        class="bg-white p-10 rounded-xl shadow-xl w-full max-w-md"
        onSubmit={handleLogin}
      >
        <div class="flex justify-center mb-6">
          <img src="/img/logo.png" alt="Logo" class="max-h-16 w-auto mx-auto mb-6" />
        </div>
        <h2 class="text-center text-2xl font-semibold text-gray-800 mb-6">
          Panel de Administración
        </h2>

        <label class="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={email()}
          onInput={(e) => setEmail(e.currentTarget.value)}
          class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <label class="block text-sm font-medium text-gray-700 mb-1">
          Contraseña
        </label>
        <input
          type="password"
          value={password()}
          onInput={(e) => setPassword(e.currentTarget.value)}
          class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        {error() && <p class="text-red-600 text-sm mb-4">{error()}</p>}

        <button
          type="submit"
          class="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-700 transition"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}
