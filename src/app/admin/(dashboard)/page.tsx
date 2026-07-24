import Link from "next/link";
import type { Metadata } from "next";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatTile } from "@/components/admin/stat-tile";
import { allDashboards } from "@/lib/dashboards/registry";
import { getDashboardDatasetMeta } from "@/lib/dashboards/queries";

export const metadata: Metadata = {
  title: "Visão geral",
};

export const dynamic = "force-dynamic";

function formatDate(date: Date | null | undefined): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(date);
}

export default async function AdminHomePage() {
  const dashboards = await Promise.all(
    allDashboards.map(async (dashboard) => ({
      config: dashboard,
      meta: await getDashboardDatasetMeta(dashboard.slug),
    }))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-readable text-2xl font-semibold tracking-tight text-white">
          Visão geral
        </h1>
        <p className="text-readable text-white/90">
          Estado dos dados publicados em cada orçamento temático.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {dashboards.map(({ config, meta }) => {
          const periodo =
            meta?.firstYear && meta?.lastYear
              ? meta.firstYear === meta.lastYear
                ? String(meta.firstYear)
                : `${meta.firstYear}–${meta.lastYear}`
              : "—";

          const emConstrucao = config.status === "construcao";
          const figures = config.officialFigures;

          return (
            <section
              key={config.slug}
              aria-label={config.name}
              className="overflow-hidden rounded-lg ring-1 ring-institutional-gold/30"
            >
              {/* Painel de vidro sobre a fotografia do fundo, na mesma linguagem dos
                  cartões de destaque do portal (ver .glass-surface em globals.css). */}
              <div className="glass-surface flex flex-wrap items-start justify-between gap-3 border-b p-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-medium">{config.name}</h2>
                    {emConstrucao ? <Badge variant="outline">Em construção</Badge> : null}
                  </div>
                  <p className="max-w-xl text-sm text-muted-foreground">{config.description}</p>
                  {emConstrucao && figures ? (
                    <p className="mt-1 max-w-xl text-xs text-muted-foreground">
                      Sem microdados publicados. Segundo o {figures.source}:{" "}
                      {figures.categories.length} eixos, exercícios{" "}
                      {figures.fiscalYears.join("–")}
                      {figures.projectCount ? ` e ${figures.projectCount} projetos` : ""}. Importe a
                      planilha oficial para publicar os dados.
                    </p>
                  ) : null}
                </div>
                <Button asChild size="sm">
                  <Link href={`/admin/${config.slug}/importar`}>
                    <Upload className="size-4" aria-hidden="true" />
                    Importar dados
                  </Link>
                </Button>
              </div>

              <div className="glass-surface grid gap-3 p-5 sm:grid-cols-4">
                <StatTile
                  label="Registros"
                  value={(meta?.recordCount ?? 0).toLocaleString("pt-BR")}
                />
                <StatTile label="Exercícios" value={periodo} />
                <StatTile label="Órgãos" value={meta?.agencyCount ?? 0} />
                <StatTile
                  label="Atualizado"
                  value={formatDate(meta?.lastUpdated)}
                  hint={`${meta?.categoryCount ?? 0} eixo(s)`}
                />
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
