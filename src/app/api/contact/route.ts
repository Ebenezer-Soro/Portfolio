import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";
import { ipDe, limiter } from "@/lib/rate-limit";

export const runtime = "nodejs";

// 5 messages par heure et par IP : large pour un usage légitime, dissuasif
// pour un robot de spam.
const MAX_PAR_HEURE = 5;

// POST /api/contact — enregistre un message de contact.
export async function POST(req: NextRequest) {
  const { autorise, resetDans } = limiter(`contact:${ipDe(req)}`, MAX_PAR_HEURE, 3_600_000);
  if (!autorise) {
    return NextResponse.json(
      { error: "Trop de messages envoyés. Réessayez plus tard." },
      { status: 429, headers: { "Retry-After": String(resetDans) } },
    );
  }

  try {
    // Borne la charge utile avant même de la lire : sans cela, un corps de
    // plusieurs mégaoctets serait désérialisé puis rejeté par Zod, après avoir
    // déjà consommé la mémoire du serveur.
    const brut = await req.text();
    if (brut.length > 20_000) {
      return NextResponse.json({ error: "Message trop volumineux." }, { status: 413 });
    }

    const parsed = contactSchema.safeParse(JSON.parse(brut));

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", issues: parsed.error.flatten().fieldErrors },
        { status: 422 },
      );
    }

    const { name, email, subject, message } = parsed.data;
    await prisma.contactMessage.create({
      data: { name, email, subject: subject || null, message },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
