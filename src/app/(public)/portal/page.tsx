import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Database, Download, FileText } from "lucide-react";
import { getDashboardConfig, allDashboards } from "@/lib/dashboards/registry";
import { Reveal } from "@/components/ui/reveal";
import { DashboardBannerCard } from "@/components/dashboard/dashboard-banner-card";
import { DashboardBannerTabs } from "@/components/dashboard/dashboard-banner-tabs";
import { glassButton } from "@/components/dashboard/button-styles";

export const metadata: Metadata = {
  title: "Portal de Dados · Orçamentos Temáticos",
};

// As fotos dos painéis vêm do registry (`bannerImage`) e são renderizadas por
// DashboardBannerCard, compartilhado com a home.

// Faixas de fundo da "Visão Geral": as três imagens dos orçamentos; cada faixa
// oferece o acesso direto aos metadados do orçamento correspondente.
const GALERIA = [
  "orcamento-climatico",
  "orcamento-crianca-adolescente",
  "orcamento-sensivel-ao-genero",
] as const;

/** Estilo de fundo da faixa, a partir do registry (bannerImage + bannerPosition).
 *  `filtro` opcional é prefixado (ex.: "url(#aquarela)"). */
function imagemFundo(slug: (typeof GALERIA)[number], filtro?: string) {
  const config = getDashboardConfig(slug);
  if (!config?.bannerImage) return undefined;
  return {
    backgroundImage: `url(${config.bannerImage})`,
    backgroundSize: "cover",
    backgroundPosition: config.bannerPosition ?? "center",
    filter: `${filtro ? `${filtro} ` : ""}saturate(1.08) contrast(1.05)`,
  } as const;
}

const DESTAQUES = [
  {
    icon: Database,
    title: "Microdados na fonte primária",
    description:
      "Os dados brutos de cada orçamento temático, em sua menor unidade — a base que fundamenta as análises, sem tratamento intermediário.",
  },
  {
    icon: Download,
    title: "Consulta e acesso aberto",
    description:
      "Filtragem por exercício, eixo e órgão e obtenção dos dados em CSV ou Excel, para reuso em conformidade com os princípios de dados abertos.",
  },
  {
    icon: FileText,
    title: "Metadados e procedência",
    description:
      "Dicionário de cada campo publicado e a rastreabilidade dos dados: arquivo de referência e data da última atualização.",
  },
];

