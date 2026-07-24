import { budgetEntryImportRowSchema, type BudgetEntryImportRow } from "@/lib/schemas/budget-entry";
import type { ImportProfile } from "./profiles";
import type { RawImportRow } from "./parse-file";

export type RowValidationResult =
  | { rowNumber: number; status: "valid"; data: BudgetEntryImportRow }
  | { rowNumber: number; status: "invalid"; errors: string[]; raw: RawImportRow };

export type ValidationOutcome = {
  /** Colunas do perfil encontradas no arquivo. */
  recognizedColumns: string[];
  /** Colunas obrigatórias que faltaram — o erro é do arquivo, não das linhas. */
  missingColumns: string[];
  /** Colunas do arquivo que o perfil não conhece (apenas informativo). */
  extraColumns: string[];
  rows: RowValidationResult[];
};

/** Aceita "1.234.567,89" (pt-BR) e "1234567.89" (exportações). */
function parseMoney(value: string): string {
  const text = value.trim();
  if (text === "") return "";
  const hasComma = text.includes(",");
  return hasComma ? text.replace(/\./g, "").replace(",", ".") : text;
}

export function validateImportRows(
  rawRows: RawImportRow[],
  profile: ImportProfile,
  fileHeaders: string[],
  /** Cabeçalho esperado → cabeçalho presente no arquivo, quando a planilha renomeia colunas. */
  columnMap: Record<string, string> = {}
): ValidationOutcome {
  const headers = fileHeaders.map((header) => header.trim());
  const profileHeaders = profile.columns.map((column) => column.header);

  /** Cabeçalho de onde ler o valor: o do perfil ou o mapeado manualmente. */
  const sourceHeader = (header: string) => columnMap[header] ?? header;
  const isPresent = (header: string) => headers.includes(sourceHeader(header));

  const recognizedColumns = profileHeaders.filter(isPresent);
  const missingColumns = profile.columns
    .filter((column) => column.required && !isPresent(column.header))
    .map((column) => column.header);
  const mappedSources = Object.values(columnMap);
  const extraColumns = headers.filter(
    (header) =>
      header !== "" && !profileHeaders.includes(header) && !mappedSources.includes(header)
  );

  // Sem uma coluna obrigatória não faz sentido reprovar linha a linha.
  if (missingColumns.length > 0) {
    return { recognizedColumns, missingColumns, extraColumns, rows: [] };
  }

  const rows = rawRows.map((raw, index) => {
    const rowNumber = index + 2; // +1 do cabeçalho, +1 porque a planilha começa em 1
    const mapped: Record<string, string | undefined> = {};

    for (const column of profile.columns) {
      if (!column.field) continue; // coluna aceita e ignorada
      const value = (raw[sourceHeader(column.header)] ?? "").trim();
      if (value === "") continue;
      mapped[column.field] = column.kind === "money" ? parseMoney(value) : value;
    }

    const parsed = budgetEntryImportRowSchema.safeParse(mapped);
    if (parsed.success) {
      return { rowNumber, status: "valid" as const, data: parsed.data };
    }

    return {
      rowNumber,
      status: "invalid" as const,
      errors: parsed.error.issues.map((issue) => {
        const field = String(issue.path[0] ?? "");
        const column = profile.columns.find((c) => c.field === field);
        return `${column?.header ?? field}: ${issue.message}`;
      }),
      raw,
    };
  });

  return { recognizedColumns, missingColumns, extraColumns, rows };
}
