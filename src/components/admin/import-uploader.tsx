"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FileSpreadsheet, Loader2, Undo2, UploadCloud, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { downloadBlob } from "@/lib/download-blob";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ImportProfile } from "@/lib/import/profiles";
import type { RowValidationResult } from "@/lib/import/validate-rows";
import { CheckPanel, type CheckItemData } from "./check-panel";
import { FileDropzone } from "./file-dropzone";
import { ImportPreviewTable } from "./import-preview-table";

type PreviewResponse = {
  fileName: string;
  totalRows: number;
  validCount: number;
  invalidCount: number;
  recognizedColumns: string[];
  missingColumns: string[];
  extraColumns: string[];
  summary: {
    fiscalYears: number[];
    categoryCount: number;
    agencyCount: number;
    totalPlanned: number;
    duplicateRows: number;
    /** Números das linhas repetidas (da segunda ocorrência em diante). */
    duplicateRowNumbers: number[];
    existingInYears: number;
  };
  rows: RowValidationResult[];
};

type ImportMode = "replace-years" | "append";

export type BaseState = { recordCount: number; period: string };

export function ImportUploader({
  dashboardSlug,
  dashboardName,
  profile,
  base,
}: {
  dashboardSlug: string;
  dashboardName: string;
  profile: ImportProfile;
  base: BaseState;
}) {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [mode, setMode] = useState<ImportMode>("replace-years");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** Correções feitas na própria tela: coluna renomeada e linhas repetidas. */
  const [columnMap, setColumnMap] = useState<Record<string, string>>({});
  const [ignoreDuplicates, setIgnoreDuplicates] = useState(false);

  const obrigatorias = profile.columns.filter((c) => c.required);
  const opcionais = profile.columns.filter((c) => !c.required);

  async function downloadTemplate() {
    const ExcelJS = (await import("exceljs")).default;
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(profile.sheetName ?? "Microdados");

    sheet.columns = profile.columns.map((column) => ({
      header: column.header,
      key: column.header,
      width: Math.min(Math.max(column.header.length + 6, 14), 60),
    }));
    sheet.addRow(Object.fromEntries(profile.columns.map((c) => [c.header, c.example])));
    sheet.getRow(1).font = { bold: true };
    sheet.views = [{ state: "frozen", ySplit: 1 }];

    const buffer = await workbook.xlsx.writeBuffer();
    downloadBlob(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `${profile.templateName}.xlsx`
    );
  }

  async function analyze(file: File, map: Record<string, string> = {}) {
    setIsAnalyzing(true);
    setError(null);
    setPreview(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (Object.keys(map).length > 0) formData.append("columnMap", JSON.stringify(map));

      const response = await fetch(`/api/admin/${dashboardSlug}/import/preview`, {
        method: "POST",
        body: formData,
      });
      if (response.status === 401) {
        setError("Sua sessão expirou. Entre novamente para importar.");
        return;
      }
      const json = await response.json();
      if (!response.ok) {
        setError(json.error ?? "Falha ao analisar o arquivo.");
        return;
      }
      setPreview(json as PreviewResponse);
    } catch {
      setError("Falha ao analisar o arquivo.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleSelect(file: File | null) {
    setSelectedFile(file);
    setPreview(null);
    setError(null);
    setColumnMap({});
    setIgnoreDuplicates(false);
    if (file) void analyze(file);
  }

  /** Reanalisa o mesmo arquivo aplicando o mapeamento escolhido na tela. */
  function applyColumnMap() {
    if (selectedFile) void analyze(selectedFile, columnMap);
  }

  async function handleCommit() {
    if (!preview) return;
    const validRows = rowsToImport(preview, ignoreDuplicates);
    if (validRows.length === 0) return;

    setIsCommitting(true);
    try {
      const response = await fetch(`/api/admin/${dashboardSlug}/import/commit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: preview.fileName,
          mode,
          rows: validRows.map((r) => (r.status === "valid" ? r.data : null)),
        }),
      });
      const json = await response.json();
      if (!response.ok) {
        toast.error(json.error ?? "Falha ao importar os dados.");
        return;
      }
      toast.success(
        json.replacedRows > 0
          ? `${json.successRows} registro(s) importado(s); ${json.replacedRows} substituído(s).`
          : `${json.successRows} registro(s) importado(s).`
      );
      setPreview(null);
      setSelectedFile(null);
      setColumnMap({});
      setIgnoreDuplicates(false);
      router.refresh();
    } catch {
      toast.error("Falha ao importar os dados.");
    } finally {
      setIsCommitting(false);
    }
  }

  const totalAImportar = preview ? rowsToImport(preview, ignoreDuplicates).length : 0;

  const checks = buildChecks({
    profile,
    preview,
    mode,
    isAnalyzing,
    hasFile: Boolean(selectedFile),
    ignoreDuplicates,
    columnMap,
    onMapColumn: (esperada, doArquivo) =>
      setColumnMap((atual) => ({ ...atual, [esperada]: doArquivo })),
    onApplyMap: applyColumnMap,
    onToggleDuplicates: () => setIgnoreDuplicates((atual) => !atual),
  });
  const bloqueado = !preview || totalAImportar === 0 || preview.missingColumns.length > 0;

  const estado = isAnalyzing
    ? { label: "Analisando", variant: "secondary" as const }
    : preview
      ? preview.missingColumns.length > 0
        ? { label: "Com erro", variant: "destructive" as const }
        : { label: "Analisado", variant: "secondary" as const }
      : { label: "Pendente", variant: "outline" as const };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        {/* Envio */}
        <div className="space-y-4">
          <section aria-label="Envio da planilha" className="rounded-lg border bg-card">
            <div className="space-y-4 p-5">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-base font-medium">Microdados · {dashboardName}</h2>
                <Badge variant={estado.variant}>{estado.label}</Badge>
              </div>
              <p className="-mt-2 text-sm text-muted-foreground">
                Planilha oficial do orçamento{profile.sheetName ? ` · aba ${profile.sheetName}` : ""}
              </p>

              <FileDropzone file={selectedFile} onSelect={handleSelect} disabled={isAnalyzing} />

              <div className="flex flex-wrap items-start gap-x-2 gap-y-1 text-xs">
                <span className="pt-1 text-muted-foreground">Colunas necessárias:</span>
                {obrigatorias.map((column) => (
                  <Badge key={column.header} variant="secondary" className="font-normal">
                    {column.header}
                  </Badge>
                ))}
              </div>
              {opcionais.length > 0 ? (
                <div className="flex flex-wrap items-start gap-x-2 gap-y-1 text-xs">
                  <span className="pt-1 text-muted-foreground">Opcionais:</span>
                  {opcionais.map((column) => (
                    <Badge key={column.header} variant="outline" className="font-normal">
                      {column.header}
                    </Badge>
                  ))}
                </div>
              ) : null}

              {error ? (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              ) : null}
            </div>

            {/* Modo de importação */}
            <div className="space-y-3 border-t p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Modo de importação</span>
                  <div className="inline-flex rounded-lg border p-0.5">
                    {(
                      [
                        { value: "replace-years", label: "Substituir exercício" },
                        { value: "append", label: "Mesclar" },
                      ] as const
                    ).map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setMode(option.value)}
                        aria-pressed={mode === option.value}
                        className={cn(
                          "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                          mode === option.value
                            ? "bg-institutional text-institutional-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={downloadTemplate} className="gap-2">
                    <FileSpreadsheet className="size-4" aria-hidden="true" />
                    Baixar modelo
                  </Button>
                  <Button onClick={handleCommit} disabled={bloqueado || isCommitting} className="gap-2">
                    {isCommitting ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <UploadCloud className="size-4" aria-hidden="true" />
                    )}
                    Importar {preview ? `(${totalAImportar})` : ""}
                  </Button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                {mode === "replace-years" ? (
                  <>
                    <strong className="text-foreground">Substituir exercício:</strong> apaga os
                    registros dos exercícios contidos na planilha e regrava tudo a partir do arquivo.
                    Use quando o relatório é a versão definitiva do ano.{" "}
                    <strong className="text-foreground">Os demais exercícios não são afetados.</strong>
                  </>
                ) : (
                  <>
                    <strong className="text-foreground">Mesclar:</strong> acrescenta as linhas do
                    arquivo aos registros já publicados, sem apagar nada. Use para complementos —
                    reenviar a planilha inteira duplicaria os dados.
                  </>
                )}
              </p>
            </div>
          </section>
        </div>

        {/* Painel de checagens */}
        <CheckPanel
          items={checks}
          footer={
            <>
              Em base: {base.recordCount.toLocaleString("pt-BR")} registro(s)
              {base.period !== "—" ? ` · exercícios ${base.period}` : ""}
            </>
          }
        />
      </div>

      {preview && preview.missingColumns.length === 0 ? (
        <section aria-label="Conferência das linhas" className="rounded-lg border bg-card p-5">
          <h2 className="mb-4 text-base font-medium">Conferência das linhas</h2>
          <ImportPreviewTable rows={preview.rows} profile={profile} />
        </section>
      ) : null}
    </div>
  );
}

/** Linhas que serão enviadas ao commit, já sem as repetidas quando o usuário pede. */
function rowsToImport(preview: PreviewResponse, ignoreDuplicates: boolean) {
  const validas = preview.rows.filter((row) => row.status === "valid");
  if (!ignoreDuplicates) return validas;
  const repetidas = new Set(preview.summary.duplicateRowNumbers);
  return validas.filter((row) => !repetidas.has(row.rowNumber));
}

/** Traduz o resultado da análise nos itens do Painel de checagens. */
function buildChecks({
  profile,
  preview,
  mode,
  isAnalyzing,
  hasFile,
  ignoreDuplicates,
  columnMap,
  onMapColumn,
  onApplyMap,
  onToggleDuplicates,
}: {
  profile: ImportProfile;
  preview: PreviewResponse | null;
  mode: ImportMode;
  isAnalyzing: boolean;
  hasFile: boolean;
  ignoreDuplicates: boolean;
  columnMap: Record<string, string>;
  onMapColumn: (esperada: string, doArquivo: string) => void;
  onApplyMap: () => void;
  onToggleDuplicates: () => void;
}): CheckItemData[] {
  const pendingDescription = isAnalyzing
    ? "Analisando o arquivo…"
    : hasFile
      ? "Aguardando a análise do arquivo."
      : "Envie a planilha para conferir.";

  if (!preview) {
    return [
      "Colunas obrigatórias",
      "Colunas opcionais",
      "Linhas lidas",
      "Linhas válidas",
      "Exercícios",
      "Órgãos e eixos",
      "Valor planejado",
      "Efeito no portal",
      "Linhas repetidas",
    ].map((title, index) => ({
      id: `pending-${index}`,
      status: "pending" as const,
      title,
      description: pendingDescription,
    }));
  }

  const { summary } = preview;
  const obrigatorias = profile.columns.filter((c) => c.required).length;
  const opcionaisReconhecidas = preview.recognizedColumns.filter(
    (header) => !profile.columns.find((c) => c.header === header)?.required
  ).length;
  const opcionaisTotal = profile.columns.filter((c) => !c.required).length;

  return [
    {
      id: "obrigatorias",
      status: preview.missingColumns.length === 0 ? "ok" : "error",
      title: "Colunas obrigatórias",
      description:
        preview.missingColumns.length === 0
          ? `As ${obrigatorias} colunas obrigatórias foram encontradas.`
          : `Faltam no arquivo: ${preview.missingColumns.join(", ")}.`,
      hint:
        preview.missingColumns.length === 0
          ? undefined
          : preview.extraColumns.length > 0
            ? "Se a planilha só renomeou a coluna, aponte abaixo qual do arquivo corresponde a cada uma."
            : "Baixe o modelo e confira os cabeçalhos da primeira linha da planilha.",
      action:
        preview.missingColumns.length > 0 && preview.extraColumns.length > 0 ? (
          <div className="space-y-2">
            {preview.missingColumns.map((esperada) => (
              <div key={esperada} className="flex items-center gap-2">
                <span className="w-28 shrink-0 truncate text-xs font-medium" title={esperada}>
                  {esperada}
                </span>
                <Select
                  value={columnMap[esperada] ?? ""}
                  onValueChange={(valor) => onMapColumn(esperada, valor)}
                >
                  <SelectTrigger
                    className="h-8 flex-1 text-xs"
                    aria-label={`Coluna do arquivo para ${esperada}`}
                  >
                    <SelectValue placeholder="coluna do arquivo…" />
                  </SelectTrigger>
                  <SelectContent position="popper" align="start" sideOffset={4}>
                    {preview.extraColumns.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              disabled={Object.keys(columnMap).length === 0}
              onClick={onApplyMap}
            >
              <Wand2 className="size-3.5" aria-hidden="true" />
              Aplicar e analisar de novo
            </Button>
          </div>
        ) : undefined,
    },
    {
      id: "opcionais",
      status: "ok",
      title: "Colunas opcionais",
      description:
        `${opcionaisReconhecidas} de ${opcionaisTotal} reconhecidas.` +
        (preview.extraColumns.length > 0
          ? ` Ignoradas: ${preview.extraColumns.join(", ")}.`
          : ""),
    },
    {
      id: "linhas",
      status: preview.totalRows > 0 ? "ok" : "error",
      title: "Linhas lidas",
      description: `${preview.totalRows.toLocaleString("pt-BR")} linha(s)${
        profile.sheetName ? ` na aba ${profile.sheetName}` : ""
      }.`,
      hint:
        preview.totalRows > 0
          ? undefined
          : profile.sheetName
            ? `Verifique se os dados estão na aba "${profile.sheetName}" e se a primeira linha é o cabeçalho.`
            : "Verifique se a primeira linha da planilha é o cabeçalho.",
    },
    {
      id: "validas",
      status: preview.invalidCount === 0 ? "ok" : "warning",
      title: "Linhas válidas",
      description:
        preview.invalidCount === 0
          ? `Todas as ${preview.validCount.toLocaleString("pt-BR")} linhas passaram na validação.`
          : `${preview.invalidCount} linha(s) com erro não serão importadas — veja a conferência abaixo.`,
      hint:
        preview.invalidCount === 0
          ? undefined
          : "Corrija as linhas na planilha de origem e reenvie o arquivo, ou siga a importação sem elas.",
    },
    {
      id: "exercicios",
      status: summary.fiscalYears.length > 0 ? "ok" : "error",
      title: "Exercícios",
      description:
        summary.fiscalYears.length > 0
          ? `Exercício(s) ${summary.fiscalYears.join(", ")} no arquivo.`
          : "Nenhum exercício identificado.",
    },
    {
      id: "dimensoes",
      status: "ok",
      title: "Órgãos e eixos",
      description: `${summary.agencyCount} órgão(s) e ${summary.categoryCount} eixo(s) distintos.`,
    },
    {
      id: "valor",
      status: summary.totalPlanned > 0 ? "ok" : "warning",
      title: "Valor planejado",
      description: `${formatCurrency(summary.totalPlanned)} somando as linhas válidas.`,
      hint:
        summary.totalPlanned > 0
          ? undefined
          : "Confira a coluna de valores: 1.234,56 e 1234.56 são aceitos; célula vazia entra como zero.",
    },
    {
      id: "efeito",
      status: mode === "replace-years" && summary.existingInYears > 0 ? "warning" : "ok",
      title: "Efeito no portal",
      description:
        mode === "replace-years"
          ? summary.existingInYears > 0
            ? `${summary.existingInYears.toLocaleString("pt-BR")} registro(s) já publicados nesses exercícios serão substituídos.`
            : "Nenhum registro será substituído: estes exercícios ainda não estão publicados."
          : `As ${preview.validCount.toLocaleString("pt-BR")} linhas serão somadas aos registros existentes.`,
      hint:
        mode === "replace-years" && summary.existingInYears > 0
          ? "É o esperado ao reenviar a planilha do exercício. Para somar em vez de substituir, escolha Mesclar na barra abaixo."
          : undefined,
    },
    {
      id: "duplicadas",
      status:
        summary.duplicateRows === 0 || ignoreDuplicates
          ? "ok"
          : "warning",
      title: "Linhas repetidas",
      description:
        summary.duplicateRows === 0
          ? "Nenhuma repetição de exercício + órgão + eixo + ação."
          : ignoreDuplicates
            ? `${summary.duplicateRows} repetida(s) serão ignoradas; a primeira ocorrência de cada uma é mantida.`
            : `${summary.duplicateRows} linha(s) repetem exercício + órgão + eixo + ação — confira se a exportação saiu duplicada.`,
      hint:
        summary.duplicateRows === 0 || ignoreDuplicates
          ? undefined
          : "Se a exportação saiu duplicada, ignore as repetidas. Se forem lançamentos distintos, corrija a planilha antes de importar.",
      action:
        summary.duplicateRows > 0 ? (
          <Button size="sm" variant="outline" className="gap-1.5" onClick={onToggleDuplicates}>
            {ignoreDuplicates ? (
              <>
                <Undo2 className="size-3.5" aria-hidden="true" />
                Voltar a incluir
              </>
            ) : (
              <>
                <Wand2 className="size-3.5" aria-hidden="true" />
                Ignorar as {summary.duplicateRows} repetidas
              </>
            )}
          </Button>
        ) : undefined,
    },
  ];
}
