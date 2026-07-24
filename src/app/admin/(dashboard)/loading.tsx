// Fallback exibido na hora ao navegar entre as seções do admin (Suspense do segmento):
// dá resposta imediata enquanto a página de destino renderiza, em vez de a tela parecer travada.
// O logo do Governo do Acre é "construído" — revelado de baixo para cima, em loop (ver globals.css).
export default function AdminLoading() {
  return (
    <div
      className="flex min-h-[50vh] items-center justify-center"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-3 rounded-xl bg-background/90 px-8 py-6 shadow-sm backdrop-blur">
        <div className="relative">
          {/* Base esmaecida: o "contorno" do logo, sempre visível. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-governo-acre-horizontal.webp"
            alt=""
            aria-hidden="true"
            className="h-14 w-auto opacity-15"
          />
          {/* Versão cheia, revelada de baixo para cima em loop (efeito de construção). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-governo-acre-horizontal.webp"
            alt="Governo do Estado do Acre"
            className="logo-build-fill absolute left-0 top-0 h-14 w-auto"
          />
        </div>
        <span className="text-xs font-medium text-muted-foreground">Carregando…</span>
      </div>
    </div>
  );
}
