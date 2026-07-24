import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getDashboardConfig } from "@/lib/dashboards/registry";
import type { DashboardFilters } from "@/lib/dashboards/aggregate";
import { DashboardMicrodata } from "./dashboard-microdata";
import { cn } from "@/lib/utils";

export async function DashboardShell({
  dashboardSlug,
  filters,
}: {
  dashboardSlug: string;
  filters: DashboardFilters;
}) {
  const config = getDashboardConfig(dashboardSlug);
  if (!config) notFound();

  return (
    <div className={cn("mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6", config.paletteClass)}>
      <nav aria-label="Trilha de navegação" className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Início
        </Link>
        <ChevronRight className="size-3.5" aria-hidden="true" />
        <span className="text-foreground">Microdados</span>
      </nav>

      <header className="space-y-2">
        <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          Microdados
        </span>
        <h1 className="text-3xl font-semibold tracking-tight">{config.name}</h1>
        <p className="max-w-3xl text-muted-foreground">
          Dados brutos (microdados) do orçamento, registro a registro, como publicados pela
          equipe técnica a partir da planilha oficial. Filtre e baixe os dados em CSV ou
          Excel. As análises e os gráficos tratados estão no site do orçamento.
        </p>
      </header>

      <DashboardMicrodata dashboardSlug={dashboardSlug} filters={filters} />
    </div>
  );
}
