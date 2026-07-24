import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { DashboardBannerCard } from "@/components/dashboard/dashboard-banner-card";
import { DashboardBannerTabs } from "@/components/dashboard/dashboard-banner-tabs";
import { allDashboards, getDashboardConfig } from "@/lib/dashboards/registry";

/** Porta de entrada do portal: painel institucional à esquerda, acesso à direita. */
export default function HomePage() {
  const ano = new Date().getFullYear();

  // Painel institucional ocupa 70% da largura; a coluna de acesso, os 30% restantes.
  return (
    <div className="grid min-h-screen lg:grid-cols-[7fr_3fr]">
      {/* Painel institucional — a fotografia entra como textura sob o verde */}
      <section className="relative flex min-h-[40vh] flex-col justify-between overflow-hidden p-8 text-institutional-foreground sm:p-10 lg:min-h-screen">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/paineis/paineis-fundo.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden="true"
        />
        {/* Véu institucional mais leve: a fotografia aparece, mas o texto branco
            continua legível — daí o reforço no topo e no rodapé, onde há texto. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(0,73,39,0.88) 0%, rgba(0,53,28,0.76) 50%, rgba(0,53,28,0.66) 100%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,40,21,0.35) 0%, rgba(0,40,21,0) 30%, rgba(0,40,21,0) 65%, rgba(0,40,21,0.45) 100%)",
          }}
          aria-hidden="true"
        />

        <div className="relative">
          <a
            href="https://seplan.ac.gov.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit"
          >
            {/* Versão branca (SEPLAN em branco, barra dourada), própria para o painel verde. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-seplan-branco.png"
              alt="SEPLAN — Secretaria de Estado de Planejamento"
              className="h-9 w-auto sm:h-10"
            />
          </a>
        </div>

        <div className="relative max-w-xl py-10">
          <h1 className="text-readable text-4xl font-semibold tracking-tight sm:text-5xl">
            Portal de Dados
            <span className="block text-institutional-gold">Orçamentos Temáticos</span>
          </h1>
          <p className="text-readable mt-5 text-lg leading-relaxed text-white">
            Repositório oficial dos microdados dos orçamentos temáticos do Estado do Acre.
            Consulte, filtre e baixe os dados que fundamentam as análises orçamentárias, em
            compromisso com a transparência e o controle social. Os painéis e relatórios
            tratados estão nos sites de cada orçamento.
          </p>
        </div>

        <div className="text-readable relative space-y-1 text-xs text-white/80">
          <p>
            Secretaria de Estado de Planejamento do Acre — SEPLAN · Departamento de Estudos e
            Planejamento Orçamentário — DEPPO/SEPLAN
          </p>
          <p>
            Coordenador: Denyscley Bandeira · Equipe técnica: Ícaro Gundim, Luísa Ribeiro, Roseneide
            Sena e Vinícius Farias.
          </p>
          <p>© {ano} Governo do Estado do Acre · SEPLAN</p>
          {/* Crédito da fotografia de fundo: separado do rodapé institucional e mais discreto. */}
          <p className="pt-3 text-[0.6875rem] leading-none font-light text-white/55">
            Fotografia: Neto Lucena — SECOM/AC
          </p>
        </div>
      </section>

      {/* Acesso ao portal */}
      <section className="flex items-center justify-center bg-background px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center text-center">
            {/* Versão horizontal, sozinha no topo do acesso: sem título nem subtítulo. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-governo-acre-horizontal.webp"
              alt="Governo do Acre — Trabalho para cuidar das pessoas"
              className="h-32 w-auto max-w-full sm:h-36"
            />
          </div>

          {/* Acesso rápido: os orçamentos são o próprio caminho, sem cara de formulário */}
          <div className="mt-8">
            <Button asChild size="lg" className="h-12 w-full gap-2 text-base">
              <Link href="/portal">
                Acessar Portal
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
            </Button>

            <p className="mt-6 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Acesso rápido
            </p>
            <ul className="mt-3 space-y-2">
              {allDashboards.map((dashboard, i) => {
                // Com orçamentos correlatos (companionSlugs), o cartão vira abas — assim o
                // Étnico-Racial fica acessível pela home, como no portal.
                const companions = (dashboard.companionSlugs ?? [])
                  .map(getDashboardConfig)
                  .filter((config): config is NonNullable<typeof config> => Boolean(config));
                return (
                  <li key={dashboard.slug}>
                    <Reveal delay={i * 90}>
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

          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>© {ano} Governo do Estado do Acre · Uso institucional</span>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 hover:text-foreground"
            >
              <Lock className="size-3.5" aria-hidden="true" />
              Acesso administrativo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
