import { MapPin } from "lucide-react";
import { allDashboards } from "@/lib/dashboards/registry";

// Sites institucionais de cada orçamento temático (páginas oficiais na Seplan/AC).
// Derivado do registry para manter uma única fonte de verdade com os cards do portal.
const ORCAMENTOS = allDashboards.map((dashboard) => ({
  label: dashboard.name,
  href: dashboard.siteUrl,
}));

// URLs institucionais — confirme/atualize conforme os endereços oficiais.
const INSTITUCIONAL = [
  { label: "Seplan/AC", href: "https://seplan.ac.gov.br/" },
  { label: "Portal da Transparência", href: "https://transparencia.ac.gov.br/" },
  { label: "Diário Oficial", href: "https://diario.ac.gov.br/" },
  { label: "Legislativo do Acre", href: "https://www.al.ac.leg.br/" },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t bg-secondary/40">
      <div className="relative z-10">
        {/* Marca + colunas de navegação */}
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="w-fit rounded-lg bg-background/70 p-4 backdrop-blur-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-governo-acre.webp"
              alt="Governo do Acre 2023-2026 — Trabalho para cuidar das pessoas"
              className="h-28 w-auto sm:h-32"
            />
          </div>

          <nav aria-label="Conheça os orçamentos">
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Conheça os orçamentos
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {ORCAMENTOS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Links institucionais">
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Institucional
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {INSTITUCIONAL.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Copyright + endereço */}
        <div className="border-t border-border/60">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-muted-foreground sm:px-6 md:flex-row md:items-start md:justify-between">
            <p className="max-w-2xl">
              © {new Date().getFullYear()} Governo do Estado do Acre · Secretaria de
              Estado de Planejamento do Acre — Departamento de Estudos e Planejamento
              Orçamentário · DEPPO/SEPLAN
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              Av. Getúlio Vargas, 232 · Centro · Rio Branco · Acre · CEP 69900-060
            </p>
          </div>
        </div>

        {/* Coordenação / equipe técnica */}
        <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
          <p className="max-w-4xl text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Coordenador:</span> Denyscley
            Oliveira Bandeira (Gestor de Políticas Públicas);{" "}
            <span className="font-medium text-foreground">Equipe Técnica:</span> Ícaro
            Lebre Gundim (Economista), Luísa Nascimento Ribeiro (Economista), Roseneide
            Sena (Especialista Executiva Administradora), Vinícius Carneiro de Farias
            (Economista).
          </p>
        </div>
      </div>
    </footer>
  );
}
