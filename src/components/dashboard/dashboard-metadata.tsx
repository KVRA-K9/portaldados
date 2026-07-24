import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Database, ExternalLink } from "lucide-react";
import { getDashboardConfig } from "@/lib/dashboards/registry";
import { getDashboardDatasetMeta } from "@/lib/dashboards/queries";
import { getDataDictionary } from "@/lib/import/dictionary";
import { cn } from "@/lib/utils";
import { formatCompactCurrency } from "@/lib/format";
import type { DashboardFilters } from "@/lib/dashboards/aggregate";
import { DashboardMicrodata } from "./dashboard-microdata";
import { sandOutlineButton } from "./button-styles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function formatDate(date: Date | null): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(date);
}

export async function DashboardMetadata({
  dashboardSlug,
  filters = {},
}: {
  dashboardSlug: string;
  filters?: DashboardFilters;
}) {
  const config = getDashboardConfig(dashboardSlug);
  if (!config) notFound();

  const meta = await getDashboardDatasetMeta(dashboardSlug);
  const dataDictionary = getDataDictionary(config.slug);

  // Sem microdados publicados, a página apresenta os números do painel oficial.
  const figures = config.officialFigures;
  const semMicrodados = !meta || meta.recordCount === 0;
  const usarNumerosOficiais = Boolean(figures && semMicrodados);

  const anos = figures?.fiscalYears ?? [];
  const periodo = usarNumerosOficiais
    ? anos.length === 0
      ? "—"
      : anos.length === 1
        ? String(anos[0])
        : `${anos[0]}–${anos[anos.length - 1]}`
    : meta && meta.firstYear && meta.lastYear
      ? meta.firstYear === meta.lastYear
        ? String(meta.firstYear)
        : `${meta.firstYear}–${meta.lastYear}`
      : "—";

  const resumo =
    usarNumerosOficiais && figures
      ? [
          { label: "Eixos temáticos", value: figures.categories.length.toLocaleString("pt-BR") },
          {
            label: "Projetos",
            value: figures.projectCount ? figures.projectCount.toLocaleString("pt-BR") : "—",
          },
          { label: "Exercícios cobertos", value: periodo },
          {
            label: `Apropriação ${config.shortName}`,
            value: figures.totalThematic ? formatCompactCurrency(figures.totalThematic) : "—",
          },
        ]
      : [
          {
            label: "Órgãos atuantes",
            value: meta ? meta.agencyCount.toLocaleString("pt-BR") : "—",
          },
          {
            label: "Eixos temáticos",
            value: meta ? meta.categoryCount.toLocaleString("pt-BR") : "—",
          },
          { label: "Exercícios cobertos", value: periodo },
          { label: "Última atualização", value: formatDate(meta?.lastUpdated ?? null) },
        ];

  // A paleta do orçamento (globals.css) sobrescreve card/borda/realce só dentro desta página.
  return (
    <div className={cn("relative isolate", config.paletteClass)}>
      {/* Imagem de fundo do orçamento */}
      {config.bannerImage && (
        <>
          <div
            className="absolute inset-0 -z-10"
            // Sem `background-attachment: fixed`: com ele a imagem é dimensionada pela
            // viewport e "salta" quando um menu (Select/Dropdown) trava a rolagem e some
            // com a barra de rolagem.
            style={{
              backgroundImage: `url(${config.bannerImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            aria-hidden="true"
          />
          {/* Scrim leve: mantém a imagem nítida e ainda garante contraste do texto solto */}
          <div className="absolute inset-0 -z-10 bg-[var(--scrim)]" aria-hidden="true" />
        </>
      )}
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
      <Button asChild variant="outline" size="sm" className={`gap-1.5 ${sandOutlineButton}`}>
        <Link href="/portal#paineis">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Voltar para Orçamentos
        </Link>
      </Button>

      <header className="space-y-2 rounded-lg border bg-card p-5 shadow-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-surface)] px-3 py-1 text-xs font-medium text-[var(--accent-surface-foreground)]">
          <Database className="size-3.5" aria-hidden="true" />
          Metadados do conjunto de dados
        </span>
        <h1 className="text-3xl font-semibold tracking-tight">{config.name}</h1>
        <p className="max-w-3xl text-muted-foreground">
          {usarNumerosOficiais ? (
            <>
              Números divulgados pelo {figures?.source}. Os microdados deste orçamento ainda
              não foram publicados no portal — assim que a equipe técnica concluir a
              consolidação, esta página passará a trazer o conjunto de dados completo.
            </>
          ) : (
            <>
              Conheça o conjunto de dados deste orçamento temático: quais órgãos e eixos ele
              abrange, o que significa cada campo e quais são os microdados publicados. As
              informações são consolidadas pela equipe técnica e atualizadas a cada importação.
            </>
          )}
        </p>
      </header>

      {/* Resumo do dataset */}
      <section aria-label="Resumo do conjunto de dados" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {resumo.map((item) => (
          <Card
            key={item.label}
            className="bg-[var(--accent-surface)] text-[var(--accent-surface-foreground)] shadow-sm [--muted-foreground:var(--accent-surface-muted)]"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tabular-nums">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>


      {usarNumerosOficiais && figures ? (
        <>
          {/* Eixos divulgados pelo painel, no lugar do dicionário de campos */}
          <section
            aria-label="Eixos temáticos"
            className="space-y-3 rounded-lg border bg-card p-5 shadow-sm"
          >
            <h2 className="text-lg font-medium">Eixos temáticos</h2>
            <p className="text-sm text-muted-foreground">
              Áreas em que as ações do {config.shortName} são classificadas.
            </p>
            <ul className="flex flex-wrap gap-2">
              {figures.categories.map((categoria) => (
                <li key={categoria}>
                  <Badge
                    variant="secondary"
                    className="border-transparent bg-[var(--accent-surface)] text-[var(--accent-surface-foreground)]"
                  >
                    {categoria}
                  </Badge>
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-label="Microdados"
            className="space-y-2 rounded-lg border bg-card p-5 shadow-sm"
          >
            <h2 className="text-lg font-medium">Microdados</h2>
            <p className="max-w-3xl text-sm text-muted-foreground">
              Os microdados do {config.shortName} ainda não estão publicados neste portal.
              Enquanto isso, o orçamento inicial total (LOA) é de{" "}
              {figures.totalPlanned ? formatCompactCurrency(figures.totalPlanned) : "—"} e a
              apropriação planejada, de{" "}
              {figures.totalThematic ? formatCompactCurrency(figures.totalThematic) : "—"},
              conforme o {figures.source}. Os relatórios completos estão disponíveis no site do
              orçamento.
            </p>
            <Button asChild variant="outline" size="sm" className={`gap-1.5 ${sandOutlineButton}`}>
              <a href={config.siteUrl} target="_blank" rel="noopener noreferrer">
                Relatórios do {config.shortName}
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            </Button>
          </section>
        </>
      ) : (
        <>
      {/* Dicionário de dados */}
      <section
        aria-label="Dicionário de dados"
        className="overflow-hidden rounded-lg border bg-card shadow-sm"
      >
        <div className="space-y-1 p-5">
          <h2 className="text-lg font-medium">Dicionário de dados</h2>
          <p className="text-sm text-muted-foreground">
            O que cada campo de um registro representa. São os mesmos campos da tabela de
            microdados abaixo e dos arquivos exportados.
          </p>
        </div>
        <div className="border-t">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataDictionary.map((field) => (
                <TableRow key={field.field}>
                  <TableCell className="font-medium">{field.field}</TableCell>
                  <TableCell className="text-muted-foreground">{field.description}</TableCell>
                  <TableCell className="whitespace-nowrap">{field.type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Microdados (filtros + tabela) já abertos, sem exigir navegação */}
      <DashboardMicrodata dashboardSlug={config.slug} filters={filters} />

      {/* Procedência logo abaixo da tabela: de qual planilha veio o que está publicado */}
      {meta?.lastFileName ? (
        <p className="text-readable -mt-3 flex flex-wrap items-center gap-x-1 text-sm font-medium text-white">
          <span>Fonte:</span>
          <span className="font-semibold">{meta.lastFileName}</span>
          {meta.lastImportedAt ? (
            <span>· importado em {formatDate(meta.lastImportedAt)}</span>
          ) : null}
        </p>
      ) : null}
        </>
      )}

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline" size="sm" className={`gap-1.5 ${sandOutlineButton}`}>
          <Link href="/portal#paineis">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Voltar para Orçamentos
          </Link>
        </Button>
      </div>
      </div>
    </div>
  );
}
