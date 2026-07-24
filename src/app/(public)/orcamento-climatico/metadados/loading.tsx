import { LoadingLogo } from "@/components/ui/loading-logo";

// Feedback imediato ao entrar na página de metadados (dinâmica, consulta o banco).
export default function MetadadosLoading() {
  return <LoadingLogo label="Carregando metadados…" />;
}
