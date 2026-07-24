import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getActiveSession } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";
import { getDashboardBySlug, dashboardEntriesTag } from "@/lib/dashboards/queries";

/** Desfaz uma importação: remove os registros daquele lote e o próprio lote. */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ dashboardSlug: string; batchId: string }> }
) {
  const session = await getActiveSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado ou conta desativada." }, { status: 401 });
  }

  const { dashboardSlug, batchId } = await params;
  const dashboard = await getDashboardBySlug(dashboardSlug);
  if (!dashboard) {
    return NextResponse.json({ error: "Dashboard não encontrado." }, { status: 404 });
  }

  const batch = await prisma.importBatch.findUnique({ where: { id: batchId } });
  if (!batch || batch.dashboardId !== dashboard.id) {
    return NextResponse.json({ error: "Importação não encontrada." }, { status: 404 });
  }

  // Quem importou desfaz o próprio envio; administradores desfazem qualquer um.
  const isOwner = batch.createdById === session.user.id;
  if (!isOwner && session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Apenas quem fez a importação ou um administrador pode desfazê-la." },
      { status: 403 }
    );
  }

  const removed = await prisma.$transaction(async (tx) => {
    const { count } = await tx.budgetEntry.deleteMany({ where: { importBatchId: batchId } });
    await tx.importBatch.delete({ where: { id: batchId } });
    return count;
  });

  revalidatePath(`/admin/${dashboardSlug}`);
  revalidatePath(`/admin/${dashboardSlug}/importar`);
  revalidatePath(`/${dashboardSlug}/metadados`);
  revalidatePath(`/${dashboardSlug}/microdados`);
  // Expira já, para a exclusão do lote refletir na hora nas páginas públicas.
  revalidateTag(dashboardEntriesTag(dashboardSlug), { expire: 0 });

  return NextResponse.json({ removedRows: removed });
}
