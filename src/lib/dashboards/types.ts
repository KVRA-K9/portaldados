export type BudgetEntryLike = {
  id: string;
  fiscalYear: number;
  categoryName: string;
  subcategoryName?: string | null;
  fundingSource?: string | null;
  region?: string | null;
  agency?: string | null;
  managementUnit?: string | null;
  program?: string | null;
  action?: string | null;
  description?: string | null;
  valuePlanned: number;
  valueCommitted?: number | null;
  valueExecuted?: number | null;
  valuePaid?: number | null;
};

export type DashboardFilterField = {
  key: "fiscalYear" | "categoryName" | "region" | "fundingSource" | "agency";
  label: string;
};

/** Colunas calculadas a partir de outros campos do registro (ver `getColumnValue`). */
export type DerivedColumnKey =
  | "executionRate"
  | "agencyCode"
  | "agencyName"
  | "categoryNumber";

/** Coluna exibida na tabela de microdados e na exportação (CSV/Excel).
 *  Chaves derivadas (executionRate, agencyCode, agencyName, categoryNumber) são
 *  calculadas em `getColumnValue`. */
export type DashboardTableColumn = {
  key: keyof BudgetEntryLike | DerivedColumnKey;
  label: string;
  format?: "currency" | "percent";
  /** Largura da coluna na planilha exportada. */
  width?: number;
  /** Formato numérico do Excel (ex.: "#,##0.00"). */
  numFmt?: string;
};

export type DashboardIconName = "leaf" | "users" | "book-open" | "heart-pulse" | "hand-heart" | "shield" | "sprout" | "cloud-rain" | "landmark";

export type DashboardEixo = {
  title: string;
  description: string;
  icon: DashboardIconName;
};

export type DashboardLegalItem = {
  label: string;
  description: string;
};

export type DashboardRecurso = {
  label: string;
  description: string;
  href: string;
  kind: "painel" | "bi" | "dados";
  external?: boolean;
};

export type DashboardInstitutional = {
  heroSubtitle: string;
  sobre: string[];
  eixos: DashboardEixo[];
  baseLegal: DashboardLegalItem[];
  recursos: DashboardRecurso[];
};

export type DashboardConfig = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  /** "construcao" = cadastrado para páginas institucionais, mas ainda sem dados/painel ativo. */
  status?: "active" | "construcao";
  /** Existe para ter rota/config própria, mas não aparece como cartão nas listagens
   *  (grade do portal, acesso rápido, admin, rodapé). Ver `allDashboards`. */
  hidden?: boolean;
  /** Outros orçamentos oferecidos como abas dentro do cartão deste (ver DashboardBannerTabs). */
  companionSlugs?: string[];
  /** Título fixo do cartão de abas, exibido em todas as abas (ver DashboardBannerTabs).
   *  Ausente = usa o `name` da aba ativa. */
  tabsTitle?: string;
  themeColorVar: string;
  themeForegroundVar: string;
  icon: DashboardIconName;
  siteUrl: string;
  /** URL do dashboard interativo publicado (Vercel). Ausente = ainda não publicado. */
  dashboardUrl?: string;
  /** Imagem de fundo (banner) do orçamento, em /public. Usada nos painéis e metadados. */
  bannerImage?: string;
  /** Classe de paleta definida em globals.css (ex.: "palette-climatico"). Sem ela, as
   *  páginas usam as cores padrão do tema. */
  paletteClass?: string;
  /** Números divulgados pelo painel oficial, usados enquanto os microdados do orçamento
   *  não são publicados no portal (orçamentos com status "construcao"). */
  officialFigures?: {
    /** De onde vêm os números, citado na página. */
    source: string;
    fiscalYears: number[];
    /** Eixos temáticos do orçamento, na ordem divulgada. */
    categories: string[];
    projectCount?: number;
    /** Orçamento inicial total (LOA), em reais. */
    totalPlanned?: number;
    /** Valor apropriado/planejado para o tema, em reais. */
    totalThematic?: number;
  };
  filters: DashboardFilterField[];
  /** Colunas dos microdados na tabela da tela. Ausente = derivadas do perfil de importação. */
  tableColumns?: DashboardTableColumn[];
  /** Colunas dos arquivos exportados (CSV/Excel). Ausente = derivadas do perfil. */
  exportColumns?: DashboardTableColumn[];
  /** Nome do arquivo exportado, no mesmo padrão do painel oficial de cada orçamento. */
  exportFile?: {
    prefix: string;
    /** "iso" → AAAA-MM-DD; "pt-BR" → DD-MM-AAAA. */
    dateFormat: "iso" | "pt-BR";
  };
  categoryLabel: string;
  institutional: DashboardInstitutional;
};
