import { LoadingLogo } from "@/components/ui/loading-logo";

// Fallback exibido na hora ao navegar entre as seções do admin (Suspense do segmento):
// dá resposta imediata enquanto a página de destino renderiza, em vez de a tela parecer travada.
export default function AdminLoading() {
  return <LoadingLogo />;
}
