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
 * Cartão do orçamento com a foto do painel ao fundo — usado nos painéis temáticos
 * do portal e no acesso rápido da home (variante `compact`).
 */
export function DashboardBannerCard({
  dashboard,
  compact = false,
}: {
  dashboard: DashboardConfig;
  compact?: boolean;
}) {
  const emConstrucao = dashboard.status === "construcao";

  return (
    <article className="group relative h-full overflow-hidden rounded-xl ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div
        className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105"
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
          "relative flex flex-col justify-between",
          compact ? "min-h-[104px] gap-2 p-3.5" : "min-h-[240px] gap-4 p-5"
        )}
      >
        <h3
          className={cn(
            "text-readable font-semibold text-white text-balance",
            compact ? "text-base" : "text-xl sm:text-2xl"
          )}
        >
          {compact ? dashboard.shortName : dashboard.name}
        </h3>
        <div className={cn("flex flex-wrap", compact ? "gap-1.5" : "gap-2")}>
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
    </article>
  );
}
