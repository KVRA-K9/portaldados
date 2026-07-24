import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getActiveSession } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";
import { UsersPanel, type AdminUserRow } from "@/components/admin/users-panel";

export const metadata: Metadata = {
  title: "Usuários",
};

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await getActiveSession();
  if (!session) redirect("/admin/login");
  if (session.user.role !== "ADMIN") redirect("/admin");

  const users = await prisma.user.findMany({
    orderBy: [{ isActive: "desc" }, { createdAt: "asc" }],
    include: { createdBy: { select: { name: true, email: true } } },
  });

  const rows: AdminUserRow[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(user.createdAt),
    createdByName: user.createdBy?.name ?? user.createdBy?.email ?? null,
  }));

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-readable text-2xl font-semibold tracking-tight text-white">Usuários</h1>
        <p className="text-readable text-white/90">
          Contas dos servidores do setor que mantêm os dados do portal. Apenas administradores
          acessam esta página.
        </p>
      </div>

      <UsersPanel users={rows} currentUserId={session.user.id} />
    </div>
  );
}
