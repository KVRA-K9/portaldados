import { notFound } from "next/navigation";
import { getDashboardConfig } from "@/lib/dashboards/registry";
import { getDashboardEntries } from "@/lib/dashboards/queries";
import {
  filterEntries,
  getFilterOptions,
  type DashboardFilters,
} from "@/lib/dashboards/aggregate";
import { getExportColumns, getTableColumns } from "@/lib/dashboards/table-columns";
import { FiltersPanel } from "./filters-panel";
import { DataTable } from "./data-table";
import { ExportMenu } from "./export-menu";

/** Filtros + tabela de microdados, sem cabeçalho — reaproveitado pelas páginas de
 *  microdados e de metadados. */
export async function DashboardMicrodata({
  dashboardSlug,
  filters,
}: {
  dashboardSlug: string;
  filters: DashboardFilters;
}) {
  const config = getDashboardConfig(dashboardSlug);
  if (!config) notFound();

  const allEntries = await getDashboardEntries(dashboardSlug);
  const filterOptions = Object.fromEntries(
    config.filters.map((field) => [field.key, getFilterOptions(allEntries, field.key)])
  );

  const filteredEntries = filterEntries(allEntries, filters);

  return (
    <div className="space-y-6">
      <FiltersPanel
        fields={config.filters}
        options={filterOptions}
        paletteClass={config.paletteClass}
      />

      <section className="space-y-3" aria-label="Microdados">
        <div className="flex items-center justify-between gap-2 rounded-lg border bg-card px-4 py-3 shadow-sm">
          <h2 className="text-lg font-medium">
            Microdados{" "}
            <span className="text-sm font-normal text-muted-foreground">
              ({filteredEntries.length.toLocaleString("pt-BR")} registros)
            </span>
          </h2>
          <ExportMenu
            data={filteredEntries}
            columns={getExportColumns(config)}
            filenamePrefix={
              config.exportFile?.prefix ?? `microdados_${dashboardSlug.replaceAll("-", "_")}`
            }
            dateFormat={config.exportFile?.dateFormat}
          />
        </div>
        <DataTable data={filteredEntries} tableColumns={getTableColumns(config)} />
      </section>
    </div>
  );
}
