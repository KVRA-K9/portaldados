import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import { getDashboardConfig } from "@/lib/dashboards/registry";
import { getDashboardBySlug, getDashboardDatasetMeta } from "@/lib/dashboards/queries";
import { getImportProfile } from "@/lib/import/profiles";
import { prisma } from "@/lib/prisma";
import { ImportUploader } from "@/components/admin/import-uploader";
import { ImportHistory, type ImportBatchRow } from "@/components/admin/import-history";

type PageProps = {
  params: Promise<{ dashboardSlug: string }>;
};

export const dynamic = "force-dynamic";

export default async function ImportDataPage({ params }: PageProps) {
  const { dashboardSlug } = await params;
  const config = getDashboardConfig(dashboardSlug);
  if (!config) notFound();

  const profile = getImportProfile(dashboardSlug);
  const [dashboard, meta] = await Promise.all([
    getDashboardBySlug(dashboardSlug),
    getDashboardDatasetMeta(dashboardSlug),
  ]);

  const batches = dashboard
    ? await prisma.importBatch.findMany({
        where: { dashboardId: dashboard.id },
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
          createdBy: { select: { name: true, email: true } },
          _count: { select: { entries: true } },
        },
      })
    : [];

  const historico: ImportBatchRow[] = batches.map((batch) => ({
    id: batch.id,
    fileName: batch.fileName,
    createdAt: new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(batch.createdAt),
    authorName: batch.createdBy?.name ?? batch.createdBy?.email ?? "Carga inicial (script)",
    successRows: batch.successRows,
    errorRows: batch.errorRows,
    currentRows: batch._count.entries,
  }));

  const period =
    meta?.firstYear && meta?.lastYear
      ? meta.firstYear === meta.lastYear
        ? String(meta.firstYear)
        : `${meta.firstYear}–${meta.lastYear}`
      : "—";

  return (
    // Paleta do próprio orçamento (cores dos cards, KPIs e histórico). A imagem de fundo
    // fica no backdrop do layout, cobrindo a tela inteira conforme a rota.
    <div className={cn("space-y-6", config.paletteClass)}>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Importação de dados</h1>
        <p className="text-muted-foreground">
          Envie a planilha oficial do {config.shortName} para atualizar os microdados publicados.
        </p>
      </div>

      <ImportUploader
        dashboardSlug={dashboardSlug}
        dashboardName={config.shortName}
        profile={profile}
        base={{ recordCount: meta?.recordCount ?? 0, period }}
      />

      <section aria-label="Histórico de importações" className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight text-[var(--accent-surface-foreground)]">
          Histórico de importações
        </h2>
        <ImportHistory dashboardSlug={dashboardSlug} batches={historico} />
      </section>
    </div>
  );
}
