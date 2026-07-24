import type { Metadata } from "next";
import { DashboardMetadata } from "@/components/dashboard/dashboard-metadata";
import { parseDashboardFilters } from "@/lib/dashboards/aggregate";

export const metadata: Metadata = {
  title: "Metadados · Orçamento Criança e Adolescente",
};

// Reflete sempre o dataset atual (muda a cada importação/edição pela equipe).
export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function OrcamentoCriancaAdolescenteMetadadosPage({
  searchParams,
}: PageProps) {
  return (
    <DashboardMetadata
      dashboardSlug="orcamento-crianca-adolescente"
      filters={parseDashboardFilters(await searchParams)}
    />
  );
}
