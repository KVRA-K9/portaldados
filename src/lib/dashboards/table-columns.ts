import { getImportProfile, type ImportColumn } from "@/lib/import/profiles";
import type { BudgetEntryLike, DashboardConfig, DashboardTableColumn } from "./types";

/** Chave de publicação da coluna: o campo do registro ou, nas colunas derivadas
 *  (codigo_orgao, orgao, eixo_numero), a chave recalculada em `getColumnValue`. */
function columnKey(column: ImportColumn): DashboardTableColumn["key"] | undefined {
  return column.field ?? column.derivedKey;
}

/** Colunas da tabela pública: as declaradas no registry ou, na falta, todas as da
 *  planilha — inclusive as derivadas, para que a tela mostre os microdados brutos,
 *  no mesmo conjunto de colunas do arquivo exportado. */
export function getTableColumns(config: DashboardConfig): DashboardTableColumn[] {
  if (config.tableColumns) return config.tableColumns;

  return getImportProfile(config.slug)
    .columns.filter((column) => columnKey(column))
    .map((column) => ({
      key: columnKey(column)!,
      label: column.label,
      ...(column.kind === "money" ? { format: "currency" as const } : {}),
    }));
}

/** Colunas dos arquivos exportados: mantêm os cabeçalhos da planilha oficial.
 *  O registry só declara quando precisa de fidelidade extra (largura das colunas). */
export function getExportColumns(config: DashboardConfig): DashboardTableColumn[] {
  if (config.exportColumns) return config.exportColumns;

  return getImportProfile(config.slug)
    .columns.filter((column) => columnKey(column))
    .map((column) => ({
      key: columnKey(column)!,
      label: column.header,
      width: Math.min(Math.max(column.header.length + 6, 14), 60),
      ...(column.kind === "money" ? { numFmt: "#,##0.00" } : {}),
    }));
}

/** Código da unidade orçamentária no início do órgão (ex.: "715/512 - CDSA" → "715/512"). */
function agencyCode(agency: string | null | undefined): string {
  return agency?.match(/^(\d{3}\/\d{3})/)?.[1] ?? "";
}

/** Nome do órgão sem o código (ex.: "715/512 - CDSA" → "CDSA"). */
function agencyName(agency: string | null | undefined): string {
  return agency?.replace(/^\d{3}\/\d{3}\s*-\s*/, "") ?? "";
}

/** Numeral do eixo (ex.: "Eixo III – Adaptação…" → "III"). */
function categoryNumber(categoryName: string | null | undefined): string {
  return categoryName?.match(/^Eixo\s+([IVX]+)/)?.[1] ?? "";
}

/** Valor bruto de uma coluna de microdados, incluindo as derivadas. */
export function getColumnValue(
  entry: BudgetEntryLike,
  column: DashboardTableColumn
): string | number | null {
  switch (column.key) {
    case "executionRate":
      return entry.valuePlanned > 0 ? (entry.valueExecuted ?? 0) / entry.valuePlanned : 0;
    case "agencyCode":
      return agencyCode(entry.agency);
    case "agencyName":
      return agencyName(entry.agency);
    case "categoryNumber":
      return categoryNumber(entry.categoryName);
    default: {
      const value = entry[column.key];
      return value === undefined ? null : value;
    }
  }
}
