/**
 * Formato da planilha de cada orçamento — fonte única usada pela tela de importação,
 * pelos scripts de carga (prisma/import-*.ts) e pelo modelo oferecido para download.
 */

import type { DerivedColumnKey } from "@/lib/dashboards/types";

/** Campos de BudgetEntry que uma planilha pode alimentar. */
export type ImportField =
  | "fiscalYear"
  | "categoryName"
  | "agency"
  | "managementUnit"
  | "region"
  | "fundingSource"
  | "program"
  | "action"
  | "description"
  | "valuePlanned"
  | "valueCommitted"
  | "valueExecuted"
  | "valuePaid";

export type ImportColumn = {
  /** Cabeçalho exatamente como aparece na planilha. */
  header: string;
  /** Nome do campo nas páginas públicas (dicionário e tabela de microdados). */
  label: string;
  /** Destino no registro; ausente = coluna aceita e ignorada (derivada de outra). */
  field?: ImportField;
  /** Para colunas sem `field`: chave recalculada a partir de outro campo na publicação
   *  (ver `getColumnValue` em src/lib/dashboards/table-columns.ts). */
  derivedKey?: DerivedColumnKey;
  required: boolean;
  kind: "year" | "text" | "money";
  /** Valor de exemplo no modelo para download. */
  example: string;
  /** Texto exibido no dicionário de dados publicado. */
  description: string;
};

export type ImportProfile = {
  /** Aba da planilha; ausente = primeira aba. */
  sheetName?: string;
  columns: ImportColumn[];
  /** Nome-base do arquivo de modelo. */
  templateName: string;
  /** Complemento por coluna (chave = header) exibido só no dicionário público. */
  dictionaryNotes?: Record<string, string>;
};

/** Tipo mostrado no dicionário de dados. */
export const KIND_LABELS: Record<ImportColumn["kind"], string> = {
  year: "Inteiro",
  text: "Texto",
  money: "Decimal (R$)",
};

const CLIMATICO: ImportProfile = {
  sheetName: "Microdados",
  templateName: "modelo_orcamento_climatico",
  dictionaryNotes: {
    eixo:
      "Valores: I – Desenvolvimento Sustentável e Bioeconomia; II – Mitigação das Mudanças Climáticas; III – Adaptação às Mudanças Climáticas; IV – Justiça Climática e Inclusão Social; V – Governança Ambiental e Transparência; VI – Educação Ambiental e Inovação Climática; VII – Resposta Climática Emergencial e Proteção Civil.",
  },
  columns: [
    {
      header: "exercicio",
      label: "Exercício",
      field: "fiscalYear",
      required: true,
      kind: "year",
      example: "2026",
      description: "Ano orçamentário a que o registro se refere.",
    },
    {
      header: "codigo_orgao",
      label: "Código do órgão",
      derivedKey: "agencyCode",
      required: false,
      kind: "text",
      example: "715/512",
      description: "Código da unidade orçamentária (derivado do órgão completo).",
    },
    {
      header: "orgao",
      label: "Sigla do órgão",
      derivedKey: "agencyName",
      required: false,
      kind: "text",
      example: "CDSA",
      description: "Sigla do órgão (derivada do órgão completo).",
    },
    {
      header: "orgao_completo",
      label: "Órgão",
      field: "agency",
      required: true,
      kind: "text",
      example: "715/512 - CDSA",
      description:
        "Órgão ou unidade orçamentária responsável, no formato código/unidade – sigla (ex.: 715/512 – CDSA).",
    },
    {
      header: "eixo",
      label: "Eixo climático",
      field: "categoryName",
      required: true,
      kind: "text",
      example: "Eixo I – Desenvolvimento Sustentável e Bioeconomia",
      description: "Eixo do Orçamento Climático em que a ação é classificada.",
    },
    {
      header: "eixo_numero",
      label: "Número do eixo",
      derivedKey: "categoryNumber",
      required: false,
      kind: "text",
      example: "I",
      description: "Numeral do eixo (derivado do eixo).",
    },
    {
      header: "aplicacao_programada",
      label: "Aplicação programada",
      field: "action",
      required: true,
      kind: "text",
      example: "PROSPECÇÃO DE MERCADOS DA ECONOMIA VERDE.",
      description: "Ação orçamentária programada pelo órgão para o exercício.",
    },
    {
      header: "classificacao",
      label: "Classificação",
      field: "fundingSource",
      required: true,
      kind: "text",
      example: "Exclusivo",
      description:
        "Aderência da ação ao Orçamento Climático: Exclusivo (finalidade integralmente climática) ou Não Exclusivo (contribui parcialmente).",
    },
    {
      header: "dotacao",
      label: "Dotação",
      field: "valuePlanned",
      required: true,
      kind: "money",
      example: "784910.80",
      description: "Valor da dotação orçamentária programada para a ação, em reais.",
    },
  ],
};

