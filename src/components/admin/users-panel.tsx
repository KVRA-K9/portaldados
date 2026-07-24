"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, ShieldOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserForm } from "./user-form";
import {
  TemporaryPasswordDialog,
  type TemporaryPassword,
} from "./temporary-password-dialog";
import { createUser, resetUserPassword, setUserActive, updateUserRole } from "@/lib/users/user-actions";
import { roleLabels, userRoles, type UserInput } from "@/lib/schemas/user";
import type { UserRole } from "@/generated/prisma/client";

export type AdminUserRow = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  createdByName: string | null;
};

export function UsersPanel({
  users,
  currentUserId,
}: {
  users: AdminUserRow[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [credential, setCredential] = useState<TemporaryPassword | null>(null);

  async function handleCreate(input: UserInput) {
    const result = await createUser(input);
    if (!result.success) {
      toast.error(result.error);
      return { ok: false, error: result.error };
    }
    setCredential({ email: result.email, password: result.temporaryPassword });
    router.refresh();
    return { ok: true };
  }

  function handleReset(userId: string) {
    startTransition(async () => {
      const result = await resetUserPassword(userId);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setCredential({ email: result.email, password: result.temporaryPassword });
    });
  }

  function handleToggleActive(userId: string, isActive: boolean) {
    startTransition(async () => {
      const result = await setUserActive(userId, isActive);
      if (result.success) {
        toast.success(isActive ? "Acesso reativado." : "Acesso desativado.");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  function handleRoleChange(userId: string, role: UserRole) {
    startTransition(async () => {
      const result = await updateUserRole(userId, role);
      if (result.success) {
        toast.success("Perfil atualizado.");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Vidro sobre a fotografia do fundo: a classe também acerta as cores do
          formulário, feito para superfície clara (ver .glass-surface em globals.css). */}
      <section
        aria-label="Cadastrar servidor"
        className="glass-surface rounded-lg border p-5 ring-1 ring-institutional-gold/30"
      >
        <h2 className="text-lg font-medium">Cadastrar servidor</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          A senha provisória é gerada pelo sistema e exibida uma única vez, para você entregar ao
          servidor.
        </p>
        <UserForm onSubmit={handleCreate} />
      </section>

      <section aria-label="Contas cadastradas" className="space-y-3">
        <h2 className="text-readable text-lg font-medium text-white">Contas cadastradas</h2>
        <div className="glass-surface overflow-hidden rounded-lg border shadow-sm ring-1 ring-institutional-gold/30">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Situação</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const isSelf = user.id === currentUserId;
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.name ?? "—"}
                      {isSelf ? (
                        <span className="ml-2 text-xs text-muted-foreground">(você)</span>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        disabled={isSelf || isPending}
                        onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
                      >
                        <SelectTrigger className="w-[190px]" aria-label={`Perfil de ${user.email}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent position="popper" align="start" sideOffset={4}>
                          {userRoles.map((value) => (
                            <SelectItem key={value} value={value}>
                              {roleLabels[value]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {user.isActive ? (
                        <Badge variant="secondary">Ativo</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">Desativado</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.createdAt}
                      {user.createdByName ? ` · por ${user.createdByName}` : ""}
                    </TableCell>
                    <TableCell className="flex justify-end gap-1">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="gap-1.5" disabled={isPending}>
                            <KeyRound className="size-4" aria-hidden="true" />
                            Redefinir senha
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Redefinir a senha de {user.email}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              A senha atual deixa de funcionar imediatamente. Uma nova senha
                              provisória será exibida para você entregar ao servidor.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleReset(user.id)}>
                              Gerar nova senha
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      {user.isActive ? (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1.5"
                              disabled={isSelf || isPending}
                            >
                              <ShieldOff className="size-4" aria-hidden="true" />
                              Desativar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Desativar o acesso de {user.email}?</AlertDialogTitle>
                              <AlertDialogDescription>
                                A conta deixa de entrar no painel, mas continua registrada como
                                autora dos dados que importou ou editou.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleToggleActive(user.id, false)}>
                                Desativar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5"
                          disabled={isPending}
                          onClick={() => handleToggleActive(user.id, true)}
                        >
                          <ShieldCheck className="size-4" aria-hidden="true" />
                          Reativar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </section>

      <TemporaryPasswordDialog credential={credential} onClose={() => setCredential(null)} />
    </div>
  );
}
