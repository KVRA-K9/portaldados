import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getActiveSession } from "@/lib/auth-guards";
import { roleLabels } from "@/lib/schemas/user";
import { ChangePasswordForm } from "@/components/admin/change-password-form";
import { ProfileForm } from "@/components/admin/profile-form";

export const metadata: Metadata = {
  title: "Minha conta",
};

export const dynamic = "force-dynamic";

export default async function MinhaContaPage() {
  const session = await getActiveSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-readable text-2xl font-semibold tracking-tight text-white">Minha conta</h1>
        <p className="text-readable text-white/90">
          Se você recebeu uma senha provisória, troque-a agora por uma que só você conheça.
        </p>
      </div>

      <section
        aria-label="Dados da conta"
        className="glass-surface rounded-lg border p-5 ring-1 ring-institutional-gold/30"
      >
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-medium">Meus dados</h2>
          <p className="text-sm text-muted-foreground">
            Perfil de acesso: {roleLabels[session.user.role]} (definido por um administrador)
          </p>
        </div>
        <ProfileForm name={session.user.name ?? ""} email={session.user.email} />
      </section>

      <section
        aria-label="Alterar senha"
        className="glass-surface rounded-lg border p-5 ring-1 ring-institutional-gold/30"
      >
        <h2 className="mb-4 text-lg font-medium">Alterar senha</h2>
        <ChangePasswordForm />
      </section>
    </div>
  );
}
