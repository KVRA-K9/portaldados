import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getActiveSession } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";
import { getDashboardBySlug } from "@/lib/dashboards/queries";
import { budgetEntryImportRowSchema, type BudgetEntryImportRow } from "@/lib/schemas/budget-entry";

export type ImportMode = "replace-years" | "append";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ dashboardSlug: string }> }
) {
  const session = await getActiveSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado ou conta desativada." }, { status: 401 });
  }

  const { dashboardSlug } = await params;
  const dashboard = await getDashboardBySlug(dashboardSlug);
  if (!dashboard) {
    return NextResponse.json({ error: "Dashboard não encontrado." }, { status: 404 });
  }

  const body = (await request.json()) as {
    fileName?: string;
    rows?: unknown[];
    mode?: ImportMode;
  };
  const fileName = body.fileName ?? "importacao.csv";
  const mode: ImportMode = body.mode === "append" ? "append" : "replace-years";

  if (!Array.isArray(body.rows) || body.rows.length === 0) {
    return NextResponse.json({ error: "Nenhuma linha válida para importar." }, { status: 400 });
  }

  // Revalida no servidor — nunca confia apenas na validação feita no preview do cliente.
  const validatedRows: BudgetEntryImportRow[] = [];
  let errorRows = 0;
  for (const row of body.rows) {
    const parsed = budgetEntryImportRowSchema.safeParse(row);
    if (parsed.success) {
      validatedRows.push(parsed.data);
    } else {
      errorRows += 1;
    }
  }

  if (validatedRows.length === 0) {
    return NextResponse.json({ error: "Nenhuma linha válida para importar." }, { status: 400 });
  }

  const categoryNames = Array.from(new Set(validatedRows.map((row) => row.categoryName)));
  const existingCategories = await prisma.category.findMany({
    where: { dashboardId: dashboard.id, name: { in: categoryNames } },
  });
  const categoryIdByName = new Map(existingCategories.map((c) => [c.name, c.id]));

  const missingNames = categoryNames.filter((name) => !categoryIdByName.has(name));
  for (const name of missingNames) {
    const created = await prisma.category.create({
      data: { dashboardId: dashboard.id, name },
    });
    categoryIdByName.set(name, created.id);
  }

  const fiscalYears = Array.from(new Set(validatedRows.map((row) => row.fiscalYear)));

  const result = await prisma.$transaction(async (tx) => {
    // "replace-years": reimportar a mesma planilha corrige os dados em vez de duplicar.
    const replaced =
      mode === "replace-years"
        ? (
            await tx.budgetEntry.deleteMany({
              where: { dashboardId: dashboard.id, fiscalYear: { in: fiscalYears } },
            })
          ).count
        : 0;

    const batch = await tx.importBatch.create({
      data: {
        dashboardId: dashboard.id,
        fileName,
        status: "COMMITTED",
        totalRows: validatedRows.length + errorRows,
        successRows: validatedRows.length,
        errorRows,
        createdById: session.user.id,
      },
    });

    await tx.budgetEntry.createMany({
      data: validatedRows.map((row) => ({
        dashboardId: dashboard.id,
        categoryId: categoryIdByName.get(row.categoryName)!,
        fiscalYear: row.fiscalYear,
        region: row.region,
        fundingSource: row.fundingSource,
        agency: row.agency,
        managementUnit: row.managementUnit,
        program: row.program,
        action: row.action,
        description: row.description,
        valuePlanned: row.valuePlanned,
        valueCommitted: row.valueCommitted,
        valueExecuted: row.valueExecuted,
        valuePaid: row.valuePaid,
        importBatchId: batch.id,
        createdById: session.user.id,
      })),
    });

    return { batch, replaced };
  });

  revalidatePath(`/admin/${dashboardSlug}`);
  revalidatePath(`/admin/${dashboardSlug}/importar`);
  revalidatePath(`/${dashboardSlug}/metadados`);
  revalidatePath(`/${dashboardSlug}/microdados`);

  return NextResponse.json({
    importBatchId: result.batch.id,
    successRows: validatedRows.length,
    errorRows,
    replacedRows: result.replaced,
    fiscalYears,
  });
}
