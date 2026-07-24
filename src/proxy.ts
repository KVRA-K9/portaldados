import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoginRoute = req.nextUrl.pathname === "/admin/login";

  if (!req.auth && !isLoginRoute) {
    const loginUrl = new URL("/admin/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (req.auth && isLoginRoute) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  // Gestão de contas é só de administrador. A barreira real está nas server actions
  // (requireAdmin); aqui é apenas para não oferecer uma tela que ele não pode usar.
  const isUsersRoute = req.nextUrl.pathname.startsWith("/admin/usuarios");
  if (isUsersRoute && req.auth?.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
