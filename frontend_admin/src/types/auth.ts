export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  rol: number;
}

export interface LoginResponse {
  usuario: Usuario;
  accessToken: string;
  permisos: {
    moduloId: number;
    moduloNombre: string;
    ruta: string;
    icono: string;
    grupo: string;
    acciones: string[];
    orden: number;
  }[];
}

export type AuthState = {
  usuario: Usuario | null;
  accessToken: string | null;
  permisos: {
    moduloId: number;
    moduloNombre: string;
    ruta: string;
    icono: string;
    grupo: string;
    orden: number;
    acciones: string[];
  }[];
};

export type AuthContextType = {
  state: AuthState;
  loading: () => boolean;
  setSession: (usuario: Usuario, token: string, permisos: any[]) => void;
  clearSession: () => void;
  setLoading: (valor: boolean) => void;
};
