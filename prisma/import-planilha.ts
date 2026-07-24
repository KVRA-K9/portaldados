/**
 * Carga de microdados a partir da planilha oficial de um orçamento, usando o mesmo perfil
 * de colunas e as mesmas validações da tela de importação (src/lib/import).
 *
 *   npm run import:clima
 *   npm run import:ocad
 *   npx tsx prisma/import-planilha.ts <slug> "caminho/para/planilha.xlsx"
 */
import "dotenv/config";
import path from "node:path";
import ExcelJS from "exceljs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { getImportProfile } from "../src/lib/import/profiles";
import { validateImportRows } from "../src/lib/import/validate-rows";
import type { RawImportRow } from "../src/lib/import/parse-file";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DASHBOARD_NAMES: Record<string, { name: string; colorTheme: string; description: string }> = {
  "orcamento-climatico": {
    name: "Orçamento Climático",
    colorTheme: "climatico",
    description:
      "Acompanhamento dos recursos públicos destinados a ações de mitigação e adaptação às mudanças climáticas no Estado do Acre.",
  },
  "orcamento-crianca-adolescente": {
    name: "Orçamento Criança e Adolescente",
    colorTheme: "crianca-adolescente",
    description:
      "Acompanhamento dos recursos públicos destinados a políticas voltadas à primeira infância, crianças e adolescentes no Estado do Acre.",
  },
};

function cellToText(cell: ExcelJS.CellValue): string {
  if (cell === null || cell === undefined) return "";
  if (typeof cell === "object") {
    if ("result" in cell) return String(cell.result ?? "").trim();
    if ("text" in cell) return String(cell.text ?? "").trim();
  }
  return String(cell).trim();
}

async function readWorkbook(filePath: string, sheetName?: string) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const sheet = (sheetName ? workbook.getWorksheet(sheetName) : null) ?? workbook.worksheets[0];
  if (!sheet) throw new Error(`Planilha sem abas: ${filePath}`);

  const headers = (sheet.getRow(1).values as ExcelJS.CellValue[]).slice(1).map(cellToText);

  const rows: RawImportRow[] = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const values = row.values as ExcelJS.CellValue[];
    const entry: RawImportRow = {};
    headers.forEach((header, index) => {
      entry[header] = cellToText(values[index + 1]);
    });
    if (Object.values(entry).some((value) => value !== "")) rows.push(entry);
  });

  return { headers, rows };
}

async function main() {
  const [slug, file] = process.argv.slice(2);
  if (!slug || !file) {
    throw new Error('Uso: tsx prisma/import-planilha.ts <slug> "caminho/planilha.xlsx"');
  }

  const filePath = path.resolve(file);
  const profile = getImportProfile(slug);
  const { headers, rows: rawRows } = await readWorkbook(filePath, profile.sheetName);
  const outcome = validateImportRows(rawRows, profile, headers);

  if (outcome.missingColumns.length > 0) {
    throw new Error(`Colunas obrigatórias ausentes: ${outcome.missingColumns.join(", ")}`);
  }

  const validRows = outcome.rows.flatMap((row) => (row.status === "valid" ? [row.data] : []));
  const invalidRows = outcome.rows.filter((row) => row.status === "invalid");
  if (validRows.length === 0) throw new Error("Nenhuma linha válida na planilha.");

  const meta = DASHBOARD_NAMES[slug];
  const dashboard = await prisma.dashboard.upsert({
    where: { slug },
    update: { isActive: true },
    create: {
      slug,
      name: meta?.name ?? slug,
      description: meta?.description,
      colorTheme: meta?.colorTheme,
      isActive: true,
    },
  });

  const fiscalYears = [...new Set(validRows.map((row) => row.fiscalYear))].sort();

  const categoryNames = [...new Set(validRows.map((row) => row.categoryName))].sort();
  const existing = await prisma.category.findMany({
    where: { dashboardId: dashboard.id, name: { in: categoryNames } },
  });
  const categoryIdByName = new Map(existing.map((category) => [category.name, category.id]));
  for (const name of categoryNames.filter((name) => !categoryIdByName.has(name))) {
    const created = await prisma.category.create({ data: { dashboardId: dashboard.id, name } });
    categoryIdByName.set(name, created.id);
  }

  // Mesmo comportamento padrão da tela: substitui os exercícios contidos no arquivo.
  const { count: removed } = await prisma.budgetEntry.deleteMany({
    where: { dashboardId: dashboard.id, fiscalYear: { in: fiscalYears } },
  });

  const batch = await prisma.importBatch.create({
    data: {
      dashboardId: dashboard.id,
      fileName: path.basename(filePath),
      status: "COMMITTED",
      totalRows: outcome.rows.length,
      successRows: validRows.length,
      errorRows: invalidRows.length,
    },
  });

  await prisma.budgetEntry.createMany({
    data: validRows.map((row) => ({
      dashboardId: dashboard.id,
      categoryId: categoryIdByName.get(row.categoryName)!,
      importBatchId: batch.id,
      fiscalYear: row.fiscalYear,
      agency: row.agency,
      managementUnit: row.managementUnit,
      region: row.region,
      fundingSource: row.fundingSource,
      program: row.program,
      action: row.action,
      description: row.description,
      valuePlanned: row.valuePlanned,
      valueCommitted: row.valueCommitted,
      valueExecuted: row.valueExecuted,
      valuePaid: row.valuePaid,
    })),
  });

  const total = validRows.reduce((sum, row) => sum + row.valuePlanned, 0);
  console.log(`Arquivo: ${filePath}`);
  console.log(
    `Importados ${validRows.length} registros — ${new Set(validRows.map((r) => r.agency)).size} órgãos, ` +
      `${categoryNames.length} eixos, exercícios ${fiscalYears.join(", ")} (${removed} substituídos).`
  );
  if (invalidRows.length > 0) console.warn(`${invalidRows.length} linha(s) com erro foram ignoradas.`);
  console.log(
    `Valor planejado: ${total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
