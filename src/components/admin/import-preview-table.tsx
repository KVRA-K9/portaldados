import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/format";
import type { ImportProfile } from "@/lib/import/profiles";
import type { RowValidationResult } from "@/lib/import/validate-rows";
import type { BudgetEntryImportRow } from "@/lib/schemas/budget-entry";

/** Colunas exibidas na conferência: as do perfil que têm destino no registro. */
function previewColumns(profile: ImportProfile) {
  return profile.columns.filter((column) => column.field);
}

function cellValue(data: BudgetEntryImportRow, field: string, kind: string) {
  const value = data[field as keyof BudgetEntryImportRow];
  if (value === null || value === undefined || value === "") return "—";
  return kind === "money" ? formatCurrency(Number(value)) : String(value);
}

export function ImportPreviewTable({
  rows,
  profile,
}: {
  rows: RowValidationResult[];
  profile: ImportProfile;
}) {
  const columns = previewColumns(profile);
  const invalidRows = rows.filter((row) => row.status === "invalid");
  const validRows = rows.filter((row) => row.status === "valid");

  return (
    <div className="space-y-4">
      {invalidRows.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-medium text-destructive">
            Linhas com erro ({invalidRows.length}) — elas não serão importadas
          </p>
          <ScrollArea className="h-40 rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Linha</TableHead>
                  <TableHead>Problema</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invalidRows.map((row) => (
                  <TableRow key={row.rowNumber}>
                    <TableCell className="tabular-nums">{row.rowNumber}</TableCell>
                    <TableCell className="text-destructive">
                      {row.status === "invalid" ? row.errors.join("; ") : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      ) : null}

      <div className="space-y-2">
        <p className="text-sm font-medium">
          Linhas válidas ({validRows.length}){" "}
          <span className="font-normal text-muted-foreground">
            — mostrando as {Math.min(validRows.length, 50)} primeiras
          </span>
        </p>
        <ScrollArea className="h-96 rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Linha</TableHead>
                <TableHead className="w-24">Status</TableHead>
                {columns.map((column) => (
                  <TableHead key={column.header}>{column.header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {validRows.slice(0, 50).map((row) => (
                <TableRow key={row.rowNumber}>
                  <TableCell className="tabular-nums">{row.rowNumber}</TableCell>
                  <TableCell>
                    <Badge className="bg-status-good text-white">Válida</Badge>
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell key={column.header} className={column.kind === "money" ? "tabular-nums" : ""}>
                      {row.status === "valid"
                        ? cellValue(row.data, column.field!, column.kind)
                        : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}
