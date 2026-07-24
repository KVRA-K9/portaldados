import type { Metadata } from "next";
import { DashboardLanding } from "@/components/dashboard/dashboard-landing";

export const metadata: Metadata = {
  title: "Orçamento Climático",
};

export default function OrcamentoClimaticoPage() {
  return <DashboardLanding dashboardSlug="orcamento-climatico" />;
}
