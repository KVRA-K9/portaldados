"use client";

import { useState } from "react";
import { Check, Copy, KeyRound } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type TemporaryPassword = { email: string; password: string };

/** Único momento em que a senha provisória existe em claro — depois só o hash fica no banco. */
export function TemporaryPasswordDialog({
  credential,
  onClose,
}: {
  credential: TemporaryPassword | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!credential) return;
    await navigator.clipboard.writeText(credential.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog
      open={credential !== null}
      onOpenChange={(open) => {
        if (!open) {
          setCopied(false);
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="size-4" aria-hidden="true" />
            Senha provisória
          </DialogTitle>
          <DialogDescription>
            Entregue estes dados ao servidor. A senha não será exibida novamente — se ela se
            perder, gere uma nova pela opção &quot;Redefinir senha&quot;.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 rounded-lg border bg-muted/40 p-4 text-sm">
          <p>
            <span className="text-muted-foreground">Acesso: </span>
            <span className="font-medium">{credential?.email}</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="text-muted-foreground">Senha: </span>
            <code className="rounded bg-background px-2 py-1 font-mono text-sm">
              {credential?.password}
            </code>
            <Button variant="ghost" size="icon-sm" onClick={handleCopy} aria-label="Copiar senha">
              {copied ? (
                <Check className="size-4" aria-hidden="true" />
              ) : (
                <Copy className="size-4" aria-hidden="true" />
              )}
            </Button>
          </p>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Concluído</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
