import Papa from "papaparse";

export type RawImportRow = Record<string, string>;
export type ParsedSpreadsheet = { headers: string[]; rows: RawImportRow[] };

async function parseCsv(file: File): Promise<ParsedSpreadsheet> {
  const text = await file.text();
  const result = Papa.parse<RawImportRow>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });
  return { headers: (result.meta.fields ?? []).map((h) => h.trim()), rows: result.data };
}

/** Célula do ExcelJS pode ser número, data, fórmula ({ result }) ou rich text ({ text }). */
function cellToText(cell: unknown): string {
  if (cell === null || cell === undefined) return "";
  if (typeof cell === "object") {
    const value = cell as { result?: unknown; text?: unknown };
    if ("result" in value) return String(value.result ?? "").trim();
    if ("text" in value) return String(value.text ?? "").trim();
  }
  return String(cell).trim();
}

async function parseXlsx(file: File, sheetName?: string): Promise<ParsedSpreadsheet> {
  const ExcelJS = (await import("exceljs")).default;
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(await file.arrayBuffer());

  const sheet = (sheetName ? workbook.getWorksheet(sheetName) : null) ?? workbook.worksheets[0];
  if (!sheet) return { headers: [], rows: [] };

  const headerCells = sheet.getRow(1).values as unknown[];
  const headers = headerCells.slice(1).map((h) => cellToText(h));

  const rows: RawImportRow[] = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const values = row.values as unknown[];
    const entry: RawImportRow = {};
    headers.forEach((header, index) => {
      entry[header] = cellToText(values[index + 1]);
    });
    // Ignora linhas totalmente vazias (comuns no fim das planilhas).
    if (Object.values(entry).some((value) => value !== "")) rows.push(entry);
  });

  return { headers, rows };
}

export async function parseSpreadsheetFile(
  file: File,
  sheetName?: string
): Promise<ParsedSpreadsheet> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".csv")) return parseCsv(file);
  if (name.endsWith(".xlsx")) return parseXlsx(file, sheetName);
  throw new Error("Formato de arquivo não suportado. Envie um arquivo .csv ou .xlsx.");
}
