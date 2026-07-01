import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Instance edge-safe (sans Prisma) pour la protection des routes.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/admin/login";
  const isLoggedIn = !!req.auth;

  // Déjà connecté → la page de login redirige vers le dashboard.
  if (isLoginPage && isLoggedIn) {
    return Response.redirect(new URL("/admin/dashboard", req.nextUrl));
  }

  // Route admin protégée sans session → redirection vers login.
  if (isAdminRoute && !isLoginPage && !isLoggedIn) {
    return Response.redirect(new URL("/admin/login", req.nextUrl));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
