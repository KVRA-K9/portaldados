"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Undo2 } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export type ImportBatchRow = {
  id: string;
  fileName: string;
  createdAt: string;
  authorName: string;
  successRows: number;
  errorRows: number;
  /** Registros ainda no banco vindos deste lote (0 = já substituído por outra importação). */
  currentRows: number;
};

export function ImportHistory({
  dashboardSlug,
  batches,
}: {
  dashboardSlug: string;
  batches: ImportBatchRow[];
}) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function undo(batchId: string) {
    setPendingId(batchId);
    try {
      const response = await fetch(`/api/admin/${dashboardSlug}/import/${batchId}`, {
        method: "DELETE",
      });
      const json = await response.json();
      if (!response.ok) {
        toast.error(json.error ?? "Não foi possível desfazer a importação.");
        return;
      }
      toast.success(`Importação desfeita: ${json.removedRows} registro(s) removido(s).`);
      router.refresh();
    } catch {
      toast.error("Não foi possível desfazer a importação.");
    } finally {
      setPendingId(null);
    }
  }

  if (batches.length === 0) {
    return (
      <p className="rounded-lg border border-dashed bg-card/60 p-8 text-center text-sm text-muted-foreground">
        Nenhuma importação registrada neste orçamento.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Arquivo</TableHead>
            <TableHead>Quem importou</TableHead>
            <TableHead>Quando</TableHead>
            <TableHead>Linhas</TableHead>
            <TableHead>No portal</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {batches.map((batch) => (
            <TableRow key={batch.id}>
              <TableCell className="font-medium">{batch.fileName}</TableCell>
              <TableCell className="text-muted-foreground">{batch.authorName}</TableCell>
              <TableCell className="text-muted-foreground">{batch.createdAt}</TableCell>
              <TableCell className="tabular-nums">
                {batch.successRows}
                {batch.errorRows > 0 ? (
                  <span className="text-destructive"> (+{batch.errorRows} com erro)</span>
                ) : null}
              </TableCell>
              <TableCell className="tabular-nums">
                {batch.currentRows > 0 ? (
                  batch.currentRows
                ) : (
                  <span className="text-muted-foreground">substituída</span>
                )}
              </TableCell>
              <TableCell className="flex justify-end">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5"
                      disabled={pendingId === batch.id}
                    >
                      <Undo2 className="size-4" aria-hidden="true" />
                      Desfazer
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Desfazer esta importação?</AlertDialogTitle>
                      <AlertDialogDescription>
                        {batch.currentRows > 0
                          ? `Os ${batch.currentRows} registro(s) publicados por "${batch.fileName}" serão removidos do portal. Se eles substituíram dados anteriores, esses dados não voltam — é preciso importar a planilha antiga de novo.`
                          : `Esta importação já foi substituída por outra e não tem registros no portal; ela sairá apenas do histórico.`}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => undo(batch.id)}>Desfazer</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