const CRIANCA_ADOLESCENTE: ImportProfile = {
  sheetName: "Microdados",
  templateName: "modelo_orcamento_crianca_adolescente",
  columns: [
    {
      header: "Ano",
      label: "Ano",
      field: "fiscalYear",
      required: true,
      kind: "year",
      example: "2026",
      description: "Exercício orçamentário a que o registro se refere.",
    },
    {
      header: "Órgão",
      label: "Órgão",
      field: "agency",
      required: true,
      kind: "text",
      example: "SECRETARIA DE ESTADO DE ADMINISTRAÇÃO - SEAD",
      description: "Órgão estadual responsável pela ação orçamentária.",
    },
    {
      header: "Unidade Gestora",
      label: "Unidade Gestora",
      field: "managementUnit",
      required: false,
      kind: "text",
      example: "UNIDADE GESTORA",
      description: "Unidade gestora do órgão responsável pela execução do recurso.",
    },
    {
      header: "Eixo",
      label: "Eixo",
      field: "categoryName",
      required: true,
      kind: "text",
      example: "Educação",
      description:
        "Eixo temático segundo a metodologia da Fundação Abrinq: Educação, Saúde e Assistência Social.",
    },
    {
      header: "Programa",
      label: "Programa",
      field: "program",
      required: false,
      kind: "text",
      example: "12361145010370000",
      description: "Código do programa orçamentário (classificação funcional-programática).",
    },
    {
      header: "Ação",
      label: "Ação",
      field: "action",
      required: true,
      kind: "text",
      example: "FORMAÇÃO E QUALIFICAÇÃO DOS PROFISSIONAIS EM EDUCAÇÃO.",
      description: "Ação orçamentária executada pela unidade gestora.",
    },
    {
      header: "Classificação",
      label: "Classificação",
      field: "fundingSource",
      required: true,
      kind: "text",
      example: "Exclusivo",
      description:
        "Aderência da ação ao Orçamento Criança e Adolescente: Exclusivo (destinada integralmente ao público infantojuvenil) ou Não Exclusivo (atende parcialmente).",
    },
    {
      header: "Previsto",
      label: "Previsto",
      field: "valuePlanned",
      required: true,
      kind: "money",
      example: "8650000.00",
      description: "Dotação prevista para a ação no exercício, em reais.",
    },
    {
      header: "Empenhado",
      label: "Empenhado",
      field: "valueCommitted",
      required: false,
      kind: "money",
      example: "5801697.22",
      description: "Valor empenhado, em reais.",
    },
    {
      header: "Liquidado",
      label: "Liquidado",
      field: "valueExecuted",
      required: false,
      kind: "money",
      example: "782089.35",
      description: "Valor liquidado (despesa reconhecida como devida), em reais.",
    },
    {
      header: "Pago",
      label: "Pago",
      field: "valuePaid",
      required: false,
      kind: "money",
      example: "5019607.87",
      description: "Valor efetivamente pago, em reais.",
    },
  ],
};

/** Formato genérico, para orçamentos que ainda não têm planilha oficial. */
const GENERICO: ImportProfile = {
  templateName: "modelo_importacao",
  columns: [
    { header: "Exercício", label: "Exercício", field: "fiscalYear", required: true, kind: "year", example: "2026", description: "Ano orçamentário a que o registro se refere." },
    { header: "Categoria", label: "Categoria", field: "categoryName", required: true, kind: "text", example: "Educação", description: "Eixo ou área temática do registro." },
    { header: "Órgão", label: "Órgão", field: "agency", required: false, kind: "text", example: "SEPLAN", description: "Órgão ou entidade responsável pela execução." },
    { header: "Unidade Gestora", label: "Unidade Gestora", field: "managementUnit", required: false, kind: "text", example: "", description: "Unidade gestora responsável pela execução do recurso." },
    { header: "Região", label: "Região", field: "region", required: false, kind: "text", example: "", description: "Município ou abrangência regional do recurso." },
    { header: "Fonte de recurso", label: "Fonte de recurso", field: "fundingSource", required: false, kind: "text", example: "", description: "Fonte do recurso ou classificação da ação." },
    { header: "Programa", label: "Programa", field: "program", required: false, kind: "text", example: "", description: "Programa orçamentário associado ao recurso." },
    { header: "Ação", label: "Ação", field: "action", required: false, kind: "text", example: "", description: "Ação orçamentária associada ao recurso." },
    { header: "Descrição", label: "Descrição", field: "description", required: false, kind: "text", example: "", description: "Descrição complementar do registro." },
    { header: "Valor Planejado", label: "Valor Planejado", field: "valuePlanned", required: true, kind: "money", example: "1000000.00", description: "Valor previsto/dotação para o registro, em reais." },
    { header: "Valor Empenhado", label: "Valor Empenhado", field: "valueCommitted", required: false, kind: "money", example: "", description: "Valor empenhado, em reais." },
    { header: "Valor Executado", label: "Valor Executado", field: "valueExecuted", required: false, kind: "money", example: "", description: "Valor executado/liquidado, em reais." },
    { header: "Valor Pago", label: "Valor Pago", field: "valuePaid", required: false, kind: "money", example: "", description: "Valor pago, em reais." },
  ],
};

const PROFILES: Record<string, ImportProfile> = {
  "orcamento-climatico": CLIMATICO,
  "orcamento-crianca-adolescente": CRIANCA_ADOLESCENTE,
};

export function getImportProfile(dashboardSlug: string): ImportProfile {
  return PROFILES[dashboardSlug] ?? GENERICO;
}

/** Colunas que precisam existir no arquivo. */
export function requiredHeaders(profile: ImportProfile): string[] {
  return profile.columns.filter((column) => column.required).map((column) => column.header);
}
