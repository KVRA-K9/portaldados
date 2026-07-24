"use client";

import { usePathname } from "next/navigation";
import { getDashboardConfig } from "@/lib/dashboards/registry";
import { cn } from "@/lib/utils";

/**
 * Fundo do painel administrativo, cobrindo a tela inteira (fixed).
 * Nas páginas de um orçamento, usa a imagem e a paleta desse orçamento; nas demais
 * (visão geral, usuários, minha conta), mantém o fundo neutro.
 */
export function AdminBackdrop() {
  const pathname = usePathname();
  const slug = pathname.match(/^\/admin\/([^/]+)/)?.[1];
  const config = slug ? getDashboardConfig(slug) : undefined;

  if (!config?.bannerImage) {
    // Páginas neutras (visão geral, usuários, minha conta): mesma imagem do portal
    // (junção dos três orçamentos), com o véu do portal para o texto branco ler.
    return (
      <div className="fixed inset-0 -z-10" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/paineis/hero-topo.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "saturate(1.08) contrast(1.05)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.42) 55%, rgba(0,0,0,0.30) 100%)",
          }}
        />
      </div>
    );
  }

  return (
    <div className={cn("fixed inset-0 -z-10", config.paletteClass)} aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${config.bannerImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-[var(--scrim)]" />
    </div>
  );
}
