import type { DashboardConfig } from "./types";

export const dashboardRegistry: Record<string, DashboardConfig> = {
  "orcamento-climatico": {
    slug: "orcamento-climatico",
    name: "Orçamento Climático",
    shortName: "Clima",
    description:
      "Acompanhamento dos recursos públicos destinados a ações de mitigação e adaptação às mudanças climáticas no Estado do Acre.",
    themeColorVar: "var(--theme-climatico)",
    themeForegroundVar: "var(--theme-climatico-foreground)",
    icon: "leaf",
    siteUrl:
      "https://seplan.ac.gov.br/planejamento-governamental/orcamentos-tematicos/orcamento-climatico-do-estado-do-acre/",
    dashboardUrl: "https://seplan-clima.vercel.app/",
    bannerImage: "/paineis/croa.jpg",
    bannerPosition: "center 70%",
    bannerFilter: "url(#aquarela)",
    paletteClass: "palette-climatico",
    categoryLabel: "Eixo climático",
    filters: [
      { key: "fiscalYear", label: "Exercício" },
      { key: "categoryName", label: "Eixo climático" },
      { key: "agency", label: "Órgão" },
      { key: "fundingSource", label: "Classificação" },
    ],
    // A tabela pública deriva do perfil de importação (src/lib/import/profiles.ts) e mostra
    // todas as colunas da planilha, inclusive as derivadas (código do órgão, sigla, número
    // do eixo). Mesmo layout do arquivo exportado pelo painel oficial (seplan-clima), para
    // que os microdados baixados aqui sejam intercambiáveis com os de lá.
    exportColumns: [
      { key: "fiscalYear", label: "exercicio", width: 10 },
      { key: "agencyCode", label: "codigo_orgao", width: 14 },
      { key: "agencyName", label: "orgao", width: 40 },
      { key: "agency", label: "orgao_completo", width: 50 },
      { key: "categoryName", label: "eixo", width: 50 },
      { key: "categoryNumber", label: "eixo_numero", width: 12 },
      { key: "action", label: "aplicacao_programada", width: 70 },
      { key: "fundingSource", label: "classificacao", width: 16 },
      { key: "valuePlanned", label: "dotacao", width: 18, numFmt: "#,##0.00" },
    ],
    exportFile: { prefix: "microdados_orcamento_climatico", dateFormat: "iso" },
    institutional: {
      heroSubtitle:
        "Monitoramento do orçamento do Estado do Acre destinado a ações de mitigação e adaptação às mudanças climáticas, alinhado à Política Nacional sobre Mudança do Clima e aos compromissos assumidos pelo Estado.",
      sobre: [
        "O Orçamento Climático organiza e dá transparência aos recursos públicos estaduais aplicados no enfrentamento das mudanças climáticas, permitindo acompanhar quanto foi planejado e efetivamente executado em cada eixo.",
        "A iniciativa é conduzida pelo Departamento de Estudos e Planejamento Orçamentário da Secretaria de Planejamento do Estado do Acre (SEPLAN-AC), integrando dados de diferentes órgãos e programas em uma visão única.",
      ],
      // Os sete eixos que classificam as ações nos microdados publicados.
      eixos: [
        {
          title: "I – Desenvolvimento Sustentável e Bioeconomia",
          description:
            "Cadeias produtivas sustentáveis, serviços ambientais e economia verde como alternativa de renda.",
          icon: "sprout",
        },
        {
          title: "II – Mitigação das Mudanças Climáticas",
          description:
            "Ações que reduzem as emissões de gases de efeito estufa, como conservação florestal e energias limpas.",
          icon: "leaf",
        },
        {
          title: "III – Adaptação às Mudanças Climáticas",
          description:
            "Medidas que aumentam a resiliência de comunidades, cidades e ecossistemas frente aos impactos do clima.",
          icon: "shield",
        },
        {
          title: "IV – Justiça Climática e Inclusão Social",
          description:
            "Atenção aos grupos mais afetados pela crise climática, com foco na redução das desigualdades.",
          icon: "hand-heart",
        },
        {
          title: "V – Governança Ambiental e Transparência",
          description:
            "Gestão, controle e publicidade das políticas ambientais e climáticas do Estado.",
          icon: "landmark",
        },
        {
          title: "VI – Educação Ambiental e Inovação Climática",
          description:
            "Formação, pesquisa e soluções inovadoras voltadas ao enfrentamento das mudanças climáticas.",
          icon: "book-open",
        },
        {
          title: "VII – Resposta Climática Emergencial e Proteção Civil",
          description:
            "Prevenção, monitoramento e resposta a eventos climáticos extremos, protegendo a população vulnerável.",
          icon: "cloud-rain",
        },
      ],
      baseLegal: [
        {
          label: "Lei nº 12.187/2009",
          description: "Institui a Política Nacional sobre Mudança do Clima (PNMC).",
        },
        {
          label: "Acordo de Paris",
          description: "Compromisso internacional de limitação do aquecimento global ratificado pelo Brasil.",
        },
        {
          label: "Sistema Estadual de Incentivos a Serviços Ambientais (SISA)",
          description: "Marco do Acre para valorização dos serviços e produtos ambientais.",
        },
      ],
      recursos: [
        {
          label: "Microdados",
          description: "Consulte e baixe os dados brutos, registro a registro, com filtros.",
          href: "/orcamento-climatico/microdados",
          kind: "painel",
        },
        {
          label: "Dados abertos do Acre",
          description: "Conjuntos de dados oficiais publicados no portal de dados abertos do Estado.",
          href: "https://dados.ac.gov.br/",
          kind: "dados",
          external: true,
        },
      ],
    },
  },
  "orcamento-crianca-adolescente": {
    slug: "orcamento-crianca-adolescente",
    name: "Orçamento Criança e Adolescente",
    shortName: "Criança e Adolescente",
    description:
      "Acompanhamento dos recursos públicos destinados a políticas voltadas à primeira infância, crianças e adolescentes no Estado do Acre.",
    themeColorVar: "var(--theme-crianca-adolescente)",
    themeForegroundVar: "var(--theme-crianca-adolescente-foreground)",
    icon: "users",
    siteUrl:
      "https://seplan.ac.gov.br/planejamento-governamental/orcamentos-tematicos/orcamento-crianca-e-adolescente-ocad/",
    dashboardUrl: "https://ocadac.vercel.app/",
    bannerImage: "/paineis/bi-ocad-criancas.png",
    bannerPosition: "center 25%",
    paletteClass: "palette-crianca-adolescente",
    categoryLabel: "Eixo",
    filters: [
      { key: "fiscalYear", label: "Exercício" },
      { key: "categoryName", label: "Eixo" },
      { key: "agency", label: "Órgão" },
      { key: "fundingSource", label: "Classificação" },
    ],
    // A tabela pública deriva do perfil de importação e mostra todas as colunas da
    // planilha, incluindo Unidade Gestora e Programa.
    // Mesmo layout do relatório exportado pelo painel oficial (ocadac).
    exportColumns: [
      { key: "fiscalYear", label: "Ano", width: 8 },
      { key: "agency", label: "Órgão", width: 45 },
      { key: "managementUnit", label: "Unidade Gestora", width: 45 },
      { key: "categoryName", label: "Eixo", width: 20 },
      { key: "program", label: "Programa", width: 20 },
      { key: "action", label: "Ação", width: 60 },
      { key: "fundingSource", label: "Classificação", width: 16 },
      { key: "valuePlanned", label: "Previsto", width: 16, numFmt: "#,##0.00" },
      { key: "valueCommitted", label: "Empenhado", width: 16, numFmt: "#,##0.00" },
      { key: "valueExecuted", label: "Liquidado", width: 16, numFmt: "#,##0.00" },
      { key: "valuePaid", label: "Pago", width: 16, numFmt: "#,##0.00" },
    ],
    exportFile: { prefix: "relatorio_orcamento_crianca_adolescente", dateFormat: "pt-BR" },
    institutional: {
      heroSubtitle:
        "Monitoramento do orçamento do Estado do Acre destinado à garantia dos direitos de crianças e adolescentes, com base na metodologia da Fundação Abrinq e respaldado pela Lei nº 3.762/2021.",
      sobre: [
        "O Orçamento Criança e Adolescente (OCA) dá transparência aos recursos públicos estaduais aplicados na garantia dos direitos da primeira infância, de crianças e de adolescentes, evidenciando o quanto foi planejado e efetivamente executado.",
        "A metodologia segue os parâmetros da Fundação Abrinq, permitindo comparar a destinação orçamentária entre eixos e exercícios e apoiar a formulação e o controle social das políticas públicas.",
      ],
      eixos: [
        {
          title: "Educação",
          description:
            "Garantia do direito à aprendizagem e ao desenvolvimento integral, com atenção à primeira infância e à permanência na escola.",
          icon: "book-open",
        },
        {
          title: "Saúde",
          description:
            "Atenção integral à saúde da criança e do adolescente, da gestação à juventude, incluindo condições dignas de moradia e saneamento.",
          icon: "heart-pulse",
        },
        {
          title: "Assistência Social",
          description:
            "Proteção social e garantia dos direitos da cidadania, com foco nas famílias e nos grupos em situação de vulnerabilidade.",
          icon: "hand-heart",
        },
      ],
      baseLegal: [
        {
          label: "Lei estadual nº 3.762/2021",
          description: "Institui o Orçamento Criança e Adolescente no âmbito do Estado do Acre.",
        },
        {
          label: "Lei nº 8.069/1990 (ECA)",
          description: "Estatuto da Criança e do Adolescente, marco da proteção integral.",
        },
        {
          label: "Constituição Federal, art. 227",
          description: "Estabelece a prioridade absoluta dos direitos de crianças e adolescentes.",
        },
      ],
      recursos: [
        {
          label: "Microdados",
          description: "Consulte e baixe os dados brutos, registro a registro, com filtros.",
          href: "/orcamento-crianca-adolescente/microdados",
          kind: "painel",
        },
        {
          label: "Dados abertos do Acre",
          description: "Conjuntos de dados oficiais publicados no portal de dados abertos do Estado.",
          href: "https://dados.ac.gov.br/",
          kind: "dados",
          external: true,
        },
      ],
    },
  },
  "orcamento-sensivel-ao-genero": {
    slug: "orcamento-sensivel-ao-genero",
    name: "Orçamento Sensível ao Gênero",
    shortName: "Gênero",
    status: "construcao",
    description:
      "Acompanhamento dos recursos públicos destinados à promoção da igualdade de gênero e ao enfrentamento das desigualdades entre mulheres e homens no Estado do Acre.",
    themeColorVar: "var(--theme-genero)",
    themeForegroundVar: "var(--theme-genero-foreground)",
    icon: "hand-heart",
    siteUrl:
      "https://seplan.ac.gov.br/planejamento-governamental/orcamentos-tematicos/relatorio-orcamento-sensivel-ao-genero-osg/",
    bannerImage: "/paineis/bi-osg-mulheres.png",
    bannerPosition: "center 28%",
    paletteClass: "palette-genero",
    // Teste: o cartão do Gênero no portal oferece o Étnico-Racial como segunda aba,
    // sob um título único que abrange os dois orçamentos.
    companionSlugs: ["orcamento-etnico-racial"],
    tabsTitle: "Orçamento Sensível ao Gênero e Étnico-Racial",
    // Enquanto os microdados do OSG não são publicados aqui, a página de metadados
    // apresenta os números divulgados pelo painel oficial.
    officialFigures: {
      source: "Painel do Orçamento Sensível ao Gênero — SEPLAN-AC",
      fiscalYears: [2024, 2025],
      categories: [
        "Assistência Social e Direitos Humanos",
        "Segurança",
        "Saúde",
        "Educação",
        "Econômico",
        "Governança",
      ],
      projectCount: 103,
      totalPlanned: 522_728_331.99,
      totalThematic: 220_468_189.96,
    },
    categoryLabel: "Área temática",
    filters: [
      { key: "fiscalYear", label: "Exercício" },
      { key: "categoryName", label: "Área temática" },
      { key: "region", label: "Região" },
    ],
    tableColumns: [
      { key: "fiscalYear", label: "Exercício" },
      { key: "categoryName", label: "Área temática" },
      { key: "region", label: "Região" },
      { key: "valuePlanned", label: "Planejado", format: "currency" },
      { key: "valueExecuted", label: "Executado", format: "currency" },
      { key: "executionRate", label: "% Execução", format: "percent" },
    ],
    institutional: {
      heroSubtitle:
        "Monitoramento do orçamento do Estado do Acre destinado à promoção da igualdade de gênero e à garantia dos direitos das mulheres, evidenciando quanto é planejado e executado nessas políticas.",
      sobre: [
        "O Orçamento Sensível ao Gênero (OSG) organiza e dá transparência aos recursos públicos estaduais aplicados na redução das desigualdades entre mulheres e homens, permitindo acompanhar o que foi planejado e efetivamente executado.",
        "A iniciativa é conduzida pelo Departamento de Estudos e Planejamento Orçamentário da Secretaria de Planejamento do Estado do Acre (SEPLAN-AC) e está em construção, com incorporação progressiva dos dados ao portal.",
      ],
      // Eixos conforme o painel do OSG (SEPLAN-AC).
      eixos: [
        {
          title: "Assistência Social e Direitos Humanos",
          description:
            "Proteção social e garantia de direitos das mulheres, com atenção às situações de vulnerabilidade.",
          icon: "hand-heart",
        },
        {
          title: "Segurança",
          description:
            "Prevenção e enfrentamento da violência contra a mulher e políticas de segurança pública com recorte de gênero.",
          icon: "shield",
        },
        {
          title: "Saúde",
          description:
            "Atenção integral à saúde da mulher, da gestação ao cuidado continuado.",
          icon: "heart-pulse",
        },
        {
          title: "Educação",
          description:
            "Acesso, permanência e formação, incluindo ações de equidade de gênero na rede de ensino.",
          icon: "book-open",
        },
        {
          title: "Econômico",
          description:
            "Autonomia econômica das mulheres: trabalho, renda, qualificação e empreendedorismo.",
          icon: "landmark",
        },
        {
          title: "Governança",
          description:
            "Gestão, transparência e coordenação das políticas para mulheres entre os órgãos do Estado.",
          icon: "users",
        },
      ],
      baseLegal: [
        {
          label: "Constituição Federal, art. 5º",
          description: "Estabelece a igualdade entre homens e mulheres em direitos e obrigações.",
        },
        {
          label: "Lei nº 11.340/2006 (Lei Maria da Penha)",
          description: "Cria mecanismos para coibir a violência doméstica e familiar contra a mulher.",
        },
        {
          label: "Objetivo de Desenvolvimento Sustentável 5 (ODS 5)",
          description: "Alcançar a igualdade de gênero e empoderar todas as mulheres e meninas.",
        },
      ],
      recursos: [
        {
          label: "Microdados",
          description: "Consulte e baixe os dados brutos, registro a registro, com filtros.",
          href: "/orcamento-sensivel-ao-genero/microdados",
          kind: "painel",
        },
        {
          label: "Dados abertos do Acre",
          description: "Conjuntos de dados oficiais publicados no portal de dados abertos do Estado.",
          href: "https://dados.ac.gov.br/",
          kind: "dados",
          external: true,
        },
      ],
    },
  },
  // Orçamento em estudo. Oculto das listagens (`hidden`): existe só para ter config e
  // rota de metadados próprias, oferecido como aba dentro do cartão do Gênero.
  "orcamento-etnico-racial": {
    slug: "orcamento-etnico-racial",
    name: "Orçamento Étnico-Racial",
    shortName: "Étnico-Racial",
    hidden: true,
    status: "construcao",
    description:
      "Acompanhamento dos recursos públicos destinados à promoção da igualdade racial e à garantia dos direitos dos povos indígenas e das comunidades tradicionais no Estado do Acre.",
    themeColorVar: "var(--theme-etnico-racial)",
    themeForegroundVar: "var(--theme-etnico-racial-foreground)",
    icon: "users",
    siteUrl:
      "https://seplan.ac.gov.br/planejamento-governamental/orcamentos-tematicos/",
    bannerImage: "/paineis/etnias.png",
    paletteClass: "palette-etnico-racial",
    // Placeholder de construção: eixos definidos, sem números oficiais (aparecem como "—").
    officialFigures: {
      source: "Em construção — SEPLAN-AC",
      fiscalYears: [],
      categories: [
        "Igualdade Racial",
        "Povos Indígenas",
        "Comunidades Tradicionais",
        "Educação e Cultura",
        "Saúde da População Negra",
      ],
    },
    categoryLabel: "Eixo",
    filters: [
      { key: "fiscalYear", label: "Exercício" },
      { key: "categoryName", label: "Eixo" },
      { key: "region", label: "Região" },
    ],
    tableColumns: [
      { key: "fiscalYear", label: "Exercício" },
      { key: "categoryName", label: "Eixo" },
      { key: "region", label: "Região" },
      { key: "valuePlanned", label: "Planejado", format: "currency" },
      { key: "valueExecuted", label: "Executado", format: "currency" },
      { key: "executionRate", label: "% Execução", format: "percent" },
    ],
    institutional: {
      heroSubtitle:
        "Monitoramento do orçamento do Estado do Acre destinado à promoção da igualdade racial e à garantia dos direitos dos povos indígenas e das comunidades tradicionais, evidenciando quanto é planejado e executado nessas políticas.",
      sobre: [
        "O Orçamento Étnico-Racial organiza e dá transparência aos recursos públicos estaduais aplicados na redução das desigualdades raciais e na promoção dos direitos dos povos indígenas e das comunidades tradicionais, permitindo acompanhar o que foi planejado e efetivamente executado.",
        "A iniciativa é conduzida pelo Departamento de Estudos e Planejamento Orçamentário da Secretaria de Planejamento do Estado do Acre (SEPLAN-AC) e está em construção, com incorporação progressiva dos dados ao portal.",
      ],
      eixos: [
        {
          title: "Igualdade Racial",
          description:
            "Promoção da igualdade racial e enfrentamento do racismo nas políticas públicas do Estado.",
          icon: "users",
        },
        {
          title: "Povos Indígenas",
          description:
            "Garantia dos direitos, territórios e modos de vida dos povos indígenas do Acre.",
          icon: "leaf",
        },
        {
          title: "Comunidades Tradicionais",
          description:
            "Atenção a comunidades quilombolas, ribeirinhas e extrativistas e à sua relação com o território.",
          icon: "landmark",
        },
        {
          title: "Educação e Cultura",
          description:
            "Valorização da história e da cultura afro-brasileira e indígena e do acesso à educação.",
          icon: "book-open",
        },
        {
          title: "Saúde da População Negra",
          description:
            "Atenção integral à saúde da população negra, indígena e das comunidades tradicionais.",
          icon: "heart-pulse",
        },
      ],
      baseLegal: [
        {
          label: "Constituição Federal, art. 5º",
          description: "Estabelece que todos são iguais perante a lei, sem distinção de qualquer natureza.",
        },
        {
          label: "Lei nº 12.288/2010 (Estatuto da Igualdade Racial)",
          description: "Institui o Estatuto da Igualdade Racial e garante à população negra a efetivação da igualdade de oportunidades.",
        },
        {
          label: "Convenção nº 169 da OIT",
          description: "Assegura os direitos dos povos indígenas e tribais, ratificada pelo Brasil.",
        },
      ],
      recursos: [
        {
          label: "Microdados",
          description: "Consulte e baixe os dados brutos, registro a registro, com filtros.",
          href: "/orcamento-etnico-racial/microdados",
          kind: "painel",
        },
        {
          label: "Dados abertos do Acre",
          description: "Conjuntos de dados oficiais publicados no portal de dados abertos do Estado.",
          href: "https://dados.ac.gov.br/",
          kind: "dados",
          external: true,
        },
      ],
    },
  },
};

// Orçamentos com dados/painel ativos (exclui os que estão apenas "em construção").
export const activeDashboards: DashboardConfig[] = Object.values(dashboardRegistry).filter(
  (dashboard) => dashboard.status !== "construcao"
);

// Orçamentos que aparecem como cartão nas listagens (grade do portal, acesso rápido,
// admin, rodapé), inclusive os em construção. Exclui os `hidden`, que existem só para ter
// config/rota próprias (ex.: oferecidos como aba dentro do cartão de outro orçamento).
export const allDashboards: DashboardConfig[] = Object.values(dashboardRegistry).filter(
  (dashboard) => !dashboard.hidden
);

export function getDashboardConfig(slug: string): DashboardConfig | undefined {
  return dashboardRegistry[slug];
}
