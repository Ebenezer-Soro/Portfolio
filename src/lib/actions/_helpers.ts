import "server-only";
import { auth } from "@/lib/auth";

/** Garde-fou : lève une erreur si l'utilisateur n'est pas authentifié. */
export async function assertAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Non autorisé");
  return session;
}
