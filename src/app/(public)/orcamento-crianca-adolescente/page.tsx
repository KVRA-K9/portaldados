import type { Metadata } from "next";
import { DashboardLanding } from "@/components/dashboard/dashboard-landing";

export const metadata: Metadata = {
  title: "Orçamento Criança e Adolescente",
};

export default function OrcamentoCriancaAdolescentePage() {
  return <DashboardLanding dashboardSlug="orcamento-crianca-adolescente" />;
}
