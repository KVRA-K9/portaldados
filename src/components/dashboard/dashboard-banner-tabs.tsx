"use client";

import { useState } from "react";
import Link from "next/link";
import { Database, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { glassButton, glassButtonDisabled } from "./button-styles";
import type { DashboardConfig } from "@/lib/dashboards/types";

/** Botões menores na variante compacta (acesso rápido da home). */
const COMPACT_BTN = "px-2 py-1 text-xs";

/** Gradiente de fundo quando o orçamento não tem imagem de banner. */
const FALLBACK_GRADIENT = "linear-gradient(135deg, #0f5132 0%, #04271a 100%)";

/**
 * Variante do cartão do orçamento com abas: cada aba é um orçamento (ver `companionSlugs`
 * no registry). A aba ativa troca a imagem de fundo, o título e para onde o botão
 * "Metadados" aponta. Usada no portal e no acesso rápido da home (variante `compact`) para
 * oferecer, dentro de um mesmo cartão, a escolha entre orçamentos correlatos (ex.: Gênero e
 * Étnico-Racial).
 */
export function DashboardBannerTabs({
  tabs,
  compact = false,
}: {
  tabs: DashboardConfig[];
  compact?: boolean;
}) {
  const [active, setActive] = useState(0);
  const dashboard = tabs[active] ?? tabs[0];
  const emConstrucao = dashboard.status === "construcao";
  // Título fixo do conjunto (ex.: "Gênero e Étnico-Racial"); na falta, o da aba ativa.
  const title = tabs[0]?.tabsTitle ?? dashboard.name;

  return (
    <article className="group relative h-full overflow-hidden rounded-xl ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Camada base: gradiente constante atrás da foto — evita um "flash" transparente
          durante o crossfade quando a aba muda. */}
      <div className="absolute inset-0" style={{ background: FALLBACK_GRADIENT }} aria-hidden="true" />
      {/* A `key` pela aba ativa remonta esta camada a cada troca, disparando o crossfade
          (.tab-fade) da nova imagem sobre o gradiente base. */}
      <div
        key={dashboard.slug}
        className="tab-fade absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105"
        style={
          dashboard.bannerImage
            ? {
                backgroundImage: `url(${dashboard.bannerImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : { background: FALLBACK_GRADIENT }
        }
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/25"
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative flex flex-col",
          compact ? "min-h-[104px] gap-2 p-3.5" : "min-h-[240px] gap-4 p-5"
        )}
      >
        {/* Abas: escolhem qual orçamento o cartão apresenta. */}
        <div role="tablist" aria-label="Orçamentos" className="flex flex-wrap gap-1.5">
          {tabs.map((tab, index) => {
            const selected = index === active;
            return (
              <button
                key={tab.slug}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(index)}
                className={cn(
                  "rounded-full font-medium text-white ring-1 backdrop-blur-sm transition-colors",
                  compact ? "px-2.5 py-0.5 text-[0.6875rem]" : "px-3 py-1 text-xs",
                  selected
                    ? "bg-white/25 ring-white/40"
                    : "bg-white/10 ring-white/20 hover:bg-white/20"
                )}
              >
                {tab.shortName}
              </button>
            );
          })}
        </div>

        <div className={cn("mt-auto flex flex-col", compact ? "gap-2" : "gap-4")}>
          <h3
            className={cn(
              "text-readable font-semibold text-balance text-white",
              compact ? "text-base" : "text-xl sm:text-2xl"
            )}
          >
            {title}
          </h3>
          {/* Crossfade dos botões (que mudam de destino/estado conforme a aba ativa). */}
          <div
            key={dashboard.slug}
            className={cn("tab-fade flex flex-wrap", compact ? "gap-1.5" : "gap-2")}
          >
            <Link
              href={`/${dashboard.slug}/metadados`}
              prefetch
              className={cn(glassButton, compact && COMPACT_BTN)}
            >
              <Database className={compact ? "size-3.5" : "size-4"} aria-hidden="true" />
              Metadados
            </Link>
            {dashboard.dashboardUrl ? (
              <a
                href={dashboard.dashboardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(glassButton, compact && COMPACT_BTN)}
              >
                <LayoutDashboard className={compact ? "size-3.5" : "size-4"} aria-hidden="true" />
                {compact ? "Dashboard" : "Dashboard interativo"}
              </a>
            ) : emConstrucao ? (
              <span
                className={cn(glassButtonDisabled, compact && COMPACT_BTN)}
                aria-disabled="true"
              >
                <LayoutDashboard className={compact ? "size-3.5" : "size-4"} aria-hidden="true" />
                {compact ? "Em construção" : "Dashboard em construção"}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
