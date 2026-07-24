import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ dashboardSlug: string }>;
};

/** Cada orçamento tem uma única tela no admin: a importação da planilha oficial. */
export default async function AdminDashboardPage({ params }: PageProps) {
  const { dashboardSlug } = await params;
  redirect(`/admin/${dashboardSlug}/importar`);
}
