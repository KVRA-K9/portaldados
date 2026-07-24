import type { BudgetEntryLike } from "./types";

export type DashboardFilters = {
  fiscalYear?: string;
  categoryName?: string;
  region?: string;
  fundingSource?: string;
  agency?: string;
};

/** Lê os filtros do dashboard a partir dos search params da rota. */
export function parseDashboardFilters(params: {
  [key: string]: string | string[] | undefined;
}): DashboardFilters {
  const read = (key: keyof DashboardFilters) =>
    typeof params[key] === "string" ? (params[key] as string) : undefined;

  return {
    fiscalYear: read("fiscalYear"),
    categoryName: read("categoryName"),
    region: read("region"),
    fundingSource: read("fundingSource"),
    agency: read("agency"),
  };
}

export function filterEntries(
  entries: BudgetEntryLike[],
  filters: DashboardFilters
): BudgetEntryLike[] {
  return entries.filter((entry) => {
    if (filters.fiscalYear && String(entry.fiscalYear) !== filters.fiscalYear) return false;
    if (filters.categoryName && entry.categoryName !== filters.categoryName) return false;
    if (filters.region && entry.region !== filters.region) return false;
    if (filters.fundingSource && entry.fundingSource !== filters.fundingSource) return false;
    if (filters.agency && entry.agency !== filters.agency) return false;
    return true;
  });
}

export function getFilterOptions(
  entries: BudgetEntryLike[],
  field: keyof Pick<
    BudgetEntryLike,
    "fiscalYear" | "categoryName" | "region" | "fundingSource" | "agency"
  >
): string[] {
  const values = new Set<string>();
  for (const entry of entries) {
    const value = entry[field];
    if (value !== null && value !== undefined && value !== "") {
      values.add(String(value));
    }
  }
  return Array.from(values).sort();
}
