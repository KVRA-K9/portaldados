import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Database, ExternalLink, Scale, Table2 } from "lucide-react";
import { getDashboardConfig } from "@/lib/dashboards/registry";
import { DASHBOARD_ICONS } from "@/lib/dashboards/icons";
import type { DashboardRecurso } from "@/lib/dashboards/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SECTION_NAV = [
  { href: "#sobre", label: "Sobre" },
  { href: "#eixos", label: "Eixos" },
  { href: "#base-legal", label: "Base Legal" },
  { href: "#dados", label: "Dados" },
];

const RECURSO_ICON = {
  painel: Table2,
  bi: Database,
  dados: Database,
} as const;

// Paleta institucional (padrão gov.br), aplicada de forma consistente em todos os dashboards.
const INSTITUTIONAL = "var(--institutional)";
const INSTITUTIONAL_FG = "var(--institutional-foreground)";

export function DashboardLanding({ dashboardSlug }: { dashboardSlug: string }) {
  const config = getDashboardConfig(dashboardSlug);
  if (!config) notFound();

  const HeroIcon = DASHBOARD_ICONS[config.icon];
  const { institutional } = config;

  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden border-b"
        style={{
          background: "linear-gradient(135deg, var(--institutional) 0%, var(--institutional-dark) 100%)",
        }}
      >
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-[1.4fr_1fr] md:items-center md:py-20">
          <div className="animate-fade-up" style={{ color: INSTITUTIONAL_FG }}>
            <p className="text-sm font-medium opacity-90">
              Governo do Estado do Acre · SEPLAN-AC
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl">
              {config.name}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed opacity-95 text-pretty sm:text-lg">
              {institutional.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link href={`/${config.slug}/microdados`} prefetch>
                  Acessar microdados
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-current hover:bg-white/10 hover:text-current"
              >
                <Link href="#sobre">Saiba mais</Link>
              </Button>
            </div>
          </div>
          <div className="hidden justify-center md:flex" aria-hidden="true">
            <div className="flex size-48 items-center justify-center rounded-3xl bg-white/10 ring-1 ring-white/20">
              <HeroIcon className="size-24" style={{ color: INSTITUTIONAL_FG }} />
            </div>
          </div>
        </div>
      </section>

      {/* Section nav */}
      <nav
        aria-label="Seções desta página"
        className="sticky top-16 z-30 border-b bg-background/95 backdrop-blur"
      >
        <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 py-2 sm:px-6">
          {SECTION_NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {item.label}
            </a>
          ))}
          <Link
            href={`/${config.slug}/microdados`}
            prefetch
            className="ml-auto inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap text-primary hover:underline"
          >
            Microdados
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </nav>

      {/* Sobre */}
      <section id="sobre" className="scroll-mt-28 border-b">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <SectionHeading eyebrow="Sobre" title="O que é este orçamento" />
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted-foreground">
            {institutional.sobre.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Eixos */}
      <section id="eixos" className="scroll-mt-28 border-b bg-secondary/30">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <SectionHeading eyebrow="Eixos" title="Áreas de atuação" />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {institutional.eixos.map((eixo) => {
              const Icon = DASHBOARD_ICONS[eixo.icon];
              return (
                <Card
                  key={eixo.title}
                  className="h-full transition duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <CardHeader>
                    <div
                      className="mb-2 flex size-11 items-center justify-center rounded-lg"
                      style={{ backgroundColor: INSTITUTIONAL, color: INSTITUTIONAL_FG }}
                    >
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-lg">{eixo.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{eixo.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Base Legal */}
      <section id="base-legal" className="scroll-mt-28 border-b">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <SectionHeading eyebrow="Base Legal" title="Fundamentação normativa" />
          <ul className="mt-8 space-y-4">
            {institutional.baseLegal.map((item) => (
              <li key={item.label} className="flex gap-4 rounded-lg border bg-card p-4">
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-md bg-accent"
                  style={{ color: INSTITUTIONAL }}
                >
                  <Scale className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Dados / Recursos */}
      <section id="dados" className="scroll-mt-28 border-b bg-secondary/30">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <SectionHeading
            eyebrow="Dados"
            title="Acesso aos dados e recursos"
            description="Consulte e baixe os microdados e os conjuntos de dados abertos deste orçamento."
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {institutional.recursos.map((recurso) => (
              <RecursoCard key={recurso.label} recurso={recurso} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="border-b" style={{ backgroundColor: INSTITUTIONAL }}>
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div style={{ color: INSTITUTIONAL_FG }}>
            <h2 className="text-xl font-semibold tracking-tight">Baixe os microdados</h2>
            <p className="opacity-90">
              Filtre por exercício, eixo e órgão e exporte os dados brutos em CSV ou Excel.
            </p>
          </div>
          <Button asChild size="lg" variant="secondary">
            <Link href={`/${config.slug}/microdados`} prefetch>
              Acessar microdados
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold tracking-wide uppercase" style={{ color: INSTITUTIONAL }}>
        {eyebrow}
      </p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      {description ? <p className="mt-3 text-muted-foreground">{description}</p> : null}
    </div>
  );
}

function RecursoCard({ recurso }: { recurso: DashboardRecurso }) {
  const Icon = RECURSO_ICON[recurso.kind];
  const content = (
    <Card className="group h-full transition-colors hover:border-primary">
      <CardHeader>
        <div className="flex items-center justify-between">
          <span
            className="flex size-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: INSTITUTIONAL, color: INSTITUTIONAL_FG }}
          >
            <Icon className="size-5" aria-hidden="true" />
          </span>
          {recurso.external ? (
            <ExternalLink className="size-4 text-muted-foreground" aria-hidden="true" />
          ) : (
            <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          )}
        </div>
        <CardTitle className="mt-2 text-lg">{recurso.label}</CardTitle>
        <CardDescription>{recurso.description}</CardDescription>
      </CardHeader>
    </Card>
  );

  if (recurso.external) {
    return (
      <a href={recurso.href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }
  return (
    <Link href={recurso.href} className="block">
      {content}
    </Link>
  );
}
