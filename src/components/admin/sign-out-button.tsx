"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white dark:border-white/30 dark:bg-white/10 dark:hover:bg-white/20"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
    >
      <LogOut className="size-4" aria-hidden="true" />
      Sair
    </Button>
  );
}
