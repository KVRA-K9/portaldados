import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { allDashboards, getDashboardConfig } from "@/lib/dashboards/registry";
import { Reveal } from "@/components/ui/reveal";
import { DashboardBannerCard } from "@/components/dashboard/dashboard-banner-card";
import { DashboardBannerTabs } from "@/components/dashboard/dashboard-banner-tabs";
import { glassButton } from "@/components/dashboard/button-styles";

export const metadata: Metadata = {
  title: "Painéis Temáticos · Portal de Dados",
};

// As fotos dos painéis vêm do registry (`bannerImage`) e são renderizadas por
// DashboardBannerCard, compartilhado com a home.
export default function PaineisPage() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Mesmo fundo institucional do portal, para manter a continuidade visual. */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(180deg, #00351c 0%, #04271a 60%, #021a11 100%)",
        }}
        aria-hidden="true"
      />
      <section id="paineis" className="relative scroll-mt-16 border-b">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6">
          <Link href="/portal" className={glassButton}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Voltar à visão geral
          </Link>
          <h2 className="mt-6 text-2xl font-semibold tracking-tight text-institutional-gold sm:text-3xl">
            Painéis temáticos
          </h2>
          <div className="mt-8">
            <Reveal className="max-w-2xl">
              <p className="text-sm font-medium text-justify text-white text-readable">
                Selecione um orçamento temático para conhecer a metodologia, a base
                legal e acessar os microdados de cada orçamento.
              </p>
            </Reveal>

            {/* Um painel por linha: cartões em largura total, empilhados com rolagem. */}
            <div className="mt-8 flex flex-col gap-5">
              {allDashboards.map((dashboard, i) => {
                // Com orçamentos correlatos (companionSlugs), o cartão vira abas.
                const companions = (dashboard.companionSlugs ?? [])
                  .map(getDashboardConfig)
                  .filter((config): config is NonNullable<typeof config> => Boolean(config));
                return (
                  <Reveal key={dashboard.slug} delay={i * 55} className="h-full">
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
  );
}
