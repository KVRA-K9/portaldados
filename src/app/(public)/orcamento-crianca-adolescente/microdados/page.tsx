import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { parseDashboardFilters } from "@/lib/dashboards/aggregate";

export const metadata: Metadata = {
  title: "Microdados · Orçamento Criança e Adolescente",
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function OrcamentoCriancaAdolescentePainelPage({ searchParams }: PageProps) {
  return (
    <DashboardShell
      dashboardSlug="orcamento-crianca-adolescente"
      filters={parseDashboardFilters(await searchParams)}
    />
  );
}
