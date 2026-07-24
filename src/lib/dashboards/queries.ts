import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { BudgetEntryLike } from "./types";

/** Tag de cache dos registros de um orçamento — invalidada nas importações (ver rotas de import). */
export function dashboardEntriesTag(slug: string) {
  return `dashboard-entries:${slug}`;
}

export async function getDashboardBySlug(slug: string) {
  return prisma.dashboard.findUnique({ where: { slug } });
}

export async function getBudgetEntryById(entryId: string) {
  return prisma.budgetEntry.findUnique({ where: { id: entryId } });
}

export async function getDashboardCategories(slug: string) {
  const dashboard = await getDashboardBySlug(slug);
  if (!dashboard) return [];
  return prisma.category.findMany({
    where: { dashboardId: dashboard.id },
    orderBy: { name: "asc" },
  });
}

export type DashboardDatasetMeta = {
  recordCount: number;
  /** Órgãos distintos com registros no conjunto de dados. */
  agencyCount: number;
  categoryCount: number;
  firstYear: number | null;
  lastYear: number | null;
  lastUpdated: Date | null;
  /** Procedência: planilha da última importação e quando ela ocorreu. */
  lastFileName: string | null;
  lastImportedAt: Date | null;
};

export async function getDashboardDatasetMeta(slug: string): Promise<DashboardDatasetMeta | null> {
  const dashboard = await getDashboardBySlug(slug);
  if (!dashboard) return null;

  const [recordCount, agencies, categoryCount, years, lastEntry, lastImport] = await Promise.all([
    prisma.budgetEntry.count({ where: { dashboardId: dashboard.id } }),
    prisma.budgetEntry.groupBy({
      by: ["agency"],
      where: { dashboardId: dashboard.id, agency: { not: null } },
    }),
    prisma.category.count({ where: { dashboardId: dashboard.id } }),
    prisma.budgetEntry.aggregate({
      where: { dashboardId: dashboard.id },
      _min: { fiscalYear: true },
      _max: { fiscalYear: true },
    }),
    prisma.budgetEntry.findFirst({
      where: { dashboardId: dashboard.id },
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    }),
    prisma.importBatch.findFirst({
      where: { dashboardId: dashboard.id },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true, fileName: true },
    }),
  ]);

  const candidates = [lastEntry?.updatedAt, lastImport?.createdAt].filter(
    (d): d is Date => d instanceof Date
  );
  const lastUpdated =
    candidates.length > 0
      ? candidates.reduce((a, b) => (a > b ? a : b))
      : null;

  return {
    recordCount,
    agencyCount: agencies.filter((row) => row.agency?.trim()).length,
    categoryCount,
    firstYear: years._min.fiscalYear ?? null,
    lastYear: years._max.fiscalYear ?? null,
    lastUpdated,
    lastFileName: lastImport?.fileName ?? null,
    lastImportedAt: lastImport?.createdAt ?? null,
  };
}

export async function getDashboardEntries(slug: string): Promise<BudgetEntryLike[]> {
  // As páginas de metadados/microdados são dinâmicas (usam searchParams), mas a leitura pesada dos
  // registros é reaproveitada entre requisições pelo data cache do Next — evitando ir ao banco (e o
  // "cold start" do Neon) a cada acesso. Invalidado nas importações via revalidateTag; e revalida
  // sozinho a cada 60 s como rede de segurança (dados só mudam por importação da equipe).
  return unstable_cache(
    async (): Promise<BudgetEntryLike[]> => {
      const dashboard = await prisma.dashboard.findUnique({
        where: { slug, isActive: true },
      });

      if (!dashboard) return [];

      const entries = await prisma.budgetEntry.findMany({
        where: { dashboardId: dashboard.id },
        include: { category: true },
        orderBy: [{ fiscalYear: "asc" }],
      });

      return entries.map((entry) => ({
        id: entry.id,
        fiscalYear: entry.fiscalYear,
        categoryName: entry.category?.name ?? "Sem categoria",
        fundingSource: entry.fundingSource,
        region: entry.region,
        agency: entry.agency,
        managementUnit: entry.managementUnit,
        program: entry.program,
        action: entry.action,
        description: entry.description,
        valuePlanned: Number(entry.valuePlanned),
        valueCommitted: entry.valueCommitted !== null ? Number(entry.valueCommitted) : null,
        valueExecuted: entry.valueExecuted !== null ? Number(entry.valueExecuted) : null,
        valuePaid: entry.valuePaid !== null ? Number(entry.valuePaid) : null,
      }));
    },
    ["dashboard-entries", slug],
    { revalidate: 60, tags: [dashboardEntriesTag(slug)] }
  )();
}
