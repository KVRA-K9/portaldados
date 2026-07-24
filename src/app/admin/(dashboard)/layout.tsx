import { redirect } from "next/navigation";
import { getActiveSession } from "@/lib/auth-guards";
import { allDashboards } from "@/lib/dashboards/registry";
import { getDashboardDatasetMeta } from "@/lib/dashboards/queries";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminTabs, type AdminTab } from "@/components/admin/admin-tabs";
import { AdminBackdrop } from "@/components/admin/admin-backdrop";

function formatDateTime(date: Date | null): string | undefined {
  if (!date) return undefined;
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(date);
}

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Conta desativada (ou removida) cai fora mesmo com a sessão ainda assinada.
  const session = await getActiveSession();
  if (!session) {
    redirect("/admin/login");
  }

  // Cabeçalho mostra o estado consolidado dos dados publicados.
  const metas = await Promise.all(
    allDashboards.map((dashboard) => getDashboardDatasetMeta(dashboard.slug))
  );
  const lastUpdated = metas
    .map((meta) => meta?.lastUpdated ?? null)
    .filter((date): date is Date => date instanceof Date)
    .sort((a, b) => b.getTime() - a.getTime())[0] ?? null;
  const years = metas.flatMap((meta) =>
    meta?.firstYear && meta?.lastYear ? [meta.firstYear, meta.lastYear] : []
  );
  const period =
    years.length > 0
      ? Math.min(...years) === Math.max(...years)
        ? String(years[0])
        : `${Math.min(...years)}–${Math.max(...years)}`
      : undefined;

  const tabs: AdminTab[] = [
    { href: "/admin", label: "Visão geral" },
    ...allDashboards.map((dashboard) => ({
      href: `/admin/${dashboard.slug}/importar`,
      label: dashboard.shortName,
    })),
    ...(session.user.role === "ADMIN" ? [{ href: "/admin/usuarios", label: "Usuários" }] : []),
    { href: "/admin/minha-conta", label: "Minha conta" },
  ];

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Fundo em tela cheia: imagem do orçamento nas páginas de importação, neutro nas demais */}
      <AdminBackdrop />
      <AdminHeader
        userEmail={session.user.email}
        updatedAt={formatDateTime(lastUpdated)}
        period={period}
      />
      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 sm:px-6">{children}</main>
      <AdminTabs tabs={tabs} />
    </div>
  );
}
