import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Database, Download, FileText } from "lucide-react";
import { allDashboards, getDashboardConfig } from "@/lib/dashboards/registry";
import { Reveal } from "@/components/ui/reveal";
import { DashboardBannerCard } from "@/components/dashboard/dashboard-banner-card";
import { DashboardBannerTabs } from "@/components/dashboard/dashboard-banner-tabs";
import { glassButton } from "@/components/dashboard/button-styles";

export const metadata: Metadata = {
  title: "Portal de Dados · Orçamentos Temáticos",
};

// As fotos dos painéis vêm do registry (`bannerImage`) e são renderizadas por
// DashboardBannerCard, compartilhado com a home.
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
      {/* Sobre o portal + Painéis temáticos compartilham UMA única imagem de fundo contínua */}
      <div className="relative isolate overflow-hidden">
        {/* Fundo das duas seções: gradiente institucional sob a foto do "Sobre o portal" */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: "linear-gradient(180deg, #00351c 0%, #04271a 60%, #021a11 100%)",
          }}
          aria-hidden="true"
        />

        {/* Sobre o portal */}
        <section id="sobre-portal" className="relative isolate scroll-mt-16">
          {/* A foto (2400×900) cobre só esta seção: assim é exibida perto do tamanho
              nativo, sem a ampliação que a deixava borrada ao cobrir a página inteira. */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              backgroundImage: "url(/paineis/hero-topo.webp)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "saturate(1.08) contrast(1.05)",
            }}
            aria-hidden="true"
          />
          {/* Véu escuro só o suficiente para o texto branco: mais leve no rodapé da
              seção, onde a foto tem mais presença. */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.42) 55%, rgba(0,0,0,0.30) 100%)",
            }}
            aria-hidden="true"
          />
          <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6">
            <Link href="/" className={glassButton}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              Voltar à página inicial
            </Link>
            <h2 className="mt-6 text-2xl font-semibold tracking-tight text-institutional-gold sm:text-3xl">
              Sobre o Portal
            </h2>
            <div className="mt-8">
              <Reveal className="max-w-3xl">
                {/* Painel de vidro, na mesma linguagem dos cartões de destaque abaixo. */}
                <div
                  className="relative overflow-hidden rounded-xl p-6 ring-1 ring-institutional-gold/30 backdrop-blur-md sm:p-8"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(15,23,42,0.58) 0%, rgba(2,6,23,0.62) 100%)",
                  }}
                >
                  <h3 className="text-readable text-xl font-semibold tracking-tight text-white sm:text-2xl">
                    Transparência na aplicação dos recursos públicos
                  </h3>
                  <div className="mt-4 space-y-4 text-justify text-white text-readable">
                    <p>
                      O Portal de Dados Orçamentários constitui o repositório oficial dos
                      microdados — os dados brutos, em sua menor unidade — dos orçamentos
                      temáticos do Estado do Acre, produzidos pelo Departamento de Estudos e
                      Planejamento Orçamentário da Secretaria de Estado de Planejamento
                      (SEPLAN-AC).
                    </p>
                    <p>
                      Sua finalidade é assegurar a transparência na aplicação dos recursos
                      públicos e viabilizar o uso e o reuso das informações orçamentárias — a
                      exemplo dos orçamentos Climático e Criança e Adolescente — por gestores
                      públicos, pesquisadores e pela sociedade civil, em consonância com os
                      princípios da administração pública. As análises e os painéis tratados a
                      partir desses microdados são disponibilizados nos sites de cada orçamento.
                    </p>
                    <p>
                      Os dados são consolidados pela equipe técnica do Departamento a partir da
                      planilha oficial de cada orçamento e atualizados a cada nova consolidação,
                      assegurando a fidelidade às fontes primárias.
                    </p>
                    <p>
                      Constituem dados públicos, de livre reutilização, recomendando-se a citação
                      da fonte e a preservação de seu conteúdo original.
                    </p>
                  </div>
                </div>
              </Reveal>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {DESTAQUES.map((item, i) => (
                  <Reveal key={item.title} delay={i * 90} className="h-full">
                    <div
                      className="relative flex h-full flex-col overflow-hidden rounded-xl p-5 ring-1 ring-institutional-gold/30 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(15,23,42,0.58) 0%, rgba(2,6,23,0.62) 100%)",
                      }}
                    >
                      {/* Ícone como marca-d'água ao fundo */}
                      <item.icon
                        className="pointer-events-none absolute -bottom-5 -right-4 size-32 text-white/10"
                        aria-hidden="true"
                      />
                      <div className="relative">
                        <h3 className="font-medium text-institutional-gold">{item.title}</h3>
                        <p className="mt-2 text-sm text-justify text-white/90">{item.description}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Painéis temáticos */}
        <section id="paineis" className="relative scroll-mt-16 border-b">
          <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6">
            <h2 className="text-2xl font-semibold tracking-tight text-institutional-gold sm:text-3xl">
              Painéis temáticos
            </h2>
            <div className="mt-8">
              <Reveal className="max-w-2xl">
                <p className="text-sm font-medium text-justify text-white text-readable">
                  Selecione um orçamento temático para conhecer a metodologia, a base
                  legal e acessar os microdados de cada orçamento.
                </p>
              </Reveal>

              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {allDashboards.map((dashboard, i) => {
                  // Com orçamentos correlatos (companionSlugs), o cartão vira abas.
                  const companions = (dashboard.companionSlugs ?? [])
                    .map(getDashboardConfig)
                    .filter((config): config is NonNullable<typeof config> => Boolean(config));
                  return (
                    <Reveal key={dashboard.slug} delay={i * 90} className="h-full">
                      {companions.length > 0 ? (
                        <DashboardBannerTabs tabs={[dashboard, ...companions]} />
                      ) : (
                        <DashboardBannerCard dashboard={dashboard} />
                      )}
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
