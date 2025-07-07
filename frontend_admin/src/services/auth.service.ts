import { apiFetch } from "./api";
import { LoginResponse } from "@/types/auth";

export async function loginAdmin(email: string, password: string) {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logoutAdmin() {
  return apiFetch("/auth/logout", { method: "POST" });
}

export async function refreshToken() {
  return apiFetch("/auth/refresh");
}


export async function intentarRecuperarSesion(): Promise<LoginResponse | null> {
  try {
    const res = await apiFetch<LoginResponse>("/auth/refresh", { method: "GET" });
    return res ?? null; // ✅ aseguro que sea LoginResponse o null, nunca undefined/void
  } catch {
    return null;
  }
}