"use client";

import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { BudgetEntryLike, DashboardTableColumn } from "@/lib/dashboards/types";
import { getColumnValue } from "@/lib/dashboards/table-columns";
import { formatCurrency, formatPercent } from "@/lib/format";

function buildColumns(tableColumns: DashboardTableColumn[]): ColumnDef<BudgetEntryLike>[] {
  return tableColumns.map((column) => ({
    id: column.key,
    header: column.label,
    accessorFn: (row) => getColumnValue(row, column),
    cell: ({ getValue }) => {
      const value = getValue<string | number | null>();
      if (column.format === "currency") {
        return <span className="tabular-nums">{formatCurrency(Number(value ?? 0))}</span>;
      }
      if (column.format === "percent") {
        return <span className="tabular-nums">{formatPercent(Number(value ?? 0))}</span>;
      }
      // Visual "bruto" (planilha/CSV): mostra o valor por inteiro, sem truncar. A célula
      // não quebra linha (whitespace-nowrap na primitiva), então a tabela rola na horizontal.
      const isEmpty = value === null || value === undefined || value === "";
      const text = isEmpty ? "—" : String(value);
      return <span title={isEmpty ? undefined : text}>{text}</span>;
    },
  }));
}

export function DataTable({
  data,
  tableColumns,
}: {
  data: BudgetEntryLike[];
  tableColumns: DashboardTableColumn[];
}) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "fiscalYear", desc: true },
  ]);
  const columns = useMemo(() => buildColumns(tableColumns), [tableColumns]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="space-y-3">
      <div className="border border-border bg-white">
        <Table className="font-mono text-xs">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="border-r border-border bg-muted/60 last:border-r-0"
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="flex items-center gap-1 hover:text-primary"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() ? (
                          <ArrowUpDown className="size-3.5 text-muted-foreground" aria-hidden="true" />
                        ) : null}
                      </button>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-transparent">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="border-r border-border last:border-r-0"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  Nenhum registro encontrado para os filtros selecionados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-2 text-xs text-muted-foreground">
        <span>
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {Math.max(table.getPageCount(), 1)} — {data.length} registros
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próxima
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
