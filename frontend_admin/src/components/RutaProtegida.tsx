import { JSX } from "solid-js";
import { useAuth } from "@/store/auth";
import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";

export default function RutaProtegida(props: { children: JSX.Element }) {
  const { state } = useAuth();
  const navigate = useNavigate();

  onMount(() => {
    if (!state.accessToken) {
      navigate("/login", { replace: true });
    }
  });

  return <>{state.accessToken ? props.children : null}</>;
}
