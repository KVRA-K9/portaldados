import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { parseDashboardFilters } from "@/lib/dashboards/aggregate";

export const metadata: Metadata = {
  title: "Microdados · Orçamento Climático",
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function OrcamentoClimaticoPainelPage({ searchParams }: PageProps) {
  return (
    <DashboardShell
      dashboardSlug="orcamento-climatico"
      filters={parseDashboardFilters(await searchParams)}
    />
  );
}
