import type { NextAuthConfig } from "next-auth";

/**
 * Configuration de base partagée — SANS dépendances Node (Prisma, bcrypt).
 * Utilisée par le middleware (edge runtime) ET par la config complète.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 heures
  },
  trustHost: true,
  providers: [], // Les providers sont ajoutés dans auth.ts (Node runtime)
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
