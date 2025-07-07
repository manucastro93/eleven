import { createContext, useContext, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { Usuario, AuthState, AuthContextType } from "@/types/auth";

const AuthContext = createContext<AuthContextType>();

export function AuthProvider(props: { children: any }) {
  const [state, setState] = createStore<AuthState>({
    usuario: JSON.parse(localStorage.getItem('usuario') || 'null'),
    accessToken: localStorage.getItem('accessToken') || null,
    permisos: JSON.parse(localStorage.getItem('permisos') || '[]')
  });

  const [loading, setLoadingSignal] = createSignal(true);

  const setSession = (usuario: Usuario, token: string, permisos: any[]) => {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('accessToken', token);
    localStorage.setItem('permisos', JSON.stringify(permisos));

    setState({ usuario, accessToken: token, permisos });
  };

  const clearSession = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('permisos');

    setState({ usuario: null, accessToken: null, permisos: [] });
  };

  const setLoading = (valor: boolean) => {
    setLoadingSignal(valor);
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        loading, // 👈 PASAMOS EL SIGNAL, no el valor
        setSession,
        clearSession,
        setLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}