export default function PortalPage() {
  return (
    <div>
      {/* Sobre o portal */}
      <div className="relative isolate overflow-hidden">
        {/* Fundo: gradiente institucional sob as faixas de imagem */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: "linear-gradient(180deg, #00351c 0%, #04271a 60%, #021a11 100%)",
          }}
          aria-hidden="true"
        />

        {/* Sobre o portal: três faixas em largura total (uma por imagem dos orçamentos),
            com o conteúdo distribuído sobre as fotos — percorridas pela rolagem. */}
        <section id="sobre-portal" className="relative isolate scroll-mt-16">
          {/* Faixa 1 — Visão Geral sobre a foto do Croa em visual de desenho/aquarela,
              dialogando com as ilustrações das demais faixas. A imagem fica levemente
              maior (-inset) porque o filtro de deslocamento "come" as bordas. */}
          <div className="relative overflow-hidden">
            <div
              className="absolute -inset-4"
              style={imagemFundo(GALERIA[0], "url(#aquarela)")}
              aria-hidden="true"
            />
            {/* Véu escuro só o suficiente para o texto branco. */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.35) 100%)",
              }}
              aria-hidden="true"
            />
            <div className="relative mx-auto flex min-h-[92vh] max-w-[1440px] flex-col px-4 py-14 sm:px-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Link href="/" className={glassButton}>
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Voltar à página inicial
                </Link>
              </div>
              <h2 className="mt-6 text-3xl font-semibold tracking-tight text-institutional-gold sm:text-4xl">
                Visão Geral
              </h2>
              <Reveal className="mt-10 max-w-3xl">
                {/* Texto direto sobre a foto (com sombra), no lugar do quadro pesado. */}
                <h3 className="text-readable text-xl font-semibold text-balance text-white drop-shadow-md sm:text-2xl">
                  Transparência na aplicação dos recursos públicos
                </h3>
                <p className="mt-6 text-lg text-justify text-white drop-shadow-md text-readable sm:text-xl">
                  O Portal de Dados Orçamentários constitui o repositório oficial dos microdados —
                  os dados brutos, em sua menor unidade — dos orçamentos temáticos do Estado do
                  Acre, produzidos pelo Departamento de Estudos e Planejamento Orçamentário da
                  Secretaria de Estado de Planejamento (SEPLAN-AC).
                </p>
                <p className="mt-4 text-lg text-justify text-white drop-shadow-md text-readable sm:text-xl">
                  Sua finalidade é assegurar a transparência na aplicação dos recursos públicos e
                  viabilizar o uso e o reuso das informações orçamentárias — a exemplo dos
                  orçamentos Climático e Criança e Adolescente — por gestores públicos,
                  pesquisadores e pela sociedade civil, em consonância com os princípios da
                  administração pública. As análises e os painéis tratados a partir desses
                  microdados são disponibilizados nos sites de cada orçamento.
                </p>
              </Reveal>
            </div>
          </div>

          {/* Faixa 2 — destaques sobre a imagem do orçamento Criança e Adolescente */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0" style={imagemFundo(GALERIA[1])} aria-hidden="true" />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/30"
              aria-hidden="true"
            />
            <div className="relative mx-auto flex min-h-[78vh] max-w-[1440px] items-center px-4 py-14 sm:px-6">
              <div className="grid w-full gap-8 md:grid-cols-3">
                {DESTAQUES.map((item, i) => (
                  <Reveal key={item.title} delay={i * 55} className="h-full">
                    {/* Sem caixa: texto direto sobre a foto, com sombra para leitura. */}
                    <div className="relative h-full">
                      <item.icon
                        className="pointer-events-none absolute -bottom-5 -right-4 size-32 text-white/10"
                        aria-hidden="true"
                      />
                      <div className="relative">
                        <h3 className="text-xl font-semibold text-institutional-gold drop-shadow-md sm:text-2xl">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-lg text-justify text-white drop-shadow-md text-readable sm:text-xl">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

        </section>

        {/* Consolidação e reuso + Painéis: a imagem das mulheres veste as duas regiões
            de uma vez — uma foto só, sem recomeço na emenda. O véu é contínuo, mais
            escuro no ponto de encontro com a faixa anterior e clareando até o fim
            da página. */}
        <div className="relative">
          <div className="absolute inset-0" style={imagemFundo(GALERIA[2])} aria-hidden="true" />
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/30"
            aria-hidden="true"
          />
          <div className="relative mx-auto flex min-h-[78vh] max-w-[1440px] items-center px-4 py-14 sm:px-6">
              <div className="max-w-3xl">
                {/* Título no mesmo padrão dos demais ("Visão Geral", "Painéis"). */}
                <h2 className="text-3xl font-semibold tracking-tight text-institutional-gold sm:text-4xl">
                  Consolidação
                </h2>
                <Reveal className="mt-10">
                  {/* Sem caixa: texto direto sobre a foto, com sombra para leitura. */}
                  <p className="text-lg text-justify text-white drop-shadow-md text-readable sm:text-xl">
                    Os dados são consolidados pela equipe técnica do Departamento a partir da
                    planilha oficial de cada orçamento e atualizados a cada nova consolidação,
                    assegurando a fidelidade às fontes primárias.
                  </p>
                  <p className="mt-4 text-lg text-justify text-white drop-shadow-md text-readable sm:text-xl">
                    Constituem dados públicos, de livre reutilização, recomendando-se a citação da
                    fonte e a preservação de seu conteúdo original.
                  </p>
                </Reveal>
              </div>
          </div>

          {/* Painéis: acesso rápido a cada orçamento, com os mesmos cartões compactos
              da home, um abaixo do outro. Alinhado à esquerda no contêiner largo de
              1440px — o mesmo encadear das faixas do Sobre —, com a coluna dos cartões
              alargada (até 4xl) para a foto e os botões respirarem, sem ultrapassar a
              proporção dos textos ao lado. */}
          <section id="paineis" className="relative border-b">
            <div className="relative mx-auto max-w-[1440px] px-4 py-14 sm:px-6">
              <h2 className="text-3xl font-semibold tracking-tight text-institutional-gold sm:text-4xl">
                Painéis
              </h2>
              <ul className="mt-3 max-w-4xl space-y-3">
                {allDashboards.map((dashboard, i) => {
                  // Com orçamentos correlatos (companionSlugs), o cartão vira abas — assim
                  // o Étnico-Racial fica acessível aqui, como na home.
                  const companions = (dashboard.companionSlugs ?? [])
                    .map(getDashboardConfig)
                    .filter((config): config is NonNullable<typeof config> => Boolean(config));
                  return (
                    <li key={dashboard.slug}>
                      <Reveal delay={i * 55}>
                        {companions.length > 0 ? (
                          <DashboardBannerTabs tabs={[dashboard, ...companions]} compact />
                        ) : (
                          <DashboardBannerCard dashboard={dashboard} compact />
                        )}
                      </Reveal>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
