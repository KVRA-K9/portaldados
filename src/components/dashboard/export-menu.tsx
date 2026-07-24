"use client";

import { Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { BudgetEntryLike, DashboardTableColumn } from "@/lib/dashboards/types";
import { getColumnValue } from "@/lib/dashboards/table-columns";
import { downloadBlob } from "@/lib/download-blob";

function cellText(entry: BudgetEntryLike, column: DashboardTableColumn): string {
  const value = getColumnValue(entry, column);
  if (value === null || value === undefined) return "";
  return String(value);
}

function toCsv(data: BudgetEntryLike[], columns: DashboardTableColumn[]): string {
  const header = columns.map((c) => c.label).join(";");
  const rows = data.map((row) => columns.map((c) => cellText(row, c)).join(";"));
  return [header, ...rows].join("\n");
}

export function ExportMenu({
  data,
  columns,
  filenamePrefix,
  dateFormat = "iso",
}: {
  data: BudgetEntryLike[];
  columns: DashboardTableColumn[];
  filenamePrefix: string;
  dateFormat?: "iso" | "pt-BR";
}) {
  // Mesmo padrão de nome do painel oficial de cada orçamento.
  const today = new Date();
  const stamp =
    dateFormat === "pt-BR"
      ? new Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
          .format(today)
          .replace(/\//g, "-")
      : today.toISOString().split("T")[0];
  const fileName = `${filenamePrefix}_${stamp}`;

  async function handleExportCsv() {
    const csv = toCsv(data, columns);
    downloadBlob(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" }), `${fileName}.csv`);
  }

  async function handleExportXlsx() {
    const ExcelJS = (await import("exceljs")).default;
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Microdados");

    sheet.columns = columns.map((c) => ({
      header: c.label,
      key: c.key,
      width: c.width ?? 22,
    }));
    sheet.addRows(
      data.map((row) =>
        Object.fromEntries(columns.map((c) => [c.key, getColumnValue(row, c) ?? ""]))
      )
    );

    for (const column of columns) {
      if (column.numFmt) sheet.getColumn(column.key).numFmt = column.numFmt;
    }
    sheet.getRow(1).font = { bold: true };
    sheet.views = [{ state: "frozen", ySplit: 1 }];

    const buffer = await workbook.xlsx.writeBuffer();
    downloadBlob(
      new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
      `${fileName}.xlsx`
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Download className="size-4" aria-hidden="true" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={handleExportCsv}>Exportar como CSV</DropdownMenuItem>
        <DropdownMenuItem onSelect={handleExportXlsx}>Exportar como Excel (.xlsx)</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
