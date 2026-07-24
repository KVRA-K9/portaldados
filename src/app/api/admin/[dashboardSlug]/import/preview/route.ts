import { NextResponse } from "next/server";
import { getActiveSession } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";
import { getDashboardBySlug } from "@/lib/dashboards/queries";
import { parseSpreadsheetFile } from "@/lib/import/parse-file";
import { getImportProfile } from "@/lib/import/profiles";
import { validateImportRows } from "@/lib/import/validate-rows";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ dashboardSlug: string }> }
) {
  const session = await getActiveSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado ou conta desativada." }, { status: 401 });
  }

  const { dashboardSlug } = await params;
  const dashboard = await getDashboardBySlug(dashboardSlug);
  if (!dashboard) {
    return NextResponse.json({ error: "Dashboard não encontrado." }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
  }

  // Correção feita na tela quando a planilha renomeia uma coluna esperada.
  let columnMap: Record<string, string> = {};
  const rawMap = formData.get("columnMap");
  if (typeof rawMap === "string" && rawMap.trim() !== "") {
    try {
      const parsedMap = JSON.parse(rawMap) as unknown;
      if (parsedMap && typeof parsedMap === "object") {
        columnMap = Object.fromEntries(
          Object.entries(parsedMap as Record<string, unknown>)
            .filter(([, value]) => typeof value === "string" && value !== "")
            .map(([key, value]) => [key, String(value)])
        );
      }
    } catch {
      return NextResponse.json({ error: "Mapeamento de colunas inválido." }, { status: 400 });
    }
  }

  const profile = getImportProfile(dashboardSlug);

  let parsed;
  try {
    parsed = await parseSpreadsheetFile(file, profile.sheetName);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível ler o arquivo.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (parsed.rows.length === 0) {
    return NextResponse.json({ error: "A planilha não contém linhas de dados." }, { status: 400 });
  }

  const outcome = validateImportRows(parsed.rows, profile, parsed.headers, columnMap);
  const validRows = outcome.rows.flatMap((row) => (row.status === "valid" ? [row.data] : []));

  // Linhas repetidas dentro do próprio arquivo — costuma indicar exportação duplicada.
  // Guarda o número da linha das repetições (da segunda em diante) para a tela poder ignorá-las.
  const seen = new Set<string>();
  const duplicateRowNumbers: number[] = [];
  for (const row of outcome.rows) {
    if (row.status !== "valid") continue;
    const { fiscalYear, agency, categoryName, action } = row.data;
    const key = [fiscalYear, agency, categoryName, action].join("|");
    if (seen.has(key)) duplicateRowNumbers.push(row.rowNumber);
    else seen.add(key);
  }
  const duplicateRows = duplicateRowNumbers.length;

  const fiscalYears = [...new Set(validRows.map((row) => row.fiscalYear))].sort();

  // Quantos registros já publicados seriam substituídos por estes exercícios.
  const existingInYears = await prisma.budgetEntry.count({
    where: { dashboardId: dashboard.id, fiscalYear: { in: fiscalYears } },
  });

  // Resumo do que será publicado, para conferência antes de confirmar.
  const summary = {
    fiscalYears,
    categoryCount: new Set(validRows.map((row) => row.categoryName)).size,
    agencyCount: new Set(validRows.map((row) => row.agency).filter(Boolean)).size,
    totalPlanned: validRows.reduce((sum, row) => sum + row.valuePlanned, 0),
    duplicateRows,
    duplicateRowNumbers,
    existingInYears,
  };

  return NextResponse.json({
    fileName: file.name,
    totalRows: outcome.rows.length,
    validCount: validRows.length,
    invalidCount: outcome.rows.length - validRows.length,
    recognizedColumns: outcome.recognizedColumns,
    missingColumns: outcome.missingColumns,
    extraColumns: outcome.extraColumns,
    summary,
    rows: outcome.rows,
  });
}
