import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "./prisma";
import { authConfig } from "./auth.config";
import { ipDe, limiter } from "./rate-limit";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/**
 * Empreinte bcrypt factice, comparée lorsque l'e-mail est inconnu.
 *
 * Sans elle, un e-mail inexistant renvoie immédiatement tandis qu'un e-mail
 * valide subit le coût de bcrypt : l'écart de temps de réponse suffit à
 * énumérer les comptes existants. On paie donc toujours le même prix.
 */
const EMPREINTE_FACTICE = "$2b$10$CwTycUXWue0Thq9StjUM0uJ8.KJ7Zq0/8s2gGVR1PtEbBQGvJm/1e";

// 5 tentatives par quart d'heure et par IP.
const MAX_TENTATIVES = 5;
const FENETRE_MS = 15 * 60 * 1000;

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials, request) {
        const ip = request instanceof Request ? ipDe(request) : "inconnue";
        if (!limiter(`login:${ip}`, MAX_TENTATIVES, FENETRE_MS).autorise) {
          // Message volontairement identique à un échec d'identifiants : ne
          // pas indiquer à un attaquant qu'il a déclenché une protection.
          return null;
        }

        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const admin = await prisma.admin.findUnique({ where: { email } });

        // Comparaison systématique, y compris sans compte, pour un temps de
        // réponse constant (cf. EMPREINTE_FACTICE).
        const valid = await bcrypt.compare(password, admin?.password ?? EMPREINTE_FACTICE);
        if (!admin || !valid) return null;

        return { id: admin.id, name: admin.name, email: admin.email };
      },
    }),
  ],
});
